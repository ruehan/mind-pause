from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.user import UserRole, AuthProvider


# Base schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    nickname: str = Field(..., min_length=2, max_length=100)
    profile_image_url: Optional[str] = None


# Request schemas
class UserCreate(UserBase):
    """회원가입 요청 스키마"""
    password: str = Field(..., min_length=8, max_length=100)

    @validator('password')
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('비밀번호는 최소 하나의 숫자를 포함해야 합니다')
        if not any(char.isalpha() for char in v):
            raise ValueError('비밀번호는 최소 하나의 문자를 포함해야 합니다')
        return v


class UserLogin(BaseModel):
    """로그인 요청 스키마"""
    email: EmailStr
    password: str


# Response schemas
class UserResponse(UserBase):
    """사용자 응답 스키마"""
    id: UUID
    role: UserRole
    auth_provider: Optional[AuthProvider] = None
    is_anonymous: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    """토큰 응답 스키마"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """토큰 페이로드 스키마"""
    user_id: Optional[str] = None
    email: Optional[str] = None
