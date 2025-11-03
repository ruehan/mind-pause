from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="""
    ## Mind Pause API 🧘‍♀️

    정신 건강 관리 플랫폼 **Mind Pause**의 백엔드 API입니다.

    ### 주요 기능

    * **🔐 인증**: 이메일/비밀번호 로그인 및 소셜 로그인 (Google, Kakao, Naver)
    * **😊 감정 기록**: 일일 감정 상태 추적 및 AI 피드백
    * **💬 AI 코치**: 정신 건강 관련 대화형 AI 상담
    * **👥 커뮤니티**: 익명 게시판 및 댓글
    * **🎯 챌린지**: 회복 미션 및 목표 달성 추적
    * **🔔 알림**: 실시간 알림 시스템

    ### 기술 스택

    * **Framework**: FastAPI 0.115+
    * **Database**: CockroachDB (PostgreSQL 호환)
    * **ORM**: SQLAlchemy 2.0+
    * **Authentication**: JWT (JSON Web Tokens)
    * **Deployment**: GCP Cloud Run

    ### API 문서

    * **Swagger UI**: [/api/v1/docs](/api/v1/docs) - 인터랙티브 API 테스트
    * **ReDoc**: [/api/v1/redoc](/api/v1/redoc) - 읽기 쉬운 API 문서

    ### 프론트엔드

    * **Framework**: React Router v7
    * **Repository**: [GitHub](https://github.com/yourusername/mind-pause)

    ---

    Made with ❤️ by Mind Pause Team
    """,
    version="1.0.0",
    contact={
        "name": "Mind Pause Team",
        "email": "support@mindpause.com",
    },
    license_info={
        "name": "MIT",
    },
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    openapi_tags=[
        {
            "name": "인증",
            "description": "회원가입, 로그인, 사용자 정보 관리",
        },
        {
            "name": "감정 기록",
            "description": "일일 감정 상태 추적 및 분석 (추후 구현)",
        },
        {
            "name": "AI 코치",
            "description": "AI 기반 정신 건강 상담 (추후 구현)",
        },
        {
            "name": "커뮤니티",
            "description": "익명 게시판 및 댓글 시스템 (추후 구현)",
        },
    ]
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Mind Pause API",
        "version": "1.0.0",
        "docs": f"{settings.API_V1_PREFIX}/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
