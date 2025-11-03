# 백엔드 구현 계획서

## 개요

마음쉼표 백엔드 API 서버 구현 계획입니다.
FastAPI + PostgreSQL + Redis 기반으로 RESTful API를 구축합니다.

---

## 기술 스택

### Core Framework
- **Python 3.11**
- **FastAPI 0.109+** - 비동기 웹 프레임워크
- **Uvicorn** - ASGI 서버

### Database
- **PostgreSQL 15** - 메인 데이터베이스
- **Redis 7** - 캐싱 및 세션 스토어
- **SQLAlchemy 2.0** - ORM
- **Alembic** - 마이그레이션 도구

### Authentication
- **python-jose** - JWT 토큰
- **passlib** - 비밀번호 해싱
- **authlib** - OAuth 2.0

### AI Integration
- **OpenAI API** - GPT-3.5-turbo/GPT-4
- **langchain** (선택) - LLM 체인 관리

### Cloud & Storage
- **Google Cloud Storage** - 파일 저장
- **GCP Cloud Run** - 서버 배포

### Development
- **Pydantic** - 데이터 검증
- **pytest** - 테스트
- **Docker** - 컨테이너화

---

## 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 앱 진입점
│   ├── config.py               # 환경 설정
│   ├── database.py             # DB 연결
│   ├── dependencies.py         # 공통 의존성
│   │
│   ├── models/                 # SQLAlchemy 모델
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── emotion_log.py
│   │   ├── chat.py
│   │   ├── community.py
│   │   ├── challenge.py
│   │   └── notification.py
│   │
│   ├── schemas/                # Pydantic 스키마
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── emotion.py
│   │   ├── chat.py
│   │   ├── community.py
│   │   └── response.py
│   │
│   ├── api/                    # API 라우터
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py         # 인증 API
│   │       ├── users.py        # 사용자 관리
│   │       ├── emotions.py     # 감정 기록
│   │       ├── chat.py         # AI 채팅
│   │       ├── community.py    # 커뮤니티
│   │       ├── challenges.py   # 챌린지
│   │       ├── notifications.py # 알림
│   │       ├── files.py        # 파일 업로드
│   │       └── admin.py        # 관리자
│   │
│   ├── services/               # 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── ai_service.py
│   │   ├── emotion_service.py
│   │   ├── chat_service.py
│   │   ├── email_service.py
│   │   └── file_service.py
│   │
│   ├── utils/                  # 유틸리티
│   │   ├── __init__.py
│   │   ├── security.py         # JWT, 암호화
│   │   ├── validators.py       # 입력 검증
│   │   ├── cache.py            # Redis 캐싱
│   │   └── logger.py           # 로깅
│   │
│   └── middleware/             # 미들웨어
│       ├── __init__.py
│       ├── auth.py
│       ├── rate_limit.py
│       └── error_handler.py
│
├── alembic/                    # DB 마이그레이션
│   ├── versions/
│   └── env.py
│
├── tests/                      # 테스트
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_emotions.py
│   └── test_chat.py
│
├── .env.example
├── requirements.txt
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 구현 단계

### Phase 1: 기본 인프라 (1주)

**1.1 프로젝트 초기화**
- [x] 디렉토리 구조 생성
- [ ] 가상환경 설정
- [ ] requirements.txt 작성
- [ ] .env 파일 설정

**1.2 FastAPI 앱 구성**
- [ ] main.py 작성
- [ ] CORS 설정
- [ ] Health check 엔드포인트
- [ ] API 문서 자동 생성 (Swagger)

**1.3 데이터베이스 연결**
- [ ] PostgreSQL 연결 설정
- [ ] SQLAlchemy Base 모델 정의
- [ ] Alembic 마이그레이션 설정
- [ ] Redis 연결 설정

**1.4 기본 미들웨어**
- [ ] CORS 미들웨어
- [ ] 에러 핸들러
- [ ] 로깅 설정
- [ ] Rate limiting

---

### Phase 2: 인증 시스템 (1주)

**2.1 User 모델**
- [ ] SQLAlchemy User 모델 정의
- [ ] Pydantic 스키마 정의
- [ ] DB 마이그레이션 생성

**2.2 JWT 인증**
- [ ] JWT 토큰 생성/검증 유틸리티
- [ ] 비밀번호 해싱 (bcrypt)
- [ ] 액세스/리프레시 토큰 발급

**2.3 인증 API**
- [ ] POST /api/v1/auth/register - 회원가입
- [ ] POST /api/v1/auth/login - 로그인
- [ ] POST /api/v1/auth/refresh - 토큰 갱신
- [ ] POST /api/v1/auth/logout - 로그아웃
- [ ] POST /api/v1/auth/forgot-password - 비밀번호 재설정 요청
- [ ] POST /api/v1/auth/reset-password - 비밀번호 재설정

**2.4 사용자 관리 API**
- [ ] GET /api/v1/users/me - 내 프로필 조회
- [ ] PATCH /api/v1/users/me - 프로필 수정
- [ ] PATCH /api/v1/users/me/password - 비밀번호 변경
- [ ] DELETE /api/v1/users/me - 회원 탈퇴

---

### Phase 3: 핵심 기능 (2주)

**3.1 감정 기록 API**
- [ ] EmotionLog 모델 정의
- [ ] POST /api/v1/emotions - 감정 기록 생성
- [ ] GET /api/v1/emotions - 감정 기록 목록
- [ ] GET /api/v1/emotions/{id} - 감정 기록 상세
- [ ] PATCH /api/v1/emotions/{id} - 감정 기록 수정
- [ ] DELETE /api/v1/emotions/{id} - 감정 기록 삭제
- [ ] GET /api/v1/emotions/stats - 통계 조회

**3.2 AI 챗봇 통합**
- [ ] ChatConversation, ChatMessage 모델
- [ ] OpenAI API 서비스 구현
- [ ] POST /api/v1/chat/conversations - 대화 시작
- [ ] GET /api/v1/chat/conversations - 대화 목록
- [ ] GET /api/v1/chat/conversations/{id} - 대화 상세
- [ ] POST /api/v1/chat/conversations/{id}/messages - 메시지 전송
- [ ] DELETE /api/v1/chat/conversations/{id} - 대화 삭제

**3.3 파일 업로드**
- [ ] GCS 연동 설정
- [ ] 이미지 리사이징 (Pillow)
- [ ] POST /api/v1/files/upload/profile - 프로필 이미지
- [ ] POST /api/v1/files/upload/attachment - 첨부 파일
- [ ] FileAttachment 모델 정의

---

### Phase 4: 커뮤니티 (1주)

**4.1 커뮤니티 API**
- [ ] CommunityPost, Comment 모델
- [ ] POST /api/v1/community/posts - 게시글 작성
- [ ] GET /api/v1/community/posts - 게시글 목록
- [ ] GET /api/v1/community/posts/{id} - 게시글 상세
- [ ] PATCH /api/v1/community/posts/{id} - 게시글 수정
- [ ] DELETE /api/v1/community/posts/{id} - 게시글 삭제
- [ ] POST /api/v1/community/posts/{id}/like - 좋아요
- [ ] DELETE /api/v1/community/posts/{id}/like - 좋아요 취소

**4.2 댓글 API**
- [ ] POST /api/v1/community/posts/{id}/comments - 댓글 작성
- [ ] GET /api/v1/community/posts/{id}/comments - 댓글 목록
- [ ] PATCH /api/v1/community/comments/{id} - 댓글 수정
- [ ] DELETE /api/v1/community/comments/{id} - 댓글 삭제

**4.3 챌린지 API**
- [ ] Challenge 모델 정의
- [ ] POST /api/v1/challenges - 챌린지 생성
- [ ] GET /api/v1/challenges - 챌린지 목록
- [ ] PATCH /api/v1/challenges/{id} - 상태 업데이트
- [ ] DELETE /api/v1/challenges/{id} - 챌린지 삭제

---

### Phase 5: 부가 기능 (1주)

**5.1 알림 시스템**
- [ ] Notification 모델 정의
- [ ] GET /api/v1/notifications - 알림 목록
- [ ] PATCH /api/v1/notifications/{id}/read - 읽음 처리
- [ ] PATCH /api/v1/notifications/read-all - 전체 읽음
- [ ] DELETE /api/v1/notifications/{id} - 알림 삭제
- [ ] 자동 삭제 크론 작업 (30일)

**5.2 OAuth 소셜 로그인**
- [ ] Google OAuth 설정
- [ ] GET /api/v1/auth/google - Google 로그인
- [ ] GET /api/v1/auth/google/callback - 콜백 처리
- [ ] Kakao OAuth 설정
- [ ] GET /api/v1/auth/kakao - Kakao 로그인
- [ ] GET /api/v1/auth/kakao/callback - 콜백 처리

**5.3 관리자 API**
- [ ] GET /api/v1/admin/users - 사용자 목록
- [ ] PATCH /api/v1/admin/users/{id}/suspend - 사용자 정지
- [ ] DELETE /api/v1/admin/posts/{id} - 게시글 삭제
- [ ] DELETE /api/v1/admin/comments/{id} - 댓글 삭제
- [ ] GET /api/v1/admin/stats - 시스템 통계

---

### Phase 6: 최적화 & 배포 (1주)

**6.1 성능 최적화**
- [ ] Redis 캐싱 전략 구현
- [ ] DB 쿼리 최적화
- [ ] 인덱스 추가
- [ ] 페이지네이션 최적화

**6.2 보안 강화**
- [ ] Rate limiting 구현
- [ ] 입력 sanitization
- [ ] CORS 정책 강화
- [ ] SQL Injection 방어 검증

**6.3 모니터링**
- [ ] Sentry 연동
- [ ] 로깅 시스템 구축
- [ ] Health check 엔드포인트 강화

**6.4 Docker & 배포**
- [ ] Dockerfile 작성
- [ ] docker-compose.yml 작성
- [ ] GCP Cloud Run 배포 설정
- [ ] CI/CD 파이프라인 (GitHub Actions)

---

## 환경 변수

```bash
# .env.example

# Application
APP_NAME=mindpause-api
APP_ENV=development
DEBUG=True

# Server
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mindpause
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_CACHE_TTL=3600

# JWT
JWT_SECRET_KEY=your-secret-key-change-this
JWT_REFRESH_SECRET_KEY=your-refresh-secret-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Kakao OAuth
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
KAKAO_REDIRECT_URI=http://localhost:8000/api/v1/auth/kakao/callback

# Google Cloud Storage
GCS_BUCKET_NAME=mindpause-files
GCS_PROJECT_ID=mindpause-project
GCS_CREDENTIALS_PATH=/path/to/credentials.json

# Email (SendGrid)
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@mindpause.com

# Sentry
SENTRY_DSN=https://...

# Rate Limiting
RATE_LIMIT_LOGIN=5/15minute
RATE_LIMIT_GENERAL=100/15minute
RATE_LIMIT_AI_CHAT=30/hour
RATE_LIMIT_FILE_UPLOAD=10/hour

# CORS
CORS_ORIGINS=http://localhost:5173,https://mindpause.com
```

---

## API 응답 포맷

### 성공 응답
```json
{
  "success": true,
  "data": {
    // 응답 데이터
  },
  "message": "Success",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {
      // 추가 정보
    }
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## 테스트 전략

### 단위 테스트
- 각 서비스 로직 테스트
- 유틸리티 함수 테스트
- 커버리지 목표: 70% 이상

### 통합 테스트
- API 엔드포인트 테스트
- DB 트랜잭션 테스트
- 커버리지 목표: 핵심 API 100%

### E2E 테스트
- 주요 사용자 플로우 테스트
- 회원가입 → 로그인 → 감정 기록 → 채팅

---

## 배포 전략

### 로컬 개발
```bash
docker-compose up -d
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 스테이징 배포
- GCP Cloud Run (스테이징 환경)
- Cloud SQL (스테이징 DB)
- 자동 배포: `main` 브랜치 푸시 시

### 프로덕션 배포
- GCP Cloud Run (프로덕션 환경)
- Cloud SQL (프로덕션 DB)
- 수동 배포: GitHub Release 태그 시

---

## 성능 목표

- API 응답 시간: < 200ms (95 percentile)
- AI 채팅 응답: < 3초
- DB 쿼리: < 50ms
- 동시 접속: 1000+ users
- 가용성: 99.9% uptime

---

## 보안 체크리스트

- [ ] HTTPS 강제
- [ ] JWT 토큰 검증
- [ ] 비밀번호 해싱 (bcrypt)
- [ ] SQL Injection 방어
- [ ] XSS 방어
- [ ] CSRF 토큰
- [ ] Rate limiting
- [ ] 입력 검증 (Pydantic)
- [ ] 파일 업로드 검증
- [ ] 환경 변수 보안

---

## 다음 단계

1. **백엔드 디렉토리 생성**
2. **Docker Compose 실행** (PostgreSQL + Redis)
3. **FastAPI 앱 초기화**
4. **User 모델 및 인증 API 구현**
5. **프론트엔드 연동 테스트**

---

## 참고 문서

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 문서](https://docs.sqlalchemy.org/)
- [Pydantic 문서](https://docs.pydantic.dev/)
- [OpenAI API 문서](https://platform.openai.com/docs/)
