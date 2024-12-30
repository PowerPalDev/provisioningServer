from fastapi import FastAPI, Depends, HTTPException, Security, Request
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
from backend import models, schemas, database
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.database import get_db
from typing import List
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from utility.logging import logger, Category
from utility.context import context
from typing_extensions import TypedDict, Optional
from utility.token import verify_token, verify_is_user,create_access_token
from backend.models import User 
import paho.mqtt.client as mqtt

from contextlib import asynccontextmanager

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

#include the subrouters
from backend.deviceOperation.provisioning import router as device_router
app.include_router(device_router)

from backend.mqtt.mqtt import router as mqtt_router
app.include_router(mqtt_router)

from backend.admin.endpoint import router as admin_router
app.include_router(admin_router)

from backend.user.endpoint import router as user_router
app.include_router(user_router)

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


    
# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Provisioning Server API"}

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.active:
        raise HTTPException(status_code=401, detail="User not Active")
    payload = {"user_id": user.user_id, "user_role": user.role}
    token = create_access_token(payload)
    return {"access_token": token, "token_type": "bearer"}



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
    #standard python does not have atomic operations, so we need to use a lock
    with shared_request_id.get_lock():
        return shared_request_id.value

def increment_request_id():
    #standard python does not have atomic operations, so we need to use a lock
    with shared_request_id.get_lock():
        shared_request_id.value += 1
        return shared_request_id.value




@app.middleware("http")
async def middleware(request: Request, call_next):
    try:
        #logger.info(Category.USER, "access", "generic request" ,"detailed information", ip_address=request.client.host)
        user = User()
        user.ip_address = request.client.host
        context.user.set(user)
        requestId = increment_request_id()
        context.requestId.set(requestId)
        saveRequestId(requestId)
                    
        response = await call_next(request)
        return response
    
    except Exception as e:
        # Log the exception with the endpoint path
        print("Unhandled exception occurred at endpoint %s: %s", request.url.path, e)
        # Re-raise the exception so FastAPI can handle it appropriately
        raise e
