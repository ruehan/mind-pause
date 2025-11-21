# Authentication 체크포인트 리포트

## 예상 작업 완료 현황

- [x] 회원가입(Create Account) 페이지를 구현한다.
- [x] 로그인(Sign in) 페이지를 구현한다.
- [x] `action` 함수를 사용해 인증 로직을 구현한다. (FastAPI 백엔드 API + AuthContext 사용)

## 1. 회원가입 페이지

### Github 커밋 링크

- 메인 커밋: https://github.com/ruehan/mind-pause/pull/5
- 관련 커밋:
  - `ad460b2` - 프론트엔드 인증 기능 구현
  - `e0c89b4` - FastAPI 백엔드 구현 및 CockroachDB 연동

### 구현 파일

- **페이지**: `app/routes/login.tsx` (로그인/회원가입 통합 페이지)
- **컴포넌트**: `app/components/auth/SignupForm.tsx`
- **백엔드 API**: `backend/app/api/v1/endpoints/auth.py`
- **인증 컨텍스트**: `app/contexts/AuthContext.tsx`

### 핵심 코드

```typescript
// app/components/auth/SignupForm.tsx
export function SignupForm() {
  const { signup } = useAuth();

  // 입력 필드 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    // - 닉네임: 2자 이상
    // - 이메일: 올바른 형식
    // - 비밀번호: 8자 이상, 영문+숫자 조합
    // - 약관 동의: 필수

    await signup(email, nickname, password);
    // 회원가입 후 자동 로그인 및 대시보드로 이동
  };

  return (
    // Form UI with Input, Checkbox, Button 컴포넌트
  );
}
```

### 백엔드 API 엔드포인트

```python
@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. 이메일 중복 체크
    # 2. 닉네임 중복 체크
    # 3. 비밀번호 해싱 (bcrypt)
    # 4. User 레코드 생성
    # 5. 사용자 정보 반환
```

### 주요 기능

1. **입력 필드**
   - 닉네임 (2자 이상)
   - 이메일 (형식 검증)
   - 비밀번호 (8자 이상, 영문+숫자 조합)

2. **유효성 검사**
   - 실시간 에러 표시
   - 입력 시 에러 자동 제거
   - 서버 응답 에러 처리

3. **약관 동의**
   - 이용약관 동의 (필수)
   - 개인정보처리방침 동의 (필수)
   - 약관 보기 링크 제공

4. **소셜 로그인**
   - Google, Kakao, Naver 버튼 UI 구현
   - 추후 OAuth 연동 예정

5. **자동 로그인**
   - 회원가입 성공 시 자동 로그인
   - JWT 토큰 저장
   - 대시보드로 자동 이동

## 2. 로그인 페이지

### Github 커밋 링크

- 동일 PR: https://github.com/ruehan/mind-pause/pull/5
- 관련 커밋:
  - `a77bd7b` - 토큰 만료 처리, 로그아웃 기능, 실제 사용자 데이터 적용
  - `6a60dd0` - 불필요한 메시지 로딩 표시 제거 및 로그인 유지 시간 연장

### 구현 파일

- **페이지**: `app/routes/login.tsx`
- **컴포넌트**: `app/components/auth/LoginForm.tsx`
- **백엔드 API**: `backend/app/api/v1/endpoints/auth.py`

### 핵심 코드

```typescript
// app/components/auth/LoginForm.tsx
export function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    // - 이메일: 올바른 형식
    // - 비밀번호: 필수 입력

    await login(email, password);
    // 로그인 성공 시 대시보드로 이동
  };

  return (
    // Form UI with Input, Button 컴포넌트
  );
}
```

### 백엔드 API 엔드포인트

```python
@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # 1. 사용자 조회
    # 2. LOCAL 로그인 사용자 확인 (소셜 로그인 구분)
    # 3. 비밀번호 검증
    # 4. 마지막 로그인 시간 업데이트
    # 5. JWT 토큰 생성 및 반환
```

### 주요 기능

1. **입력 필드**
   - 이메일 (형식 검증)
   - 비밀번호

2. **인증 처리**
   - JWT 토큰 기반 인증
   - Access Token (만료 시간: 7일)
   - 자동 토큰 갱신 및 만료 처리

3. **에러 처리**
   - 이메일/비밀번호 오류 처리
   - 소셜 로그인 계정 구분
   - 네트워크 에러 처리

4. **추가 기능**
   - 비밀번호 찾기 링크
   - 회원가입 페이지로 이동
   - 소셜 로그인 버튼

5. **인증 상태 관리**
   - AuthContext를 통한 전역 상태 관리
   - 토큰 만료 시 자동 로그아웃
   - 보호된 라우트 접근 제어

## 3. 인증 로직 구현 (Action 함수)

### AuthContext 구현

```typescript
// app/contexts/AuthContext.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 함수
  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    api.saveToken(response.access_token);
    const userData = await api.getCurrentUser();
    setUser(userData);
  };

  // 회원가입 함수
  const signup = async (email: string, nickname: string, password: string) => {
    const userData = await api.signup({ email, nickname, password });
    setUser(userData);
    // 자동 로그인
    const loginResponse = await api.login({ email, password });
    api.saveToken(loginResponse.access_token);
  };

  // 로그아웃 함수
  const logout = () => {
    api.logout();
    setUser(null);
  };

  // 토큰 만료 처리
  const handleUnauthorized = useCallback(() => {
    api.logout();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user,
      login, signup, logout, refreshUser, handleUnauthorized
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### API 통신 (lib/api.ts)

- **baseURL**: `http://localhost:8000/api/v1`
- **인증 헤더**: `Authorization: Bearer {token}`
- **토큰 저장**: localStorage에 JWT 토큰 저장
- **토큰 만료**: JWT 디코딩하여 만료 시간 확인
- **자동 로그아웃**: 토큰 만료 시 자동으로 로그아웃 처리

### 백엔드 보안

```python
# backend/app/core/security.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

## 4. 데이터베이스 스키마

### User 모델

```python
class User(Base):
    __tablename__ = "user"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    email = Column(String(255), unique=True, index=True)
    nickname = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255), nullable=True)  # 소셜 로그인은 NULL
    profile_image_url = Column(String(500), nullable=True)

    role = Column(Enum(UserRole), default=UserRole.USER)
    auth_provider = Column(Enum(AuthProvider), default=AuthProvider.LOCAL)
    auth_provider_id = Column(String(255), nullable=True)

    is_anonymous = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
```

### 인증 제공자 (AuthProvider)

- **LOCAL**: 이메일/비밀번호 로그인
- **GOOGLE**: Google OAuth 로그인 (구현 예정)
- **KAKAO**: Kakao OAuth 로그인 (구현 예정)
- **NAVER**: Naver OAuth 로그인 (구현 예정)

## 5. 추가 구현 사항

### 구현 완료

1. ✅ 회원가입 페이지 UI 및 로직
2. ✅ 로그인 페이지 UI 및 로직
3. ✅ JWT 토큰 기반 인증
4. ✅ 토큰 만료 처리 및 자동 로그아웃
5. ✅ 전역 인증 상태 관리 (AuthContext)
6. ✅ 보호된 라우트 구현 (RequireAuth 컴포넌트)
7. ✅ 백엔드 API 엔드포인트 (signup, login, me)
8. ✅ 비밀번호 해싱 및 검증 (bcrypt)
9. ✅ 이메일/닉네임 중복 검사
10. ✅ 입력 필드 유효성 검사

### 구현 예정

1. ⏳ 소셜 로그인 (Google, Kakao, Naver OAuth)
2. ⏳ 비밀번호 찾기 및 재설정 기능
3. ⏳ 이메일 인증 (회원가입 시)
4. ⏳ Refresh Token 구현 (현재는 Access Token만 사용)
5. ⏳ Rate Limiting (무차별 대입 공격 방지)
6. ⏳ 2FA (Two-Factor Authentication)
7. ⏳ 익명 로그인 및 정식 회원 전환

## 6. 인증 전략 문서

프로젝트의 전체 인증 전략은 `docs/auth-strategy.md`에 상세히 문서화되어 있습니다.

### 주요 내용

- JWT Token 구조 (Access Token + Refresh Token)
- 소셜 로그인 OAuth 2.0 흐름
- 권한 제어 (RBAC - Role-Based Access Control)
- 보안 고려사항 (HTTPS, CORS, Rate Limiting, XSS, SQL Injection)
- 테스트 전략

## 7. 기술 스택

### Frontend

- **React Router v7**: 라우팅 및 데이터 로더
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **Context API**: 전역 상태 관리

### Backend

- **FastAPI**: 고성능 Python 웹 프레임워크
- **SQLAlchemy**: ORM
- **CockroachDB**: 분산 SQL 데이터베이스
- **Pydantic**: 데이터 검증
- **python-jose**: JWT 토큰 처리
- **passlib**: 비밀번호 해싱

### 보안

- **bcrypt**: 비밀번호 해싱 (salt rounds: 10)
- **JWT**: Stateless 인증
- **CORS**: Cross-Origin Resource Sharing
- **HTTPS**: 프로덕션 환경 필수

## 8. 테스트 결과

### 수동 테스트 완료

1. ✅ 회원가입 - 정상 동작
2. ✅ 회원가입 - 이메일 중복 검사
3. ✅ 회원가입 - 닉네임 중복 검사
4. ✅ 회원가입 - 비밀번호 형식 검증
5. ✅ 로그인 - 정상 동작
6. ✅ 로그인 - 잘못된 이메일/비밀번호
7. ✅ 로그인 - 소셜 로그인 계정 구분
8. ✅ 토큰 만료 - 자동 로그아웃
9. ✅ 보호된 라우트 - 접근 제어
10. ✅ 로그아웃 - 토큰 삭제

### 자동 테스트

- 현재 자동 테스트 미구현
- 추후 Jest, Pytest 도입 예정
