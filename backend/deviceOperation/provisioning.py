from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
from backend import models, schemas, database
from sqlalchemy.orm import Session
from backend.database import get_db
from typing import List
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
import os
import hashlib
import random
import time

# Create a router instance
router = APIRouter(
    prefix="/v1/device",  # All routes in this file will start with /devices
    tags=["device"]    # For API documentation grouping
)

def generateDevicePassword():
    current_time = datetime.utcnow()
    random_stuff = os.urandom(16).hex()  # Generate some random stuff
    time_str = current_time.strftime("%Y%m%d%H%M%S%f") + random_stuff
    return hashlib.sha256(time_str.encode()).hexdigest()[:24]

def createDevice(deviceMac, customerName, deviceName,  db):
    
    current_time = datetime.utcnow()
    
    user = db.query(models.User).filter(models.User.username == customerName).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    devicePassword = generateDevicePassword()

    new_device = models.Device(
        name=deviceName,
        mac_address=deviceMac,
        created_at=current_time,
        devicePassword=devicePassword,
        user_id=user.user_id
    )

    db.add(new_device)

    from mqtt.ACL import register_and_enable_device
    register_and_enable_device(deviceMac, customerName, devicePassword)

    db.commit()
    db.refresh(new_device)

    return new_device

# Example device route
@router.post("/provisioning")
async def provisioning(data: dict, db: Session = Depends(get_db)):
    try:
        deviceMac = data.get("deviceMac")
        customerName = data.get("customerName")
        deviceName = data.get("deviceName")

        if not deviceMac or not customerName:
            raise HTTPException(status_code=400, detail="Missing required field: deviceMac")
        if not customerName:
            raise HTTPException(status_code=400, detail="Missing required field: customerName")

        # Check if the device is already present in the database
        device = db.query(models.Device).filter(models.Device.mac_address == deviceMac).first()

        if not device:
            # Check if DEVICE_AUTO_ADD is enabled in the environment
            load_dotenv()
            device_auto_add = os.getenv("DEVICE_AUTO_ADD", "false").lower() == "true"

            if device_auto_add:
                device = createDevice(deviceMac, customerName, deviceName, db)
            else:
                raise HTTPException(status_code=403, detail="Device unknown, impossible to provision")

        # Load the user and get the devicePassword
        user = db.query(models.User).filter(models.User.username == customerName).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"devicePassword": device.devicePassword}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


