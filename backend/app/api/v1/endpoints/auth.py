from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.models.user import User, AuthProvider
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    일반 회원가입

    - **email**: 이메일 주소 (중복 불가)
    - **nickname**: 닉네임 (2-100자, 중복 불가)
    - **password**: 비밀번호 (8-100자, 최소 1개의 숫자와 문자 포함)
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


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    일반 로그인

    - **email**: 이메일 주소
    - **password**: 비밀번호

    Returns:
    - **access_token**: JWT 액세스 토큰
    - **token_type**: 토큰 타입 (bearer)
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


@router.get("/me", response_model=UserResponse)
async def get_current_user(db: Session = Depends(get_db)):
    """
    현재 로그인한 사용자 정보 조회

    (추후 JWT 인증 미들웨어 추가 필요)
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
