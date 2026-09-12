from fastapi import APIRouter

from app.routers import auth, debates, sessions

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(sessions.router, tags=["sessions"])
api_router.include_router(debates.router, tags=["debates"])
