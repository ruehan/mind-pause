"""
API 공통 의존성 및 권한 체크
"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User


def require_registered_user(current_user: User = Depends(lambda: None)):
    """
    정회원만 접근 가능 (게스트 사용자 차단)

    사용 예시:
    @router.post("/posts", dependencies=[Depends(require_registered_user)])
    """
    # TODO: JWT에서 current_user 가져오도록 수정 필요
    # 현재는 임시로 구현
    if current_user and current_user.is_anonymous:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 기능은 정회원만 사용할 수 있습니다. 회원가입을 진행해주세요."
        )
    return current_user


async def check_guest_limits(
    current_user: User,
    db: Session = Depends(get_db),
    resource_type: str = None,
    max_count: int = 1
):
    """
    게스트 사용자의 리소스 생성 제한 체크

    Args:
        current_user: 현재 사용자
        db: 데이터베이스 세션
        resource_type: 체크할 리소스 타입 (예: 'conversation', 'character')
        max_count: 최대 허용 개수

    Raises:
        HTTPException: 제한 초과 시
    """
    if not current_user.is_anonymous:
        return  # 정회원은 제한 없음

    # 리소스 타입별 제한 체크
    if resource_type == "conversation":
        from app.models.conversation import Conversation
        count = db.query(Conversation).filter(
            Conversation.user_id == current_user.id
        ).count()

        if count >= max_count:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"게스트는 AI 대화를 {max_count}개까지만 생성할 수 있습니다. 정회원으로 전환하시면 무제한으로 사용할 수 있어요!"
            )

    elif resource_type == "ai_character":
        from app.models.ai_character import AICharacter
        count = db.query(AICharacter).filter(
            AICharacter.user_id == current_user.id
        ).count()

        if count >= max_count:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"게스트는 AI 캐릭터를 {max_count}개까지만 생성할 수 있습니다. 정회원으로 전환하시면 여러 AI 친구를 만들 수 있어요!"
            )
