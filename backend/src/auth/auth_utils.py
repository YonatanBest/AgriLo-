import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.db import SessionLocal
from src.db.chat_models import User as UserDB

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

security = HTTPBearer()


def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    print(f"🔐 Processing token: {token[:20]}...")

    if not SECRET_KEY:
        print("❌ JWT_SECRET_KEY not set!")
        raise HTTPException(status_code=500, detail="Server configuration error")

    user_id = decode_access_token(token)
    print(f"👤 Decoded user_id: {user_id}")

    if not user_id:
        print("❌ Invalid or expired token")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = SessionLocal()
    user = db.query(UserDB).filter_by(user_id=user_id).first()
    db.close()

    if not user:
        print(f"❌ User not found for user_id: {user_id}")
        raise HTTPException(status_code=401, detail="User not found")

    print(f"✅ Authenticated user: {user.email}")
    return user  # Return the actual User object
