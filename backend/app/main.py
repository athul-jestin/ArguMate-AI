from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.api.debate import router as debate_router

app = FastAPI(
    title="ArguMate-AI",
    description="Agentic Adversarial AI Debate System",
    version="1.0.0"
)

# Add CORS middleware
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(debate_router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "message": "ArguMate-AI Agentic Adversarial Debate System",
        "version": "1.0.0",
        "status": "🟢 Running"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "argumate-backend"
    }


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    try:
        from app.db.config import check_db_connection
        await check_db_connection()
    except ImportError:
        pass
    except Exception:
        pass


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    pass
