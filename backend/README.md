# Mind Pause Backend API

FastAPI 기반 Mind Pause 백엔드 서버

## 🚀 빠른 시작

### 1. Python 가상환경 설정

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어서 필요한 값 수정
```

### 4. 서버 실행

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

서버가 http://localhost:8000 에서 실행됩니다.

## 📚 API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/api/v1/redoc

## 🔐 인증 API

### 회원가입

```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "nickname": "사용자닉네임",
  "password": "password123"
}
```

### 로그인

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 현재 사용자 정보

```bash
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

## 📁 프로젝트 구조

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   └── auth.py      # 인증 엔드포인트
│   │       └── api.py           # API 라우터
│   ├── core/
│   │   ├── config.py            # 설정
│   │   └── security.py          # JWT, 비밀번호 해싱
│   ├── db/
│   │   └── database.py          # DB 연결
│   ├── models/
│   │   └── user.py              # SQLAlchemy 모델
│   ├── schemas/
│   │   └── user.py              # Pydantic 스키마
│   └── main.py                  # FastAPI 앱
├── tests/                       # 테스트
├── .env                         # 환경 변수
├── .env.example                 # 환경 변수 예시
├── requirements.txt             # 의존성
└── README.md                    # 이 파일
```

## 🗄️ 데이터베이스

- **DB**: CockroachDB Serverless (PostgreSQL 호환)
- **ORM**: SQLAlchemy
- **Migration**: Alembic (추후 설정 필요)

## 🔧 개발 도구

### 코드 포맷팅

```bash
pip install black
black app/
```

### 타입 체크

```bash
pip install mypy
mypy app/
```

### 테스트

```bash
pip install pytest
pytest
```

## 📝 TODO

- [ ] JWT 인증 미들웨어 추가
- [ ] 회원정보 수정 API
- [ ] 비밀번호 변경 API
- [ ] 소셜 로그인 (Google, Kakao, Naver)
- [ ] 이메일 인증
- [ ] Rate limiting
- [ ] 로깅
- [ ] 테스트 코드

## 🌐 배포

GCP Cloud Run 배포 예정

## 📄 라이센스

MIT
