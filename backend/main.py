from fastapi import FastAPI, Depends, HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
from backend import models, schemas, database
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.database import get_db
from typing import List
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
import hashlib
import jwt
from fastapi.middleware.cors import CORSMiddleware
import os
from utility.logging import logger, Category
from utility.context import context
from typing_extensions import TypedDict, Optional

load_dotenv()
security = HTTPBearer()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

app = FastAPI(
    title="Provisioning Server API",
    description="API for device provisioning",
    version="1.0.0",
    debug=True,
    openapi_tags=[
        {
            "name": "auth",
            "description": "Authentication operations"
        },
        {
            "name": "devices",
            "description": "Device management operations"
        }
    ]
)

from backend.deviceOperation.provisioning import router as device_router
app.include_router(device_router)

from backend.mqtt.mqtt import router as mqtt_router
app.include_router(mqtt_router)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Provisioning Server API",
        version="1.0.0",  # Explicitly specify the OpenAPI version here
        description="API for device provisioning",
        routes=app.routes,
    )
    
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}
       
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Update token verification function
async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        context.userId.set(payload["sub"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Provisioning Server API"}

# Register a new user
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate,
                 db: Session = Depends(get_db),
                 token: dict = Depends(verify_token)
                 ):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    current_time = datetime.utcnow()
    new_user = models.User(username=user.username, password=user.password, created_at=current_time)

    from mqtt.ACL import register_and_enable_user

    if not register_and_enable_user(new_user.username, new_user.password):
        raise HTTPException(status_code=500, detail="Failed to register and enable MQTT user")

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# List all users
@app.get("/users/", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db),
              token: dict = Depends(verify_token)):
    return db.query(models.User).all()

# Add a new device
@app.post("/users/{user_id}/devices/", response_model=schemas.Device)
def add_device(user_id: int,
               device: schemas.DeviceCreate,
               db: Session = Depends(get_db),
               token: dict = Depends(verify_token)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    from .deviceOperation.provisioning import createDevice
    device.mac_address = device.mac_address.upper()
    new_device = createDevice(device, db_user.username,db)
    if new_device is None:
        raise HTTPException(status_code=500, detail="Failed to create device")
    
    return new_device


class DeviceWithUser(TypedDict):
    id: int
    mac_address: str
    name: str
    created_at: str
    notes: Optional[str]
    user_name: str

# List all devices
@app.get("/devices", response_model=List[DeviceWithUser])
def get_devices(db: Session = Depends(get_db),
                token: dict = Depends(verify_token)):
    query = text("""
    SELECT d.id,
           d.mac_address,
           d.name,
           d.created_at,
           d.notes,
           u.username
    FROM devices as d
    JOIN users as u ON d.user_id = u.user_id
""")
    result = db.execute(query).fetchall()
    #no idea if is possible to do in auto
    devices = [
        {
            "id": row.id,
            "mac_address": row.mac_address,
            "name": row.name,
            "created_at": row.created_at.isoformat() if row.created_at else None,  # Convert datetime to string
            "notes": row.notes,
            "user_name": row.username
        }
        for row in result
    ]
    return JSONResponse(content=devices)

# Remove a device
@app.delete("/devices/{device_id}")
def remove_device(device_id: int,
                  db: Session = Depends(get_db),
                  token: dict = Depends(verify_token)):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"message": "Device removed"}

# Add login endpoint
@app.post("/login")
def login(username: str,
          password: str,
          db: Session = Depends(get_db)):
    user = db.query(models.Admin).filter(models.Admin.username == username).first()
    if not user or user.password != password or not user.active:  # In production, use proper password hashing
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.admin_id})
    return {"access_token": token, "token_type": "bearer"}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def saveRequestId(requestId,force=False):
    # Only save to disk when request ID is divisible by 100 to reduce I/O
    if requestId % 100 != 0 and not force:
        return
    """Save the current request ID to disk"""
    try:
        with open('request.dat', 'w') as f:
            f.write(str(requestId))
    except Exception:
        # If we can't save, just continue with current value
        pass
    
def loadRequestId() -> int:
    """Load the last request ID from disk, or return 0 if file doesn't exist"""
    try:
        with open('request.dat', 'r') as f:
            #we bump the value by 100 to avoid duplicating in logs
            return int(f.read().strip()) + 100
    except FileNotFoundError:
        return 0
    except Exception:
        return 0
    
#how to have in multiprocessing mode a shared variable ?
# For multiprocessing shared variables, we can use multiprocessing.Value
from multiprocessing import Value
import ctypes

# Create a shared counter using multiprocessing.Value
# 'i' specifies integer type, initial value is 0
shared_request_id = Value(ctypes.c_int, 0)
shared_request_id.value = loadRequestId()
saveRequestId(shared_request_id.value,True)

# Update context.py to use the shared value:
def get_request_id():
    #stnadard python does not have atomic operations, so we need to use a lock
    with shared_request_id.get_lock():
        return shared_request_id.value

def increment_request_id():
    #stnadard python does not have atomic operations, so we need to use a lock
    with shared_request_id.get_lock():
        shared_request_id.value += 1
        return shared_request_id.value



        

@app.middleware("http")
async def log_exceptions_middleware(request: Request, call_next):
    try:
        #logger.info(Category.USER, "access", "generic request" ,"detailed information", ip_address=request.client.host)
        context.userIp.set(request.client.host)
        requestId = increment_request_id()
        context.requestId.set(requestId)
        saveRequestId(requestId)
        userIp = context.userIp.get()
        response = await call_next(request)
        return response
    except Exception as e:
        # Log the exception with the endpoint path
        print("Unhandled exception occurred at endpoint %s: %s", request.url.path, e)
        # Re-raise the exception so FastAPI can handle it appropriately
        raise e
