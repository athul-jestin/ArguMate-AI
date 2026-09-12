import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.message import Message
from app.models.session import DebateSession
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.debate import TurnResponse
from app.services.debate_service import process_debate_turn

router = APIRouter(prefix="/sessions", tags=["debates"])


@router.post("/{session_id}/turns", response_model=TurnResponse)
async def create_turn(
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

    max_trip_result = await db.execute(
        select(func.max(Message.trip_number)).where(Message.session_id == session_id)
    )
    next_trip_number = (max_trip_result.scalar() or 0) + 1

    turn = await process_debate_turn(db, session, next_trip_number)
    return turn
