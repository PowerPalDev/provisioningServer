import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utility.context import context
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from backend.schemas import User

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

security = HTTPBearer()

# Update token verification function
async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])

        user = context.user.get()
        user.user_id = payload["user_id"]
        user.role=payload["user_role"]
        user.active=True

        context.user.set(user)
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Funzione per verificare il ruolo
def verify_is_admin():
    role = context.user.get().role
    if role != "admin": 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin Access Required",
            headers={"WWW-Authenticate": "Bearer"},
        )