import sqlalchemy as sa
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
from app.db.base_class import Base


class ChatHistory(Base):
    id = sa.Column(sa.Integer, primary_key=True)
    chat_id = sa.Column(sa.Integer, sa.ForeignKey("chat.id"), nullable=False)
    pros_agent_response = sa.Column(sa.Text, nullable=False)
    cons_agent_response = sa.Column(sa.Text, nullable=False)
    fact_checker_response = sa.Column(JSON, nullable=True)
    created_on = sa.Column(sa.DateTime, default=datetime.utcnow, nullable=False)
    last_modified_on = sa.Column(
        sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    is_active = sa.Column(sa.Boolean, default=True, nullable=False)
