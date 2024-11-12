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

# Create a router instance
router = APIRouter(
    prefix="/v1/device",  # All routes in this file will start with /devices
    tags=["device"]    # For API documentation grouping
)


def createDevice(deviceMac, customerName, deviceName,  db):
    
    user = db.query(models.User).filter(models.User.username == customerName).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_device = models.Device(
        name=deviceName,
        mac_address=deviceMac,
        created_at=datetime.utcnow(),
        user_id=user.user_id
    )


    db.add(new_device)
    db.commit()
    db.refresh(new_device)

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
        existing_device = db.query(models.Device).filter(models.Device.mac_address == deviceMac).first()

        if not existing_device:
            # Check if DEVICE_AUTO_ADD is enabled in the environment
            load_dotenv()
            device_auto_add = os.getenv("DEVICE_AUTO_ADD", "false").lower() == "true"

            if device_auto_add:
                createDevice(deviceMac, customerName, deviceName, db)
            else:
                raise HTTPException(status_code=403, detail="Device unknown, impossible to provision")

        # Load the user and get the devicePassword
        user = db.query(models.User).filter(models.User.username == customerName).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        devicePassword = user.devicePassword
        return {"devicePassword": devicePassword}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


