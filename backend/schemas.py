from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime, date, time

# Device Schemas
class DeviceBase(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
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
    id: Optional[int] = None
    user_id: Optional[int] = None

    def load(self, sqlalchemy_model):
        #this should be a factory method and based on the type of the device we should create the correct device,
        #  but for now we only have shelly devices, so it is ok
        self.id = sqlalchemy_model.id
        self.user_id = sqlalchemy_model.user_id
        self.mac_address = sqlalchemy_model.mac_address
        self.name = sqlalchemy_model.name

        self.type = sqlalchemy_model.type
        self.serial_number = sqlalchemy_model.serial_number
        self.status = sqlalchemy_model.status
        self.firmware_version = sqlalchemy_model.firmware_version
        self.registration_date = sqlalchemy_model.registration_date
        self.last_seen = sqlalchemy_model.last_seen
        self.ip_address = sqlalchemy_model.ip_address
        self.prov_key = sqlalchemy_model.prov_key
        self.config = sqlalchemy_model.config
        self.isonline = sqlalchemy_model.isonline
        self.encryption_key = sqlalchemy_model.encryption_key
        self.auth_token = sqlalchemy_model.auth_token
        self.notes = sqlalchemy_model.notes
        self.created_at = sqlalchemy_model.created_at
        return self
    
    def get_short_mac_address(self):
        # Remove colons and convert to uppercase
        if self.mac_address:
            return self.mac_address.replace(':', '').upper()
        return None
    
    def compose_topic(self):
        return f"user/{self.user_id}/device/{self.get_short_mac_address()}"

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserList(UserBase):
    user_id: int
    created_at: Optional[datetime] = None
    active: bool = None

class User(UserList, UserCreate):
    devices: List[Device] = []
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True
