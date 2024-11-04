from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Time, Boolean, JSON
from sqlalchemy.dialects.postgresql import INET, CHAR
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    devicePassword = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    devices = relationship("Device", back_populates="owner")


class Device(Base):
    __tablename__ = 'devices'

    id = Column(Integer, primary_key=True)
    name = Column(String)
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

