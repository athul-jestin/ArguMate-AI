import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api import api_router
from app.database import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Verify DB connectivity on startup, dispose the engine on shutdown."""
    async with engine.connect():
        pass
    yield
    await engine.dispose()


app = FastAPI(
    title="ArguMate-AI",
    description="Agentic Adversarial AI Debate System",
    version="1.0.0",
    lifespan=lifespan,
)

origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def read_root():
    return {
        "message": "ArguMate-AI Agentic Adversarial Debate System",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "argumate-backend",
    }
