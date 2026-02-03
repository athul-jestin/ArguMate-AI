from fastapi import APIRouter
from app.schemas.debate import DebateRequest, DebateResponse
from app.services.debate_engine import DebateEngine

router = APIRouter(prefix="/debate", tags=["Debate"])

@router.post("/run", response_model=DebateResponse)
def run_debate(payload: DebateRequest):
    engine = DebateEngine(payload.topic)
    turns = engine.run(payload.rounds)

    return {
        "topic": payload.topic,
        "turns": turns
    }
