from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.agents.debate_engine import DebateEngine

router = APIRouter(prefix="/debate", tags=["Debate"])


class DebateStartRequest(BaseModel):
    topic: str
    discussion_points: List[str]


class Message(BaseModel):
    type: str  # "debate" or "fact-checker"
    agent: Optional[str] = None  # "Alpha" or "Beta"
    content: Optional[str] = None


class DebateContinueRequest(BaseModel):
    topic: str
    chat_history: List[dict]


class DebateStartResponse(BaseModel):
    alpha_opening: str
    beta_response: str
    fact_check: dict


@router.post("/start", response_model=DebateStartResponse)
async def start_debate(payload: DebateStartRequest):
    """
    Start a new debate between Alpha (PRO) and Beta (CON) agents.
    
    - topic: The debate topic
    - discussion_points: List of key points to discuss
    """
    try:
        engine = DebateEngine(payload.topic)
        
        # Generate Alpha's opening statement (PRO)
        alpha_opening = engine.pro.respond(payload.topic)
        
        # Generate Beta's response (CON)
        beta_response = engine.con.respond(payload.topic, alpha_opening)
        
        # Perform fact checking
        alpha_facts = engine.fact_checker.check(alpha_opening)
        beta_facts = engine.fact_checker.check(beta_response)
        
        fact_check = {
            "alpha_claims": alpha_facts,
            "beta_claims": beta_facts
        }
        
        return {
            "alpha_opening": alpha_opening,
            "beta_response": beta_response,
            "fact_check": fact_check
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/continue")
async def continue_debate(payload: DebateContinueRequest):
    """
    Continue an existing debate.
    
    - topic: The debate topic
    - chat_history: Previous messages in the debate
    """
    try:
        engine = DebateEngine(payload.topic)
        
        # Get the last message from chat history
        last_message = None
        for msg in reversed(payload.chat_history):
            if msg.get("type") == "debate":
                last_message = msg.get("content")
                break
        
        # Generate Alpha's response
        alpha_response = engine.pro.respond(payload.topic, last_message or "")
        
        # Generate Beta's response
        beta_response = engine.con.respond(payload.topic, alpha_response)
        
        # Perform fact checking
        alpha_facts = engine.fact_checker.check(alpha_response)
        beta_facts = engine.fact_checker.check(beta_response)
        
        fact_check = {
            "alpha_claims": alpha_facts,
            "beta_claims": beta_facts
        }
        
        return {
            "alpha_response": alpha_response,
            "beta_response": beta_response,
            "fact_check": fact_check
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
