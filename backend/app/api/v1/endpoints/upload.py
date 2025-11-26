"""
이미지 업로드 API 엔드포인트
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import cloudinary
import cloudinary.uploader
from typing import Optional

from app.core.config import settings
from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User

router = APIRouter()

# Cloudinary 초기화
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


@router.post(
    "/image",
    summary="이미지 업로드",
    description="이미지를 Cloudinary에 업로드하고 URL을 반환합니다"
)
async def upload_image(
    file: UploadFile = File(...),
    folder: Optional[str] = "mind-pause",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    이미지 업로드
    
    Args:
        file: 업로드할 이미지 파일
        folder: Cloudinary 폴더 경로 (기본: mind-pause)
        
    Returns:
        업로드된 이미지 URL 및 메타데이터
    """
    # 파일 형식 검증
    allowed_formats = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"지원하지 않는 파일 형식입니다. 허용 형식: {', '.join(allowed_formats)}"
        )
    
    # 파일 크기 검증 (10MB)
    max_size = 10 * 1024 * 1024  # 10MB in bytes
    contents = await file.read()
    if len(contents) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="파일 크기는 10MB를 초과할 수 없습니다"
        )
    
    try:
        # Cloudinary에 업로드
        result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type="image",
            # 최적화 옵션
            quality="auto",
            fetch_format="auto",
            # 메타데이터
            context=f"user_id={current_user.id}"
        )
        
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "format": result["format"],
            "width": result["width"],
            "height": result["height"],
            "size": result["bytes"]
        }
        
    except Exception as e:
        print(f"Image upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"이미지 업로드 중 오류가 발생했습니다: {str(e)}"
        )


@router.delete(
    "/image/{public_id:path}",
    summary="이미지 삭제",
    description="Cloudinary에서 이미지를 삭제합니다"
)
async def delete_image(
    public_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    이미지 삭제
    
    Args:
        public_id: Cloudinary public ID
        
    Returns:
        삭제 결과
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        
        if result["result"] == "ok":
            return {"message": "이미지가 성공적으로 삭제되었습니다"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="이미지를 찾을 수 없습니다"
            )
            
    except Exception as e:
        print(f"Image deletion error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"이미지 삭제 중 오류가 발생했습니다: {str(e)}"
        )
