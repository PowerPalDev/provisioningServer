from fastapi import FastAPI, Depends, HTTPException
from backend import models, schemas, database
from sqlalchemy.orm import Session
from backend.database import get_db

from typing import List


app = FastAPI()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Provisioning Server API"}

# Register a new user
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = models.User(username=user.username, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# List all users
@app.get("/users/", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

# Add a new device
@app.post("/users/{user_id}/devices/", response_model=schemas.Device)
def add_device(user_id: int, device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    new_device = models.Device(device_name=device.device_name, rating=device.rating, user_id=user_id)
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

# List all devices
@app.get("/devices/", response_model=List[schemas.Device])
def get_devices(db: Session = Depends(get_db)):
    return db.query(models.Device).all()

# Remove a device
@app.delete("/devices/{device_id}")
def remove_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"message": "Device removed"}
