import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.session import DebateSession
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.session import SessionCreate, SessionResponseFull, SessionResponseMinimal

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/", response_model=list[SessionResponseMinimal])
async def list_sessions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(DebateSession)
        .where(DebateSession.user_id == current_user.id)
        .order_by(DebateSession.created_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=SessionResponseMinimal)
async def create_session(
    session_in: SessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_session = DebateSession(
        user_id=current_user.id,
        topic=session_in.topic,
        key_points=session_in.key_points,
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session


@router.get("/{session_id}", response_model=SessionResponseFull)
async def get_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(DebateSession).where(DebateSession.id == session_id, DebateSession.user_id == current_user.id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.refresh(session, attribute_names=["messages"])
    return session


@router.delete("/{session_id}")
async def delete_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(DebateSession).where(DebateSession.id == session_id, DebateSession.user_id == current_user.id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()
    return {"message": "Session deleted"}
