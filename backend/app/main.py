from fastapi import FastAPI
from app.api.debate import router as debate_router

app = FastAPI(
    title="ArguMate-AI",
    description="Agentic Adversarial AI Debate System",
    version="1.0.0"
)

app.include_router(debate_router)
