from fastapi import APIRouter
from app.api.v1.endpoints import auth, ai_character, conversation, community, emotion, challenge

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["인증"])
api_router.include_router(ai_character.router, prefix="/ai-characters", tags=["AI 캐릭터"])
api_router.include_router(conversation.router, prefix="/chat/conversations", tags=["AI 채팅"])
api_router.include_router(community.router, prefix="/community", tags=["커뮤니티"])
api_router.include_router(emotion.router, prefix="/emotion", tags=["감정 기록"])
api_router.include_router(challenge.router, prefix="/challenges", tags=["챌린지"])
