from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Time, Boolean, JSON
from sqlalchemy.dialects.postgresql import INET, CHAR
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from typing_extensions import TypedDict, Optional
from sqlalchemy import BigInteger, Text, Float

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(String)
    active = Column(Boolean)
    devices = relationship("Device", back_populates="owner")


class Device(Base):
    __tablename__ = 'devices'

    id = Column(Integer, primary_key=True, autoincrement=True,nullable=False)
    name = Column(String)
    devicePassword = Column(String)
    type = Column(String)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    serial_number = Column(String)
    status = Column(Integer)
    firmware_version = Column(String)
    registration_date = Column(Date)
    last_seen = Column(Time)
    ip_address = Column(INET)
    mac_address = Column(CHAR(17))
    prov_key = Column(Integer, unique=True)
    config = Column(JSON)
    isonline = Column(Boolean)
    encryption_key = Column(String)  # Replace 'String' with the appropriate type if `key` is a custom type
    auth_token = Column(String)  # Replace 'String' with the appropriate type if `token` is a custom type
    notes = Column(String)  # Replace 'String' with the appropriate type if `note` is a custom type
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="devices")

class DeviceWithUser(TypedDict):
    id: int
    mac_address: str
    name: str
    created_at: str
    notes: Optional[str]
    username: str

class DeviceWithoutUser(TypedDict):
    id: int
    mac_address: str
    name: str
    created_at: str
    notes: Optional[str]

class Log(Base):
    __tablename__ = 'log'
    __table_args__ = {'schema': 'log'}  # log are in a different schema

    id = Column(Integer, primary_key=True, server_default="nextval('log_id_seq')")
    ts = Column(Integer)
    us = Column(Float)
    ip = Column(INET)
    userId = Column(Integer)
    instanceId = Column(Integer,default=0)
    requestId = Column(BigInteger)
    level = Column(String(255))
    category = Column(String(255))
    subCategory = Column(String(1024))
    message = Column(String(4096))
    detail = Column(Text)
    stack_trace = Column(Text)

