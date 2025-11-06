from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional
from datetime import datetime
from uuid import UUID


# Request schemas
class LikeCreate(BaseModel):
    """좋아요 생성 요청 스키마"""
    post_id: Optional[UUID] = Field(None, description="게시글 ID")
    comment_id: Optional[UUID] = Field(None, description="댓글 ID")

    @model_validator(mode='after')
    def check_at_least_one(self):
        """post_id 또는 comment_id 중 하나는 반드시 있어야 함"""
        if self.post_id is None and self.comment_id is None:
            raise ValueError('post_id 또는 comment_id 중 하나는 필수입니다')
        return self

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "post_id": "123e4567-e89b-12d3-a456-426614174000",
                "comment_id": None
            }
        }
    )


# Response schemas
class LikeResponse(BaseModel):
    """좋아요 응답 스키마"""
    id: UUID = Field(..., description="좋아요 고유 ID")
    user_id: UUID = Field(..., description="사용자 ID")
    post_id: Optional[UUID] = Field(None, description="게시글 ID")
    comment_id: Optional[UUID] = Field(None, description="댓글 ID")
    created_at: datetime = Field(..., description="생성 일시")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174003",
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "post_id": "123e4567-e89b-12d3-a456-426614174000",
                "comment_id": None,
                "created_at": "2024-01-01T11:00:00Z"
            }
        }
    )
