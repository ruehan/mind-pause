"""챌린지 API 엔드포인트"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta
from typing import List
from uuid import UUID

from app.db.database import get_db
from app.models.user import User
from app.models.challenge import Challenge, UserChallenge, ChallengeType
from app.models.emotion_log import EmotionLog
from app.schemas.challenge import (
    ChallengeResponse,
    ChallengeListResponse,
    UserChallengeJoin,
    UserChallengeResponse,
    UserChallengeListResponse,
)
from app.api.dependencies import get_current_user

router = APIRouter()


@router.get(
    "",
    response_model=ChallengeListResponse,
    summary="챌린지 목록 조회",
    description="활성화된 챌린지 목록을 조회합니다"
)
async def get_challenges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """챌린지 목록 조회"""
    # 활성화된 챌린지만 조회
    challenges = db.query(Challenge).filter(
        Challenge.is_active == True
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
    description="특정 챌린지에 참여합니다"
)
async def join_challenge(
    challenge_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """챌린지 참여"""
    # 챌린지 존재 확인
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="챌린지를 찾을 수 없습니다"
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

    response_dict = {
        **user_challenge.__dict__,
        "challenge": ChallengeResponse(
            **{**challenge.__dict__, "participants_count": 0}
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


def update_user_challenge_progress(
    user_id: UUID,
    db: Session
):
    """
    감정 기록 시 챌린지 진행 상황 업데이트
    (감정 기록 API에서 호출)
    """
    # 사용자의 참여 중인 챌린지 조회
    user_challenges = db.query(UserChallenge).filter(
        UserChallenge.user_id == user_id,
        UserChallenge.is_completed == False
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
