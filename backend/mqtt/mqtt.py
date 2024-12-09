from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from utility.logging import logger, Category
from backend import models
from backend.database import get_db 
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi.responses import PlainTextResponse


router = APIRouter(
    prefix="/v1/mqtt/acl",  # All routes in this file will start with /devices
    tags=["mqttAcl"]    # For API documentation grouping
)

#we have a list of special users that are allowed to connect to the MQTT broker
            #define user and password, for those users that are not in the database, for the moment hardcoded
            #later we might load from a json file
special_users = [
    {"username": "admin-user", "password": "powerpal", "acl": ["#"]},
    {"username": "test", "password": "test", "acl": ["#"]}
]

class CheckUserRequest(BaseModel):
    username: str
    password: str

@router.post("/check_user", response_class=PlainTextResponse)
async def check_user(request: CheckUserRequest, db: Session = Depends(get_db)):
    try:
        logger.info(
            Category.MQTT, 
            "check_user", 
            "",
            f"Checking if user {request.username} / {request.password} is allowed to connect to MQTT broker"
        )

        #first try to get the device from the database
        device = db.query(models.Device).filter(
            models.Device.mac_address == request.username,
            models.Device.devicePassword == request.password
        ).first()
        if device:
            return "ok"
        
        # Check if user is in special_users list
        for special_user in special_users:
            if special_user["username"] == request.username:
                if special_user["password"] == request.password:
                    return "ok"
                    

        logger.error(
            Category.MQTT,
            "check_user",
            "", 
            f"User {request.username}:{request.password} is not allowed to connect to MQTT broker"
        )
        
        return "denied"
    except Exception as e:
        logger.error(
            Category.MQTT,
            "check_user",
            "", 
            f"Error checking ACL: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=str(e))
        
class ACLCheckRequest(BaseModel):
    username: str
    topic: str

@router.post("/check_acl", response_class=PlainTextResponse)
async def check_acl(request: ACLCheckRequest, db: Session = Depends(get_db)):
    try:
        logger.info(
            Category.MQTT, 
            "check_acl", 
            "",
            f"Checking if user {request.username} can operate on {request.topic}"
        )
        allowed_topics = []

        from sqlalchemy.sql import text
        sql = text("select u.username from users as u join devices as d on d.user_id = u.user_id where d.mac_address = :username")
        result = db.execute(sql, {"username": request.username})
        user = result.fetchone()
        if user:
            allowed_topics.append(f"/user/{user.username}/#")
            if mqtt_topic_matches(allowed_topics[0],request.topic): 
                return "ok"
        
        # Check if user is in special_users list
        for special_user in special_users:
            if special_user["username"] == request.username:
                acl =special_user["acl"]
                for acl_pattern in acl:
                    if mqtt_topic_matches(acl_pattern,request.topic): 
                        return "ok"
            
        logger.error(
            Category.MQTT,
            "check_acl",
            "", 
            f"User {request.username} for topic {request.topic} is not allowed to operate on that topic, allowed topics are {allowed_topics}"
        )
        
        return "denied"
    except Exception as e:
        logger.error(
            Category.MQTT,
            "check_acl",
            "", 
            f"Error checking ACL: {str(e)}"
        )
        raise HTTPException(status_code=500, detail=str(e))
        


def mqtt_topic_matches(pattern: str, topic: str) -> bool:
    """
    Check if a topic matches an MQTT pattern, handling wildcards # and +
    
    Args:
        pattern: The ACL pattern (e.g., "user/#" or "user/+/device")
        topic: The actual topic to check (e.g., "user/john/device")
        
    Returns:
        bool: True if the topic matches the pattern, False otherwise
    """
    # Exact match
    if pattern == topic:
        return True
    
    # Handle # wildcard
    if '#' in pattern:
        base_pattern = pattern.rstrip('#').rstrip('/')
        return topic == base_pattern or topic.startswith(base_pattern + '/')
    
    # Handle + wildcard
    if '+' in pattern:
        pattern_parts = pattern.split('/')
        topic_parts = topic.split('/')
        
        if len(pattern_parts) != len(topic_parts):
            return False
            
        for p_part, t_part in zip(pattern_parts, topic_parts):
            if p_part != '+' and p_part != t_part:
                return False
        return True
    
    return False

#to test if the ACL is working, we can use the following command:
# print(mqtt_topic_matches("user/#", "user/john/device"))  # True
# print(mqtt_topic_matches("user/+/device", "user/john/device"))  # True
# print(mqtt_topic_matches("user/+/device", "user/john/device/status"))  # False
# print(mqtt_topic_matches("#", "any/topic/here"))  # True