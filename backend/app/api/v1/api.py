from fastapi import APIRouter
from app.api.v1.endpoints import auth, ai_character

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["인증"])
api_router.include_router(ai_character.router, prefix="/ai-characters", tags=["AI 캐릭터"])
