from pydantic import BaseModel
from typing import List, Optional

class DeviceBase(BaseModel):
    device_name: str
    rating: int

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    device_id: int
    user_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    devices: List[Device] = []

    class Config:
        orm_mode = True
