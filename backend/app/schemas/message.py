from pydantic import BaseModel
import uuid
from datetime import datetime
from app.models.message import RoleEnum

class MessageResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    trip_number: int
    role: RoleEnum
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
