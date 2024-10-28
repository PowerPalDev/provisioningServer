from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    devices = relationship("Device", back_populates="owner")


class Device(Base):
    __tablename__ = 'devices'

    device_id = Column(Integer, primary_key=True, index=True)
    device_name = Column(String)
    rating = Column(Integer)
    user_id = Column(Integer, ForeignKey('users.user_id'))

    owner = relationship("User", back_populates="devices")
