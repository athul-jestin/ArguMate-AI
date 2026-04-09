from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime
from app.schemas.message import MessageResponse

class SessionCreate(BaseModel):
    topic: str
    key_points: Optional[str] = None

class SessionResponseMinimal(BaseModel):
    id: uuid.UUID
    topic: str
    key_points: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SessionResponseFull(SessionResponseMinimal):
    messages: List[MessageResponse] = []
