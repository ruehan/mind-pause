from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict

from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, ErrorResponse
from app.models.user import User, AuthProvider
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter()


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="회원가입",
    description="이메일과 비밀번호를 사용한 일반 회원가입",
    responses={
        201: {
            "description": "회원가입 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "email": "user@example.com",
                        "nickname": "마음쉼표유저",
                        "profile_image_url": None,
                        "role": "USER",
                        "auth_provider": "LOCAL",
                        "is_anonymous": False,
                        "created_at": "2024-01-01T00:00:00Z",
                        "last_login_at": None
                    }
                }
            }
        },
        400: {
            "description": "잘못된 요청 (이메일/닉네임 중복, 비밀번호 형식 오류)",
            "model": ErrorResponse,
            "content": {
                "application/json": {
                    "examples": {
                        "email_exists": {
                            "summary": "이메일 중복",
                            "value": {"detail": "이미 사용 중인 이메일입니다"}
                        },
                        "nickname_exists": {
                            "summary": "닉네임 중복",
                            "value": {"detail": "이미 사용 중인 닉네임입니다"}
                        }
                    }
                }
            }
        },
        422: {
            "description": "유효성 검증 실패",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "password"],
                                "msg": "비밀번호는 최소 하나의 숫자를 포함해야 합니다",
                                "type": "value_error"
                            }
                        ]
                    }
                }
            }
        }
    }
)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    ## 일반 회원가입

    이메일과 비밀번호를 사용하여 새 계정을 생성합니다.

    ### 요청 본문
    - **email**: 이메일 주소 (중복 불가)
    - **nickname**: 닉네임 (2-100자, 중복 불가)
    - **password**: 비밀번호 (8-100자, 최소 1개의 숫자와 문자 포함)
    - **profile_image_url**: 프로필 이미지 URL (선택)

    ### 응답
    - 생성된 사용자 정보 (비밀번호 제외)

    ### 에러
    - **400**: 이메일 또는 닉네임이 이미 사용 중
    - **422**: 유효성 검증 실패 (비밀번호 형식 등)
    """
    # 이메일 중복 체크
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 이메일입니다"
        )

    # 닉네임 중복 체크
    if db.query(User).filter(User.nickname == user_data.nickname).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용 중인 닉네임입니다"
        )

    # 새 사용자 생성
    new_user = User(
        email=user_data.email,
        nickname=user_data.nickname,
        password_hash=get_password_hash(user_data.password),
        auth_provider=AuthProvider.LOCAL,
        profile_image_url=user_data.profile_image_url
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
    "/login",
    response_model=Token,
    summary="로그인",
    description="이메일과 비밀번호를 사용한 로그인 및 JWT 토큰 발급",
    responses={
        200: {
            "description": "로그인 성공 - JWT 토큰 반환",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                        "token_type": "bearer"
                    }
                }
            }
        },
        400: {
            "description": "소셜 로그인 계정 사용 시도",
            "model": ErrorResponse,
            "content": {
                "application/json": {
                    "example": {
                        "detail": "GOOGLE 계정입니다. 해당 소셜 로그인을 사용해주세요."
                    }
                }
            }
        },
        401: {
            "description": "인증 실패 (이메일 또는 비밀번호 오류)",
            "model": ErrorResponse,
            "content": {
                "application/json": {
                    "example": {
                        "detail": "이메일 또는 비밀번호가 올바르지 않습니다"
                    }
                }
            }
        }
    }
)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    ## 로그인

    이메일과 비밀번호로 로그인하고 JWT 액세스 토큰을 받습니다.

    ### 요청 본문
    - **email**: 이메일 주소
    - **password**: 비밀번호

    ### 응답
    - **access_token**: JWT 액세스 토큰 (만료 시간: 30분)
    - **token_type**: 토큰 타입 (bearer)

    ### 사용 방법
    1. 이 엔드포인트로 로그인
    2. 받은 access_token을 저장
    3. 이후 API 요청 시 `Authorization: Bearer <access_token>` 헤더에 포함

    ### 에러
    - **400**: 소셜 로그인으로 가입한 계정
    - **401**: 이메일 또는 비밀번호가 올바르지 않음
    """
    # 사용자 조회
    user = db.query(User).filter(
        User.email == login_data.email,
        User.is_deleted == False
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # LOCAL 로그인 사용자인지 확인
    if user.auth_provider != AuthProvider.LOCAL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{user.auth_provider.value} 계정입니다. 해당 소셜 로그인을 사용해주세요."
        )

    # 비밀번호 확인
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 마지막 로그인 시간 업데이트
    user.last_login_at = datetime.utcnow()
    db.commit()

    # JWT 토큰 생성
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get(
    "/me",
    response_model=UserResponse,
    summary="현재 사용자 정보 조회",
    description="JWT 토큰으로 인증된 현재 사용자의 정보를 조회합니다",
    responses={
        200: {
            "description": "현재 사용자 정보",
            "content": {
                "application/json": {
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
            }
        },
        401: {
            "description": "인증 실패 (토큰 없음 또는 만료)",
            "model": ErrorResponse
        },
        404: {
            "description": "사용자를 찾을 수 없음",
            "model": ErrorResponse
        }
    }
)
async def get_current_user(db: Session = Depends(get_db)):
    """
    ## 현재 사용자 정보 조회

    JWT 토큰으로 인증된 사용자의 정보를 조회합니다.

    ### 인증
    - **Required**: Authorization 헤더에 Bearer 토큰 필요
    - 형식: `Authorization: Bearer <access_token>`

    ### 응답
    - 현재 로그인한 사용자의 전체 정보 (비밀번호 제외)

    ### 주의
    - 이 엔드포인트는 JWT 인증이 필요합니다
    - 토큰이 없거나 만료된 경우 401 에러 반환
    - (현재는 임시로 첫 번째 사용자 반환 - 추후 JWT 미들웨어 추가 예정)
    """
    # TODO: JWT 토큰에서 user_id 추출
    # 임시로 첫 번째 사용자 반환
    user = db.query(User).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다"
        )
    return user
