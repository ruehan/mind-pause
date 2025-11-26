from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Application
    APP_NAME: str = "Mind Pause API"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # AI/LLM 설정
    GOOGLE_API_KEY: str  # Gemini API 키
    LLM_MODEL: str = "gemini-2.5-flash-lite"  # 기본 모델
    LLM_TEMPERATURE: float = 0.7  # 응답의 창의성 (0.0 ~ 1.0)
    LLM_MAX_OUTPUT_TOKENS: int = 2048  # 최대 출력 토큰 수

    # Cloudinary 설정
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
