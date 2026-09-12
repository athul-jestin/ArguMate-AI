import uuid
from datetime import datetime

from app.models.message import RoleEnum
from app.schemas.base import CamelModel


class MessageResponse(CamelModel):
    id: uuid.UUID
    session_id: uuid.UUID
    trip_number: int
    role: RoleEnum
    content: str
    created_at: datetime
