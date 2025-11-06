from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Base schemas
class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="게시글 제목", example="오늘 정말 힘들었던 하루")
    content: str = Field(..., min_length=1, description="게시글 내용", example="오늘은 정말 힘든 하루였어요...")
    is_anonymous: bool = Field(default=False, description="익명 게시 여부")


# Request schemas
class PostCreate(PostBase):
    """게시글 작성 요청 스키마"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "오늘 정말 힘들었던 하루",
                "content": "오늘은 정말 힘든 하루였어요. 여러분은 어떻게 힘든 순간을 극복하시나요?",
                "is_anonymous": False
            }
        }
    )


class PostUpdate(BaseModel):
    """게시글 수정 요청 스키마"""
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="게시글 제목")
    content: Optional[str] = Field(None, min_length=1, description="게시글 내용")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "수정된 제목",
                "content": "수정된 내용입니다."
            }
        }
    )


# Response schemas
class PostAuthor(BaseModel):
    """게시글 작성자 정보"""
    id: Optional[UUID] = Field(None, description="사용자 ID (익명일 경우 null)")
    nickname: str = Field(..., description="작성자 닉네임")
    profile_image_url: Optional[str] = Field(None, description="프로필 이미지 URL")

    model_config = ConfigDict(from_attributes=True)


class PostResponse(PostBase):
    """게시글 응답 스키마"""
    id: UUID = Field(..., description="게시글 고유 ID")
    user_id: Optional[UUID] = Field(None, description="작성자 ID (익명일 경우 null)")
    num_likes: int = Field(..., description="좋아요 수")
    num_comments: int = Field(..., description="댓글 수")
    created_at: datetime = Field(..., description="작성 일시")
    updated_at: datetime = Field(..., description="수정 일시")
    user: Optional[PostAuthor] = Field(None, description="작성자 정보")
    is_liked: Optional[bool] = Field(None, description="현재 사용자의 좋아요 여부")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "title": "오늘 정말 힘들었던 하루",
                "content": "오늘은 정말 힘든 하루였어요. 여러분은 어떻게 힘든 순간을 극복하시나요?",
                "is_anonymous": False,
                "num_likes": 15,
                "num_comments": 8,
                "created_at": "2024-01-01T10:00:00Z",
                "updated_at": "2024-01-01T10:00:00Z",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174001",
                    "nickname": "마음쉼표유저",
                    "profile_image_url": "https://example.com/profile.jpg"
                },
                "is_liked": False
            }
        }
    )


class PostListResponse(BaseModel):
    """게시글 목록 응답 스키마"""
    posts: List[PostResponse] = Field(..., description="게시글 목록")
    total: int = Field(..., description="전체 게시글 수")
    page: int = Field(..., description="현재 페이지")
    page_size: int = Field(..., description="페이지 크기")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "posts": [],
                "total": 100,
                "page": 1,
                "page_size": 20
            }
        }
    )
