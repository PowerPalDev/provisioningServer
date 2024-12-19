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
from fastapi.middleware.cors import CORSMiddleware
import os
from utility.logging import logger, Category
from utility.context import context
from typing_extensions import TypedDict, Optional
from fastapi import APIRouter
from utility.token import verify_token, create_access_token


router = APIRouter(
    prefix="/v1/admin",  # All routes in this file will start with /devices
    tags=["Admin"]    # For API documentation grouping
)


# Register a new user
@router.post("/users/", response_model=schemas.UserList)
def create_user(user: schemas.UserCreate,
                 db: Session = Depends(get_db),
                 token: dict = Depends(verify_token)

                 ):
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    current_time = datetime.utcnow()
    new_user = models.User(username=user.username, password=user.password, created_at=current_time, role="user", active=True)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# List all users
@router.get("/users/", response_model=List[schemas.UserList])
def get_users(db: Session = Depends(get_db),
              token: dict = Depends(verify_token)):
    MU = models.User
    return db.query(MU).filter(MU.role!="admin").add_columns(MU.user_id,MU.username,MU.active,MU.created_at).all()

# Add a new device
@router.post("/users/{user_id}/devices/", response_model=schemas.Device)
def add_device(user_id: int,
               device: schemas.DeviceCreate,
               db: Session = Depends(get_db),
               token: dict = Depends(verify_token)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    from backend.deviceOperation.provisioning import createDevice
    device.mac_address = device.mac_address.upper()
    new_device = createDevice(device, db_user.username,db)
    if new_device is None:
        raise HTTPException(status_code=500, detail="Failed to create device")
    
    return new_device


# List all devices
@router.get("/devices", response_model=List[models.DeviceWithUser])
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
@router.delete("/devices/{device_id}")
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
@router.post("/login")
def login(username: str,
          password: str,
          db: Session = Depends(get_db)):
    # Check if user exists and is an admin
    user = db.query(models.User).filter(models.User.username == username).first()

    if not user or user.password != password:  # In production, use proper password hashing
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.active:
        raise HTTPException(status_code=401, detail="User is not active")
    
    if not user.active or user.role != "admin":  # In production, use proper password hashing
        raise HTTPException(status_code=401, detail="Invalid Role")
    
    payload = {"user_id": user.user_id,"user_role":user.role}
    token = create_access_token(payload)
    return {"access_token": token, "token_type": "bearer"}