import uuid
from datetime import datetime

from app.schemas.base import CamelModel
from app.schemas.message import MessageResponse


class SessionCreate(CamelModel):
    topic: str
    key_points: str | None = None


class SessionResponseMinimal(CamelModel):
    id: uuid.UUID
    topic: str
    key_points: str | None = None
    created_at: datetime
    updated_at: datetime


class SessionResponseFull(SessionResponseMinimal):
    messages: list[MessageResponse] = []
