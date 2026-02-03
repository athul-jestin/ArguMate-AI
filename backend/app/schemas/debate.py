from pydantic import BaseModel
from typing import List

class DebateRequest(BaseModel):
    topic: str
    rounds: int = 1

class DebateTurn(BaseModel):
    speaker: str
    statement: str
    fact_check: str

class DebateResponse(BaseModel):
    topic: str
    turns: List[DebateTurn]
