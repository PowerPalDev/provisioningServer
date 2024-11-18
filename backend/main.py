from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
from backend import models, schemas, database
from sqlalchemy.orm import Session
from backend.database import get_db
from typing import List
from datetime import datetime, timedelta
import hashlib
import jwt
from fastapi.middleware.cors import CORSMiddleware
import os
from backend.deviceOperation.provisioning import router as device_router


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
app.include_router(device_router)

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

    random_stuff = os.urandom(16).hex()  # Generate some random stuff
    time_str = current_time.strftime("%Y%m%d%H%M%S%f") + random_stuff
    new_user.devicePassword = hashlib.sha256(time_str.encode()).hexdigest()[:24]

    from mqtt.ACL import register_and_enable_user

    if not register_and_enable_user(new_user.username, new_user.devicePassword):
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
    new_device = models.Device(
        name=device.name,
        type=device.type,
        serial_number=device.serial_number,
        status=device.status,
        firmware_version=device.firmware_version,
        registration_date=device.registration_date,
        last_seen=device.last_seen,
        ip_address=device.ip_address,
        mac_address=device.mac_address,
        prov_key=device.prov_key,
        config=device.config,
        isonline=device.isonline,
        encryption_key=device.encryption_key,
        auth_token=device.auth_token,
        notes=device.notes,
        created_at=datetime.utcnow(),
        user_id=user_id
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

# List all devices
@app.get("/devices/", response_model=List[schemas.Device])
def get_devices(db: Session = Depends(get_db),
                token: dict = Depends(verify_token)):
    return db.query(models.Device).all()

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
    
    token = create_access_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


