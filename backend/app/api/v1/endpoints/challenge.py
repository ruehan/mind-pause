"""챌린지 API 엔드포인트 (승인 시스템 포함)"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.core.security import get_current_user, require_admin
from app.models.user import User
from app.models.challenge import Challenge, UserChallenge, ChallengeType, ChallengeStatus, ChallengeTemplate
from app.models.emotion_log import EmotionLog
from app.schemas.challenge import (
    ChallengeResponse,
    ChallengeListResponse,
    ChallengeCreate,
    ChallengeUpdate,
    ChallengeApprove,
    ChallengeReject,
    UserChallengeResponse,
    UserChallengeListResponse,
    ChallengeTemplateResponse,
    ChallengeTemplateListResponse,
)

router = APIRouter()


# ============================================
# 챌린지 템플릿 API
# ============================================

@router.get(
    "/templates",
    response_model=ChallengeTemplateListResponse,
    summary="챌린지 템플릿 목록 조회",
    description="사용 가능한 챌린지 템플릿 목록을 조회합니다"
)
async def get_challenge_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """챌린지 템플릿 목록 조회"""
    templates = db.query(ChallengeTemplate).filter(
        ChallengeTemplate.is_active == True
    ).all()

    return ChallengeTemplateListResponse(
        templates=templates,
        total=len(templates)
    )


# ============================================
# 챌린지 API (일반 사용자)
# ============================================

@router.get(
    "",
    response_model=ChallengeListResponse,
    summary="챌린지 목록 조회",
    description="승인된 챌린지 목록을 조회합니다"
)
async def get_challenges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """승인된 챌린지 목록 조회"""
    # 승인된 챌린지만 조회
    challenges = db.query(Challenge).filter(
        Challenge.status == ChallengeStatus.APPROVED
    ).all()

    # 각 챌린지의 참여자 수 계산
    challenge_responses = []
    for challenge in challenges:
        participants_count = db.query(UserChallenge).filter(
            UserChallenge.challenge_id == challenge.id
        ).count()

        challenge_dict = {
            **challenge.__dict__,
            "participants_count": participants_count
        }
        challenge_responses.append(ChallengeResponse(**challenge_dict))

    return ChallengeListResponse(
        challenges=challenge_responses,
        total=len(challenges)
    )


@router.post(
    "",
    response_model=ChallengeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="챌린지 생성",
    description="템플릿을 기반으로 새 챌린지를 생성합니다 (관리자 승인 필요)"
)
async def create_challenge(
    challenge_data: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """챌린지 생성 (템플릿 기반)"""
    # 템플릿 확인
    template = db.query(ChallengeTemplate).filter(
        ChallengeTemplate.id == challenge_data.template_id,
        ChallengeTemplate.is_active == True
    ).first()

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="템플릿을 찾을 수 없습니다"
        )

    # 날짜 유효성 검사
    if challenge_data.start_date >= challenge_data.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="종료일은 시작일보다 이후여야 합니다"
        )

    # 챌린지 생성 (pending 상태)
    challenge = Challenge(
        template_id=template.id,
        created_by=current_user.id,
        title=template.title,
        description=template.description,
        challenge_type=template.challenge_type,
        duration_days=template.default_duration_days,
        target_count=template.default_target_count,
        icon=template.icon,
        reward_badge=template.reward_badge,
        status=ChallengeStatus.PENDING,
        start_date=challenge_data.start_date,
        end_date=challenge_data.end_date
    )

    db.add(challenge)
    db.commit()
    db.refresh(challenge)

    # 챌린지 생성자 자동 참여
    user_challenge = UserChallenge(
        user_id=current_user.id,
        challenge_id=challenge.id,
        current_streak=0,
        best_streak=0,
        completed_count=0
    )
    db.add(user_challenge)
    db.commit()

    challenge_dict = {
        **challenge.__dict__,
        "participants_count": 1  # 생성자 포함
    }

    return ChallengeResponse(**challenge_dict)


@router.get(
    "/{challenge_id}",
    response_model=ChallengeResponse,
    summary="챌린지 상세 조회",
    description="특정 챌린지의 상세 정보를 조회합니다"
)
async def get_challenge(
    challenge_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """챌린지 상세 조회"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="챌린지를 찾을 수 없습니다"
        )

    # 참여자 수 계산
    participants_count = db.query(UserChallenge).filter(
        UserChallenge.challenge_id == challenge.id
    ).count()

    challenge_dict = {
        **challenge.__dict__,
        "participants_count": participants_count
    }

    return ChallengeResponse(**challenge_dict)


@router.post(
    "/{challenge_id}/join",
    response_model=UserChallengeResponse,
    summary="챌린지 참여",
    description="승인된 챌린지에 참여합니다"
)
async def join_challenge(
    challenge_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """챌린지 참여"""
    # 챌린지 존재 및 승인 확인
    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id,
        Challenge.status == ChallengeStatus.APPROVED
    ).first()

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="챌린지를 찾을 수 없거나 아직 승인되지 않았습니다"
        )

    # 이미 참여 중인지 확인
    existing = db.query(UserChallenge).filter(
        UserChallenge.user_id == current_user.id,
        UserChallenge.challenge_id == challenge_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 참여 중인 챌린지입니다"
        )

    # 챌린지 참여 생성
    user_challenge = UserChallenge(
        user_id=current_user.id,
        challenge_id=challenge_id,
        current_streak=0,
        best_streak=0,
        completed_count=0
    )

    db.add(user_challenge)
    db.commit()
    db.refresh(user_challenge)

    # 챌린지 정보 포함
    user_challenge.challenge = challenge

    # 진행률 계산
    progress_percentage = (user_challenge.completed_count / challenge.target_count) * 100

    # 참여자 수 계산
    participants_count = db.query(UserChallenge).filter(
        UserChallenge.challenge_id == challenge.id
    ).count()

    response_dict = {
        **user_challenge.__dict__,
        "challenge": ChallengeResponse(
            **{**challenge.__dict__, "participants_count": participants_count}
        ),
        "progress_percentage": progress_percentage
    }

    return UserChallengeResponse(**response_dict)


@router.get(
    "/my/list",
    response_model=UserChallengeListResponse,
    summary="내 챌린지 목록 조회",
    description="참여 중인 챌린지 목록을 조회합니다"
)
async def get_my_challenges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """내 챌린지 목록 조회"""
    user_challenges = db.query(UserChallenge).filter(
        UserChallenge.user_id == current_user.id
    ).all()

    responses = []
    for uc in user_challenges:
        # 챌린지 정보 로드
        challenge = db.query(Challenge).filter(Challenge.id == uc.challenge_id).first()

        if not challenge:
            continue

        # 참여자 수 계산
        participants_count = db.query(UserChallenge).filter(
            UserChallenge.challenge_id == challenge.id
        ).count()

        # 진행률 계산
        progress_percentage = (uc.completed_count / challenge.target_count) * 100

        response_dict = {
            **uc.__dict__,
            "challenge": ChallengeResponse(
                **{**challenge.__dict__, "participants_count": participants_count}
            ),
            "progress_percentage": min(progress_percentage, 100.0)
        }
        responses.append(UserChallengeResponse(**response_dict))

    return UserChallengeListResponse(
        user_challenges=responses,
        total=len(responses)
    )


@router.get(
    "/my/created",
    response_model=ChallengeListResponse,
    summary="내가 생성한 챌린지 목록 조회",
    description="내가 생성한 챌린지 목록을 조회합니다 (승인 대기 중인 것 포함)"
)
async def get_my_created_challenges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """내가 생성한 챌린지 목록 조회"""
    challenges = db.query(Challenge).filter(
        Challenge.created_by == current_user.id
    ).all()

    challenge_responses = []
    for challenge in challenges:
        # 참여자 수 계산
        participants_count = db.query(UserChallenge).filter(
            UserChallenge.challenge_id == challenge.id
        ).count()

        challenge_dict = {
            **challenge.__dict__,
            "participants_count": participants_count
        }
        challenge_responses.append(ChallengeResponse(**challenge_dict))

    return ChallengeListResponse(
        challenges=challenge_responses,
        total=len(challenges)
    )


# ============================================
# 관리자 API
# ============================================

@router.get(
    "/admin/pending",
    response_model=ChallengeListResponse,
    summary="승인 대기 챌린지 목록",
    description="[관리자] 승인 대기 중인 챌린지 목록을 조회합니다"
)
async def get_pending_challenges(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """승인 대기 챌린지 목록 조회 (관리자)"""

    # 승인 대기 중인 챌린지 조회
    challenges = db.query(Challenge).filter(
        Challenge.status == ChallengeStatus.PENDING
    ).all()

    challenge_responses = []
    for challenge in challenges:
        challenge_dict = {
            **challenge.__dict__,
            "participants_count": 0
        }
        challenge_responses.append(ChallengeResponse(**challenge_dict))

    return ChallengeListResponse(
        challenges=challenge_responses,
        total=len(challenges)
    )


@router.post(
    "/{challenge_id}/approve",
    response_model=ChallengeResponse,
    summary="챌린지 승인",
    description="[관리자] 챌린지를 승인합니다"
)
async def approve_challenge(
    challenge_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """챌린지 승인 (관리자)"""

    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="챌린지를 찾을 수 없습니다"
        )

    if challenge.status != ChallengeStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="승인 대기 중인 챌린지만 승인할 수 있습니다"
        )

    # 승인 처리
    challenge.status = ChallengeStatus.APPROVED
    db.commit()
    db.refresh(challenge)

    challenge_dict = {
        **challenge.__dict__,
        "participants_count": 0
    }

    return ChallengeResponse(**challenge_dict)


@router.post(
    "/{challenge_id}/reject",
    response_model=ChallengeResponse,
    summary="챌린지 거부",
    description="[관리자] 챌린지를 거부합니다"
)
async def reject_challenge(
    challenge_id: UUID,
    reject_data: ChallengeReject,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """챌린지 거부 (관리자)"""

    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="챌린지를 찾을 수 없습니다"
        )

    if challenge.status != ChallengeStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="승인 대기 중인 챌린지만 거부할 수 있습니다"
        )

    # 거부 처리 및 사유 저장
    challenge.status = ChallengeStatus.REJECTED
    challenge.rejected_reason = reject_data.reason
    db.commit()
    db.refresh(challenge)

    challenge_dict = {
        **challenge.__dict__,
        "participants_count": 0
    }

    return ChallengeResponse(**challenge_dict)


# ============================================
# 챌린지 진행 상황 업데이트
# ============================================

def update_user_challenge_progress(
    user_id: UUID,
    db: Session
):
    """
    감정 기록 시 챌린지 진행 상황 업데이트
    (감정 기록 API에서 호출)
    """
    # 사용자의 참여 중인 챌린지 조회 (승인된 챌린지만)
    user_challenges = db.query(UserChallenge).join(Challenge).filter(
        UserChallenge.user_id == user_id,
        UserChallenge.is_completed == False,
        Challenge.status == ChallengeStatus.APPROVED
    ).all()

    today = date.today()

    for uc in user_challenges:
        challenge = db.query(Challenge).filter(Challenge.id == uc.challenge_id).first()
        if not challenge:
            continue

        # 연속 기록 챌린지만 자동 업데이트
        if challenge.challenge_type == ChallengeType.STREAK:
            # 오늘 기록이 있는지 확인
            today_log = db.query(EmotionLog).filter(
                EmotionLog.user_id == user_id,
                func.date(EmotionLog.created_at) == today
            ).first()

            if today_log:
                # 마지막 활동이 어제인 경우 스트릭 증가
                if uc.last_activity_date:
                    yesterday = today - timedelta(days=1)
                    if uc.last_activity_date == yesterday:
                        uc.current_streak += 1
                    elif uc.last_activity_date < yesterday:
                        # 연속 끊김 - 스트릭 초기화
                        uc.current_streak = 1
                else:
                    # 첫 기록
                    uc.current_streak = 1

                # 완료 횟수 증가
                uc.completed_count += 1

                # 최고 스트릭 업데이트
                if uc.current_streak > uc.best_streak:
                    uc.best_streak = uc.current_streak

                # 마지막 활동 날짜 업데이트
                uc.last_activity_date = today

                # 챌린지 완료 확인
                if uc.current_streak >= challenge.target_count:
                    uc.is_completed = True
                    uc.completed_at = datetime.utcnow()

                db.commit()
