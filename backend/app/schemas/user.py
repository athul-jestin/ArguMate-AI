import uuid
from datetime import datetime

from pydantic import EmailStr

from app.schemas.base import CamelModel


class UserCreate(CamelModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(CamelModel):
    email: EmailStr
    password: str


class UserResponse(CamelModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    created_at: datetime


class TokenResponse(CamelModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefreshRequest(CamelModel):
    refresh_token: str


class AccessTokenResponse(CamelModel):
    access_token: str
