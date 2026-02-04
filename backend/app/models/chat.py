import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime

from app.db.base_class import Base

class Chat(Base):
    id = sa.Column(sa.Integer, primary_key=True)
    title = sa.Column(sa.String(), nullable=False)
    created_on = sa.Column(sa.DateTime, default=datetime.utcnow, nullable=False)
    last_modified_on = sa.Column(
        sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    is_active = sa.Column(sa.Boolean, default=True, nullable=False)
