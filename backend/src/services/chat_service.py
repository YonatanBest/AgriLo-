import uuid
from datetime import datetime
from typing import Dict, Optional, List
from src.models.chat import ChatSession, ChatMessage
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.db.chat_models import ChatSessionDB, ChatMessageDB


class ChatSessionManager:
    def start_session(self, user_id: Optional[str] = None) -> ChatSession:
        db: Session = SessionLocal()
        session_id = str(uuid.uuid4())
        now = datetime.utcnow()
        db_session = ChatSessionDB(
            session_id=session_id, created_at=now, updated_at=now, user_id=user_id
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        db.close()
        return ChatSession(
            session_id=session_id,
            messages=[],
            created_at=now,
            updated_at=now,
            user_id=user_id,
        )

    def get_session(self, session_id: str) -> Optional[ChatSession]:
        db: Session = SessionLocal()
        db_session = db.query(ChatSessionDB).filter_by(session_id=session_id).first()
        if not db_session:
            db.close()
            return None
        messages = [
            ChatMessage(sender=m.sender, message=m.message, timestamp=m.timestamp)
            for m in db_session.messages
        ]
        session = ChatSession(
            session_id=db_session.session_id,
            messages=messages,
            created_at=db_session.created_at,
            updated_at=db_session.updated_at,
            user_id=db_session.user_id,
        )
        db.close()
        return session

    def add_message(
        self, session_id: str, sender: str, message: str
    ) -> Optional[ChatSession]:
        db: Session = SessionLocal()
        db_session = db.query(ChatSessionDB).filter_by(session_id=session_id).first()
        if not db_session:
            db.close()
            return None
        msg = ChatMessageDB(
            id=str(uuid.uuid4()),
            session_id=session_id,
            sender=sender,
            message=message,
            timestamp=datetime.utcnow(),
        )
        db_session.messages.append(msg)
        db_session.updated_at = datetime.utcnow()
        db.add(msg)
        db.commit()
        db.refresh(db_session)
        messages = [
            ChatMessage(sender=m.sender, message=m.message, timestamp=m.timestamp)
            for m in db_session.messages
        ]
        session = ChatSession(
            session_id=db_session.session_id,
            messages=messages,
            created_at=db_session.created_at,
            updated_at=db_session.updated_at,
            user_id=db_session.user_id,
        )
        db.close()
        return session

    def get_history(self, session_id: str) -> Optional[List[ChatMessage]]:
        db: Session = SessionLocal()
        db_session = db.query(ChatSessionDB).filter_by(session_id=session_id).first()
        if not db_session:
            db.close()
            return None
        messages = [
            ChatMessage(sender=m.sender, message=m.message, timestamp=m.timestamp)
            for m in db_session.messages
        ]
        db.close()
        return messages


chat_session_manager = ChatSessionManager()


