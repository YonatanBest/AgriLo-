from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ChatMessage(BaseModel):
    sender: str  # 'user' or 'llm'
    message: str
    timestamp: datetime


class ChatSession(BaseModel):
    session_id: str
    messages: List[ChatMessage] = []
    created_at: datetime
    updated_at: datetime
    user_id: Optional[str] = None


class User(BaseModel):
    user_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    preferred_language: Optional[str] = None
    crops_grown: Optional[List[str]] = None
    user_type: Optional[str] = None  # aspiring, beginner, experienced, explorer
    years_experience: Optional[int] = None
    main_goal: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserCreate(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    location: Optional[str] = None
    preferred_language: Optional[str] = None
    crops_grown: Optional[List[str]] = None
    user_type: Optional[str] = None
    years_experience: Optional[int] = None
    main_goal: Optional[str] = None
