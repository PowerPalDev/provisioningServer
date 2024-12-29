from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend import models, schemas
from backend.database import get_db
from utility.token import verify_token, verify_is_admin, create_access_token
from fastapi.responses import JSONResponse
from typing import List
from datetime import datetime
from utility.context import context
from backend.schemas import User
from fastapi import Request
from backend.models import Device
from device.shelly import ShellyDevice

router = APIRouter(
    prefix="/v1/user",
    tags=["User"]
)


#even if the middleware is already checking if the user is logged,
#we need to add the Depends as to make the automatic docs work
@router.get("/me")
async def get_user_info(token: dict = Depends(verify_token)):
    user: User = context.user.get()

    response = {
        "user_id": user.user_id,
    }
    return JSONResponse(content={"user": response})

@router.get("/devices",response_model=List[models.DeviceWithoutUser])
async def get_user_devices(token: dict = Depends(verify_token),db: Session = Depends(get_db)):
    user: User = context.user.get()
    query = text("""
    SELECT d.id,
           d.mac_address,
           d.name,
           d.created_at,
           d.notes
    FROM devices as d
    WHERE d.user_id = :user_id
""")
    result = db.execute(query, {"user_id": user.user_id}).fetchall()
    devices = [
        {
            "id": row.id,
            "mac_address": row.mac_address,
            "name": row.name,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "notes": row.notes
        }
        for row in result
    ]
    return JSONResponse(content=devices)


#toggle a device on / off
#device_id is our INTERNAL ID, to avoid hardcoding the mac address login in the frontend
@router.post("/devices/{device_id}/toggle")
async def toggle_device(state: str, device_id: str, token: dict = Depends(verify_token),db: Session = Depends(get_db)):   
    if state != "true" and state != "false":
        raise HTTPException(status_code=400, detail=f"Invalid state parameter {state}")
    
    #get the mac address from the device_id

    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    shelly = ShellyDevice()
    shelly.load(device)
    shelly.toggle(state)

    return JSONResponse(content={"message": "Device toggled"})