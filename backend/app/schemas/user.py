from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.user import UserRole, AuthProvider


# Base schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = Field(None, description="사용자 이메일", example="user@example.com")
    nickname: str = Field(..., min_length=2, max_length=100, description="닉네임 (2-100자)", example="마음쉼표유저")
    profile_image_url: Optional[str] = Field(None, description="프로필 이미지 URL", example="https://example.com/profile.jpg")


# Request schemas
class UserCreate(UserBase):
    """회원가입 요청 스키마"""
    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="비밀번호 (8-100자, 최소 1개의 숫자와 문자 포함)",
        example="password123"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "nickname": "마음쉼표유저",
                "password": "password123",
                "profile_image_url": "https://example.com/profile.jpg"
            }
        }
    )

    @validator('password')
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('비밀번호는 최소 하나의 숫자를 포함해야 합니다')
        if not any(char.isalpha() for char in v):
            raise ValueError('비밀번호는 최소 하나의 문자를 포함해야 합니다')
        return v


class UserLogin(BaseModel):
    """로그인 요청 스키마"""
    email: EmailStr = Field(..., description="사용자 이메일", example="user@example.com")
    password: str = Field(..., description="비밀번호", example="password123")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "password123"
            }
        }
    )


# Response schemas
class UserResponse(UserBase):
    """사용자 응답 스키마"""
    id: UUID = Field(..., description="사용자 고유 ID")
    role: UserRole = Field(..., description="사용자 역할")
    auth_provider: Optional[AuthProvider] = Field(None, description="인증 제공자")
    is_anonymous: bool = Field(..., description="익명 사용자 여부")
    created_at: datetime = Field(..., description="계정 생성 일시")
    last_login_at: Optional[datetime] = Field(None, description="마지막 로그인 일시")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "nickname": "마음쉼표유저",
                "profile_image_url": "https://example.com/profile.jpg",
                "role": "USER",
                "auth_provider": "LOCAL",
                "is_anonymous": False,
                "created_at": "2024-01-01T00:00:00Z",
                "last_login_at": "2024-01-02T12:30:00Z"
            }
        }
    )


class Token(BaseModel):
    """토큰 응답 스키마"""
    access_token: str = Field(..., description="JWT 액세스 토큰", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", description="토큰 타입", example="bearer")
    user: Optional["UserResponse"] = Field(None, description="사용자 정보 (로그인 시 반환)")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                "token_type": "bearer",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "user@example.com",
                    "nickname": "마음쉼표유저",
                    "role": "USER"
                }
            }
        }
    )


class TokenData(BaseModel):
    """토큰 페이로드 스키마"""
    user_id: Optional[str] = Field(None, description="사용자 ID")
    email: Optional[str] = Field(None, description="사용자 이메일")


class ErrorResponse(BaseModel):
    """에러 응답 스키마"""
    detail: str = Field(..., description="에러 메시지", example="이미 사용 중인 이메일입니다")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "detail": "이미 사용 중인 이메일입니다"
            }
        }
    )
