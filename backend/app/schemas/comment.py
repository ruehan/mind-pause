from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Base schemas
class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, description="댓글 내용", example="좋은 글 감사합니다!")
    is_anonymous: bool = Field(default=False, description="익명 댓글 여부")


# Request schemas
class CommentCreate(CommentBase):
    """댓글 작성 요청 스키마"""
    post_id: UUID = Field(..., description="게시글 ID")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "post_id": "123e4567-e89b-12d3-a456-426614174000",
                "content": "좋은 글 감사합니다! 저도 비슷한 경험이 있어요.",
                "is_anonymous": False
            }
        }
    )


class CommentUpdate(BaseModel):
    """댓글 수정 요청 스키마"""
    content: str = Field(..., min_length=1, description="댓글 내용")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "content": "수정된 댓글 내용입니다."
            }
        }
    )


# Response schemas
class CommentAuthor(BaseModel):
    """댓글 작성자 정보"""
    id: Optional[UUID] = Field(None, description="사용자 ID (익명일 경우 null)")
    nickname: str = Field(..., description="작성자 닉네임")
    profile_image_url: Optional[str] = Field(None, description="프로필 이미지 URL")

    model_config = ConfigDict(from_attributes=True)


class CommentResponse(CommentBase):
    """댓글 응답 스키마"""
    id: UUID = Field(..., description="댓글 고유 ID")
    post_id: UUID = Field(..., description="게시글 ID")
    user_id: Optional[UUID] = Field(None, description="작성자 ID (익명일 경우 null)")
    created_at: datetime = Field(..., description="작성 일시")
    user: Optional[CommentAuthor] = Field(None, description="작성자 정보")
    num_likes: Optional[int] = Field(0, description="좋아요 수")
    is_liked: Optional[bool] = Field(None, description="현재 사용자의 좋아요 여부")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174002",
                "post_id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "content": "좋은 글 감사합니다!",
                "is_anonymous": False,
                "created_at": "2024-01-01T10:30:00Z",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174001",
                    "nickname": "마음쉼표유저",
                    "profile_image_url": "https://example.com/profile.jpg"
                },
                "num_likes": 5,
                "is_liked": False
            }
        }
    )


class CommentListResponse(BaseModel):
    """댓글 목록 응답 스키마"""
    comments: List[CommentResponse] = Field(..., description="댓글 목록")
    total: int = Field(..., description="전체 댓글 수")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "comments": [],
                "total": 8
            }
        }
    )
