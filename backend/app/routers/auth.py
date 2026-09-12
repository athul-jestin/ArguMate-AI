import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    AccessTokenResponse,
    TokenRefreshRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.auth_service import get_password_hash, verify_password
from app.utils.jwt import (
    create_access_token,
    create_refresh_token,
    get_current_user_payload,
    verify_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where((User.email == user_in.email) | (User.username == user_in.username))
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists",
        )

    new_user = User(
        email=user_in.email,
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login", response_model=TokenResponse)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    db_user = result.scalar_one_or_none()
    if not db_user or not verify_password(user_in.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(db_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh(request: TokenRefreshRequest):
    payload = verify_token(request.refresh_token)
    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    access_token = create_access_token(data={"sub": user_id})
    return {"access_token": access_token}


async def get_current_user(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
) -> User:
    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
