import uuid
from sqlalchemy import Column, DateTime, Text, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import enum
from app.database import Base
from sqlalchemy.orm import relationship

class RoleEnum(str, enum.Enum):
    user = "user"
    alpha = "alpha"
    beta = "beta"
    fact_checker = "fact_checker"

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("debate_sessions.id", ondelete="CASCADE"), nullable=False)
    trip_number = Column(Integer, nullable=False)
    role = Column(SQLEnum(RoleEnum), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("DebateSession", back_populates="messages")
