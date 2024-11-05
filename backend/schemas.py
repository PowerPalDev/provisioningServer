from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime, date, time

# Device Schemas
class DeviceBase(BaseModel):
    name: str
    type: str
    serial_number: Optional[str] = None
    status: Optional[int] = None
    firmware_version: Optional[str] = None
    registration_date: Optional[date] = None
    last_seen: Optional[time] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    prov_key: Optional[int] = None
    config: Optional[dict] = None
    isonline: Optional[bool] = None
    encryption_key: Optional[str] = None  # Assuming encryption key is a string
    auth_token: Optional[str] = None  # Assuming auth token is a string
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    devicePassword: str
    created_at: Optional[datetime] = None
    devices: List[Device] = []

    class Config:
        orm_mode = True
