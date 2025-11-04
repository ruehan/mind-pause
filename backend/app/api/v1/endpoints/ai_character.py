from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.schemas.ai_character import (
    AICharacterCreate,
    AICharacterUpdate,
    AICharacterResponse
)
from app.models.ai_character import AICharacter
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter()


@router.post(
    "",
    response_model=AICharacterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="AI 캐릭터 생성",
    description="새로운 AI 대화 캐릭터를 생성합니다"
)
async def create_character(
    character_data: AICharacterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ## AI 캐릭터 생성

    새로운 AI 대화 캐릭터를 생성합니다.

    ### 요청 본문
    - **name**: 캐릭터 이름 (2-100자)
    - **personality**: 캐릭터 성격/역할 (2-200자)
    - **description**: 캐릭터 설명 (선택)
    - **avatar_options**: 아바타 커스터마이징 옵션 JSON (선택)
    - **system_prompt**: AI 시스템 프롬프트 (선택)

    ### 응답
    - 생성된 AI 캐릭터 정보
    """
    # 사용자의 기존 활성 캐릭터를 비활성화
    db.query(AICharacter).filter(
        AICharacter.user_id == current_user.id,
        AICharacter.is_active == True
    ).update({"is_active": False})

    # 새 캐릭터 생성
    new_character = AICharacter(
        user_id=current_user.id,
        name=character_data.name,
        personality=character_data.personality,
        description=character_data.description,
        avatar_options=character_data.avatar_options,
        system_prompt=character_data.system_prompt,
        is_active=True
    )

    db.add(new_character)
    db.commit()
    db.refresh(new_character)

    return new_character


@router.get(
    "",
    response_model=List[AICharacterResponse],
    summary="AI 캐릭터 목록 조회",
    description="사용자의 AI 캐릭터 목록을 조회합니다"
)
async def list_characters(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ## AI 캐릭터 목록 조회

    현재 사용자가 생성한 모든 AI 캐릭터를 조회합니다.

    ### 응답
    - AI 캐릭터 목록 (생성일 기준 내림차순)
    """
    characters = db.query(AICharacter).filter(
        AICharacter.user_id == current_user.id
    ).order_by(AICharacter.created_at.desc()).all()

    return characters


@router.get(
    "/active",
    response_model=AICharacterResponse,
    summary="활성 AI 캐릭터 조회",
    description="현재 활성화된 AI 캐릭터를 조회합니다"
)
async def get_active_character(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ## 활성 AI 캐릭터 조회

    현재 사용자의 활성화된 AI 캐릭터를 조회합니다.

    ### 응답
    - 활성 AI 캐릭터 정보

    ### 에러
    - **404**: 활성 캐릭터가 없음
    """
    character = db.query(AICharacter).filter(
        AICharacter.user_id == current_user.id,
        AICharacter.is_active == True
    ).first()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="활성 캐릭터가 없습니다"
        )

    return character


@router.get(
    "/{character_id}",
    response_model=AICharacterResponse,
    summary="AI 캐릭터 상세 조회",
    description="특정 AI 캐릭터의 상세 정보를 조회합니다"
)
async def get_character(
    character_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ## AI 캐릭터 상세 조회

    특정 AI 캐릭터의 상세 정보를 조회합니다.

    ### 경로 매개변수
    - **character_id**: 캐릭터 고유 ID

    ### 응답
    - AI 캐릭터 상세 정보

    ### 에러
    - **404**: 캐릭터를 찾을 수 없음
    - **403**: 접근 권한 없음
    """
    character = db.query(AICharacter).filter(
        AICharacter.id == character_id
    ).first()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="캐릭터를 찾을 수 없습니다"
        )

    if character.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 캐릭터에 접근할 권한이 없습니다"
        )

    return character


@router.put(
    "/{character_id}",
    response_model=AICharacterResponse,
    summary="AI 캐릭터 수정",
    description="AI 캐릭터 정보를 수정합니다"
)
async def update_character(
    character_id: UUID,
    character_data: AICharacterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ## AI 캐릭터 수정

    AI 캐릭터의 정보를 수정합니다.

    ### 경로 매개변수
    - **character_id**: 캐릭터 고유 ID

    ### 요청 본문
    - **name**: 캐릭터 이름 (선택)
    - **personality**: 캐릭터 성격/역할 (선택)
    - **description**: 캐릭터 설명 (선택)
    - **avatar_options**: 아바타 커스터마이징 옵션 JSON (선택)
    - **system_prompt**: AI 시스템 프롬프트 (선택)
    - **is_active**: 활성 상태 (선택)

    ### 응답
    - 수정된 AI 캐릭터 정보

    ### 에러
    - **404**: 캐릭터를 찾을 수 없음
    - **403**: 접근 권한 없음
    """
    character = db.query(AICharacter).filter(
        AICharacter.id == character_id
    ).first()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="캐릭터를 찾을 수 없습니다"
        )

    if character.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 캐릭터를 수정할 권한이 없습니다"
        )

    # 활성 상태 변경 시, 기존 활성 캐릭터를 비활성화
    if character_data.is_active is True and not character.is_active:
        db.query(AICharacter).filter(
            AICharacter.user_id == current_user.id,
            AICharacter.is_active == True
        ).update({"is_active": False})

    # 업데이트할 필드만 수정
    update_data = character_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(character, field, value)

    db.commit()
    db.refresh(character)

    return character


@router.delete(
    "/{character_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="AI 캐릭터 삭제",
    description="AI 캐릭터를 삭제합니다"
)
async def delete_character(
    character_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ## AI 캐릭터 삭제

    AI 캐릭터를 영구적으로 삭제합니다.

    ### 경로 매개변수
    - **character_id**: 캐릭터 고유 ID

    ### 응답
    - 204 No Content (삭제 성공)

    ### 에러
    - **404**: 캐릭터를 찾을 수 없음
    - **403**: 접근 권한 없음
    """
    character = db.query(AICharacter).filter(
        AICharacter.id == character_id
    ).first()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="캐릭터를 찾을 수 없습니다"
        )

    if character.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 캐릭터를 삭제할 권한이 없습니다"
        )

    db.delete(character)
    db.commit()

    return None
