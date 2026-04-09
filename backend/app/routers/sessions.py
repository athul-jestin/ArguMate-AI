from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.user import User
from app.models.session import DebateSession
from app.schemas.session import SessionCreate, SessionResponseMinimal, SessionResponseFull
from app.routers.auth import get_current_user

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.get("/", response_model=List[SessionResponseMinimal])
def list_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sessions = db.query(DebateSession).filter(DebateSession.user_id == current_user.id).order_by(DebateSession.created_at.desc()).all()
    return sessions

@router.post("/", response_model=SessionResponseMinimal)
def create_session(session_in: SessionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_session = DebateSession(
        user_id=current_user.id,
        topic=session_in.topic,
        key_points=session_in.key_points
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.get("/{session_id}", response_model=SessionResponseFull)
def get_session(session_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(DebateSession).filter(DebateSession.id == session_id, DebateSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.delete("/{session_id}")
def delete_session(session_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(DebateSession).filter(DebateSession.id == session_id, DebateSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"message": "Session deleted"}
