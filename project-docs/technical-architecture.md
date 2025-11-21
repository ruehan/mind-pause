# Mind Pause 기술 아키텍처

> 작성일: 2024-11-18
> 버전: 1.0.0
> 상태: 진행 중

---

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [기술 스택](#기술-스택)
3. [시스템 아키텍처](#시스템-아키텍처)
4. [주요 컴포넌트](#주요-컴포넌트)
5. [데이터베이스 스키마](#데이터베이스-스키마)
6. [API 구조](#api-구조)
7. [인증 및 보안](#인증-및-보안)
8. [배포 및 인프라](#배포-및-인프라)
9. [성능 최적화](#성능-최적화)
10. [모니터링 및 로깅](#모니터링-및-로깅)

---

## 시스템 개요

### 핵심 기능

Mind Pause는 AI 기반 심리 상담 플랫폼으로 다음 기능을 제공합니다:

- 🤖 **AI 상담 챗봇**: GPT-4 기반 공감적 대화
- 📊 **감정 트래킹**: 일별 감정 기록 및 분석
- 📈 **통계 대시보드**: 감정 패턴 시각화
- 👥 **커뮤니티**: 사용자 간 익명 공유
- 🎯 **챌린지**: 습관 형성 및 목표 달성
- 🚨 **위기 감지**: 자살/자해 조기 감지 및 개입

### 설계 원칙

1. **사용자 안전 최우선**: 위기 상황 즉각 대응
2. **프라이버시 보호**: 익명성 보장, 데이터 암호화
3. **확장 가능성**: 모듈화된 아키텍처
4. **성능 최적화**: 빠른 응답 속도 (< 2초)
5. **접근성**: 누구나 쉽게 사용할 수 있는 UI/UX

---

## 기술 스택

### 프론트엔드

| 카테고리 | 기술 | 버전 | 목적 |
|---------|------|------|------|
| **프레임워크** | Next.js | 14.x | React 기반 풀스택 프레임워크 |
| **언어** | TypeScript | 5.x | 타입 안정성 |
| **상태 관리** | React Context | - | 전역 상태 관리 |
| **스타일링** | Tailwind CSS | 3.x | 유틸리티 기반 CSS |
| **차트** | Recharts | 2.x | 데이터 시각화 |
| **HTTP** | Fetch API | - | API 통신 |
| **SSE** | EventSource | - | 실시간 스트리밍 |

### 백엔드

| 카테고리 | 기술 | 버전 | 목적 |
|---------|------|------|------|
| **프레임워크** | FastAPI | 0.104.x | 고성능 Python 웹 프레임워크 |
| **언어** | Python | 3.11.x | 백엔드 로직 |
| **ORM** | SQLAlchemy | 2.x | 데이터베이스 ORM |
| **인증** | JWT | - | 토큰 기반 인증 |
| **LLM** | OpenAI GPT-4 | - | AI 대화 엔진 |
| **검증** | Pydantic | 2.x | 데이터 검증 |

### 데이터베이스

| 카테고리 | 기술 | 버전 | 목적 |
|---------|------|------|------|
| **RDBMS** | PostgreSQL | 15.x | 주 데이터베이스 |
| **벡터 DB** | pgvector | 0.5.x | 임베딩 저장 (향후) |

### DevOps & 인프라

| 카테고리 | 기술 | 목적 |
|---------|------|------|
| **버전 관리** | Git | 소스 코드 관리 |
| **패키지 관리** | npm, pip | 의존성 관리 |
| **환경 변수** | .env | 설정 관리 |
| **로깅** | Python logging | 애플리케이션 로그 |

---

## 시스템 아키텍처

### 전체 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 (User)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   프론트엔드 (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  • Pages: Home, Chat, Dashboard, Community, Profile         │
│  • Components: Reusable UI components                       │
│  • Lib: API client, utilities                               │
│  • Context: Global state (Auth, Toast)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API / SSE
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    백엔드 (FastAPI)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Layer (v1)                          │   │
│  │  • conversation.py   - 대화 API                      │   │
│  │  • auth.py           - 인증 API                      │   │
│  │  • emotion_log.py    - 감정 기록 API                 │   │
│  │  • feedback.py       - 피드백 API                    │   │
│  │  • ai_character.py   - 캐릭터 API                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Service Layer                             │   │
│  │  • context_service   - 컨텍스트 구축                 │   │
│  │  • emotion_service   - 감정 분석                     │   │
│  │  • crisis_detection  - 위기 감지                     │   │
│  │  • response_validation - 응답 검증                   │   │
│  │  • preference_service - 선호도 학습                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Prompt Layer                              │   │
│  │  • prompt_builder    - 프롬프트 생성                 │   │
│  │  • few_shot_examples - 예제 데이터                   │   │
│  │  • dynamic_few_shot  - 동적 예제 선택                │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Layer (SQLAlchemy)                 │   │
│  │  • User, Conversation, Message                       │   │
│  │  • EmotionLog, Feedback                              │   │
│  │  • AICharacter, UserPromptPreference                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │ OpenAI GPT-4 │ │   환경 변수   │
│              │ │              │ │   (.env)     │
│  • 사용자     │ │  • 대화 생성  │ │              │
│  • 대화       │ │  • 감정 분석  │ │ • DB URL     │
│  • 감정 로그  │ │              │ │ • API Key    │
│  • 피드백     │ │              │ │ • JWT Secret │
└──────────────┘ └──────────────┘ └──────────────┘
```

### 레이어별 역할

#### 1. API Layer
- HTTP 요청 수신 및 응답
- 입력 검증 (Pydantic)
- 인증/인가 확인
- 비즈니스 로직 호출

#### 2. Service Layer
- 핵심 비즈니스 로직
- 외부 서비스 통합 (OpenAI, etc.)
- 데이터 변환 및 처리

#### 3. Prompt Layer
- LLM 프롬프트 생성
- Few-shot 예제 관리
- 사용자 컨텍스트 구축

#### 4. Data Layer
- 데이터베이스 CRUD
- 트랜잭션 관리
- 데이터 모델 정의

---

## 주요 컴포넌트

### 백엔드 컴포넌트

```
backend/
├── app/
│   ├── main.py                      # FastAPI 애플리케이션 진입점
│   ├── config.py                    # 설정 관리
│   ├── database.py                  # 데이터베이스 연결
│   │
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── auth.py          # 인증 API
│   │           ├── conversation.py  # 대화 API
│   │           ├── emotion_log.py   # 감정 기록 API
│   │           ├── feedback.py      # 피드백 API
│   │           ├── ai_character.py  # 캐릭터 API
│   │           └── user.py          # 사용자 API
│   │
│   ├── models/
│   │   ├── user.py                  # 사용자 모델
│   │   ├── conversation.py          # 대화 모델
│   │   ├── message.py               # 메시지 모델
│   │   ├── emotion_log.py           # 감정 로그 모델
│   │   ├── feedback.py              # 피드백 모델
│   │   ├── ai_character.py          # AI 캐릭터 모델
│   │   └── user_prompt_preference.py # 선호도 모델
│   │
│   ├── services/
│   │   ├── context_service.py       # 컨텍스트 구축
│   │   ├── emotion_service.py       # 감정 분석
│   │   ├── crisis_detection_service.py # 위기 감지
│   │   ├── response_validation_service.py # 응답 검증
│   │   ├── preference_service.py    # 선호도 학습
│   │   ├── summary_service.py       # 대화 요약
│   │   └── memory_service.py        # 메모리 관리
│   │
│   ├── prompts/
│   │   ├── prompt_builder.py        # 프롬프트 생성
│   │   ├── few_shot_examples.py     # Few-shot 예제
│   │   └── dynamic_few_shot.py      # 동적 예제 선택
│   │
│   └── utils/
│       ├── auth.py                  # JWT 인증
│       ├── dependencies.py          # FastAPI 의존성
│       └── validators.py            # 검증 유틸
│
└── tests/
    ├── test_auth.py
    ├── test_conversation.py
    └── ...
```

### 프론트엔드 컴포넌트

```
app/
├── pages/
│   ├── index.tsx                    # 홈페이지
│   ├── login.tsx                    # 로그인
│   ├── signup.tsx                   # 회원가입
│   ├── chat/
│   │   └── [id].tsx                 # 대화방
│   ├── dashboard/
│   │   ├── emotions.tsx             # 감정 대시보드
│   │   └── feedback.tsx             # 피드백 통계
│   ├── community/
│   │   └── index.tsx                # 커뮤니티
│   └── profile/
│       └── index.tsx                # 프로필
│
├── components/
│   ├── chat/
│   │   ├── MessageList.tsx          # 메시지 목록
│   │   ├── MessageInput.tsx         # 입력창
│   │   ├── MessageBubble.tsx        # 메시지 버블
│   │   ├── AICharacterSelector.tsx  # 캐릭터 선택
│   │   └── AICharacterCreateModal.tsx # 캐릭터 생성
│   ├── dashboard/
│   │   ├── EmotionChart.tsx         # 감정 차트
│   │   └── StatCard.tsx             # 통계 카드
│   ├── common/
│   │   ├── Button.tsx               # 버튼
│   │   ├── Input.tsx                # 입력 필드
│   │   └── Modal.tsx                # 모달
│   └── layout/
│       ├── Header.tsx               # 헤더
│       └── Navigation.tsx           # 네비게이션
│
├── lib/
│   ├── api.ts                       # API 클라이언트
│   ├── auth.ts                      # 인증 유틸
│   └── utils.ts                     # 유틸리티
│
├── context/
│   ├── AuthContext.tsx              # 인증 컨텍스트
│   └── ToastContext.tsx             # 토스트 컨텍스트
│
└── styles/
    └── globals.css                  # 전역 스타일
```

---

## 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │ PK
│ email       │ UNIQUE
│ password    │
│ nickname    │
│ created_at  │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐ ┌────────────────┐
│ EmotionLog  │ │ Conversation   │
├─────────────┤ ├────────────────┤
│ id          │ │ id             │ PK
│ user_id     │ │ user_id        │ FK
│ emotion     │ │ character_id   │ FK
│ intensity   │ │ title          │
│ note        │ │ created_at     │
│ date        │ └────────┬───────┘
└─────────────┘          │
                         │ 1:N
                         ▼
                  ┌─────────────┐
                  │   Message   │
                  ├─────────────┤
                  │ id          │ PK
                  │ conv_id     │ FK
                  │ role        │ (user/assistant)
                  │ content     │
                  │ created_at  │
                  └──────┬──────┘
                         │
                         │ 1:1
                         ▼
                  ┌─────────────┐
                  │  Feedback   │
                  ├─────────────┤
                  │ id          │ PK
                  │ message_id  │ FK
                  │ user_id     │ FK
                  │ rating      │
                  │ category    │
                  │ comment     │
                  │ created_at  │
                  └─────────────┘

┌──────────────────────┐
│   AICharacter        │
├──────────────────────┤
│ id                   │ PK
│ user_id              │ FK
│ name                 │
│ personality          │
│ description          │
│ avatar_options       │ JSON
│ is_active            │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│ UserPromptPreference │
├──────────────────────┤
│ id                   │ PK
│ user_id              │ FK
│ preferred_length     │
│ preferred_tone       │
│ emoji_preference     │
│ confidence_score     │
│ total_feedbacks      │
│ updated_at           │
└──────────────────────┘
```

### 주요 테이블 상세

#### User (사용자)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Conversation (대화방)
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES ai_characters(id) ON DELETE SET NULL,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
```

#### Message (메시지)
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

#### EmotionLog (감정 기록)
```sql
CREATE TABLE emotion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emotion VARCHAR(50) NOT NULL,
    intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 5),
    note TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_emotion_logs_user_id ON emotion_logs(user_id);
CREATE INDEX idx_emotion_logs_date ON emotion_logs(date DESC);
```

#### Feedback (피드백)
```sql
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(100),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedbacks_message_id ON feedbacks(message_id);
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_feedbacks_rating ON feedbacks(rating);
```

#### AICharacter (AI 캐릭터)
```sql
CREATE TABLE ai_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    personality VARCHAR(200) NOT NULL,
    description TEXT,
    avatar_options JSONB,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_characters_user_id ON ai_characters(user_id);
CREATE INDEX idx_ai_characters_is_active ON ai_characters(is_active);
```

#### UserPromptPreference (사용자 선호도)
```sql
CREATE TABLE user_prompt_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_length VARCHAR(50) DEFAULT 'medium',
    preferred_tone VARCHAR(50) DEFAULT 'balanced',
    emoji_preference VARCHAR(50) DEFAULT 'minimal',
    confidence_score FLOAT DEFAULT 0.0 CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    total_feedbacks INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_prompt_preferences_user_id ON user_prompt_preferences(user_id);
```

---

## API 구조

### 인증 (Authentication)

#### POST `/api/v1/auth/signup`
회원가입

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "nickname": "행복한사용자"
}
```

**Response** (201):
```json
{
  "message": "회원가입이 완료되었습니다",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "nickname": "행복한사용자"
  }
}
```

#### POST `/api/v1/auth/login`
로그인

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response** (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "nickname": "행복한사용자"
  }
}
```

### 대화 (Conversation)

#### POST `/api/v1/conversations`
새 대화방 생성

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "character_id": "uuid",
  "title": "오늘의 상담"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "character_id": "uuid",
  "title": "오늘의 상담",
  "created_at": "2024-11-18T10:00:00Z"
}
```

#### GET `/api/v1/conversations`
대화방 목록 조회

**Response** (200):
```json
[
  {
    "id": "uuid",
    "title": "오늘의 상담",
    "character": {
      "id": "uuid",
      "name": "따뜻한 친구",
      "personality": "공감하고 격려하는 친구"
    },
    "last_message": "힘내세요! 함께 해결해봐요 💪",
    "created_at": "2024-11-18T10:00:00Z",
    "message_count": 15
  }
]
```

#### POST `/api/v1/conversations/{id}/messages/stream`
메시지 전송 (SSE 스트리밍)

**Request**:
```json
{
  "content": "요즘 너무 힘들어요..."
}
```

**Response** (SSE Stream):
```
event: token
data: {"token": "힘"}

event: token
data: {"token": "들"}

event: token
data: {"token": "어"}

...

event: done
data: {"message_id": "uuid"}
```

### 감정 기록 (Emotion Log)

#### POST `/api/v1/emotion-logs`
감정 기록

**Request**:
```json
{
  "emotion": "불안",
  "intensity": 4,
  "note": "발표 때문에 긴장돼요",
  "date": "2024-11-18"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "emotion": "불안",
  "intensity": 4,
  "note": "발표 때문에 긴장돼요",
  "date": "2024-11-18",
  "created_at": "2024-11-18T10:00:00Z"
}
```

#### GET `/api/v1/emotion-logs?start_date=2024-11-01&end_date=2024-11-18`
감정 기록 조회

**Response** (200):
```json
[
  {
    "id": "uuid",
    "emotion": "불안",
    "intensity": 4,
    "note": "발표 때문에 긴장돼요",
    "date": "2024-11-18"
  },
  ...
]
```

### 피드백 (Feedback)

#### POST `/api/v1/feedback`
피드백 제출

**Request**:
```json
{
  "message_id": "uuid",
  "rating": 5,
  "category": "helpful",
  "comment": "정말 도움이 되었어요!"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "message_id": "uuid",
  "rating": 5,
  "category": "helpful",
  "comment": "정말 도움이 되었어요!",
  "created_at": "2024-11-18T10:00:00Z"
}
```

#### GET `/api/v1/feedback/stats?period=week`
피드백 통계

**Response** (200):
```json
{
  "total_count": 150,
  "average_rating": 4.3,
  "positive_ratio": 0.82,
  "category_distribution": {
    "helpful": 60,
    "empathetic": 50,
    "actionable": 40
  },
  "rating_trend": [
    {"date": "2024-11-12", "average": 4.2},
    {"date": "2024-11-13", "average": 4.5},
    ...
  ]
}
```

### AI 캐릭터 (AI Character)

#### POST `/api/v1/ai-characters`
캐릭터 생성

**Request**:
```json
{
  "name": "따뜻한 친구",
  "personality": "공감하고 격려하는 친구",
  "description": "항상 곁에서 응원해주는 친구",
  "avatar_options": {
    "sex": "man",
    "hairStyle": "normal",
    "hairColor": "#000",
    ...
  }
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "name": "따뜻한 친구",
  "personality": "공감하고 격려하는 친구",
  "description": "항상 곁에서 응원해주는 친구",
  "avatar_options": {...},
  "is_active": true,
  "created_at": "2024-11-18T10:00:00Z"
}
```

---

## 인증 및 보안

### JWT 인증

**토큰 구조**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "exp": 1700308800
  },
  "signature": "..."
}
```

**토큰 생성**:
```python
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

**토큰 검증**:
```python
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
        return user_id
    except JWTError:
        raise HTTPException(status_code=401)
```

### 비밀번호 보안

**해싱 (bcrypt)**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### CORS 설정

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드 도메인
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 환경 변수 보안

**.env 파일** (절대 Git에 커밋하지 않음):
```env
DATABASE_URL=postgresql://user:password@localhost/mindpause
OPENAI_API_KEY=sk-...
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
```

**설정 로드**:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    openai_api_key: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## 배포 및 인프라

### 개발 환경

**프론트엔드**:
```bash
npm run dev  # http://localhost:3000
```

**백엔드**:
```bash
uvicorn app.main:app --reload --port 8000  # http://localhost:8000
```

**데이터베이스**:
```bash
# PostgreSQL 로컬 실행
psql -U postgres
CREATE DATABASE mindpause;
```

### 프로덕션 환경 (예상)

**프론트엔드**:
- **플랫폼**: Vercel
- **빌드**: `npm run build`
- **배포**: 자동 배포 (Git push)

**백엔드**:
- **플랫폼**: Railway / Render / AWS EC2
- **서버**: Gunicorn + Uvicorn workers
- **프로세스 관리**: systemd / PM2

**데이터베이스**:
- **플랫폼**: Railway / AWS RDS
- **백업**: 일일 자동 백업
- **복제**: Read replica (향후)

---

## 성능 최적화

### 프론트엔드

1. **코드 스플리팅**:
   ```typescript
   const DashboardPage = dynamic(() => import('../pages/dashboard'), {
     loading: () => <LoadingSpinner />,
   });
   ```

2. **이미지 최적화**:
   ```typescript
   import Image from 'next/image';
   <Image src="/avatar.png" width={64} height={64} alt="Avatar" />
   ```

3. **API 응답 캐싱**:
   ```typescript
   const [data, setData] = useState(null);
   useEffect(() => {
     const cached = localStorage.getItem('dashboard_data');
     if (cached) setData(JSON.parse(cached));
     // ... fetch new data
   }, []);
   ```

### 백엔드

1. **데이터베이스 인덱싱**:
   ```sql
   CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
   CREATE INDEX idx_emotion_logs_user_id_date ON emotion_logs(user_id, date DESC);
   ```

2. **쿼리 최적화**:
   ```python
   # N+1 문제 해결: JOIN 사용
   conversations = db.query(Conversation)\
       .options(joinedload(Conversation.character))\
       .filter(Conversation.user_id == user_id)\
       .all()
   ```

3. **응답 스트리밍** (SSE):
   ```python
   async def stream_response():
       for token in llm_stream():
           yield f"data: {json.dumps({'token': token})}\n\n"
           await asyncio.sleep(0)  # 비동기 양보
   ```

---

## 모니터링 및 로깅

### 로깅

**백엔드 로깅**:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# 사용 예시
logger.info(f"사용자 {user_id} 대화 시작")
logger.error(f"LLM 오류: {error}")
```

**프론트엔드 로깅**:
```typescript
console.log('[API] 메시지 전송:', messageContent);
console.error('[API Error]', error);
```

### 에러 추적

**백엔드**:
```python
from fastapi import HTTPException

@router.post("/messages")
async def send_message(...):
    try:
        # 로직
        pass
    except OpenAIError as e:
        logger.error(f"OpenAI Error: {e}")
        raise HTTPException(status_code=503, detail="AI 서비스 오류")
    except Exception as e:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="서버 오류")
```

### 성능 모니터링

**주요 지표**:
- API 응답 시간
- 데이터베이스 쿼리 시간
- LLM 응답 시간
- 에러율
- 동시 접속자 수

---

## 문서 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2024-11-18 | 1.0.0 | 초기 기술 아키텍처 문서 작성 |

---

## 참고 문서

- [LLM 시스템 개요](./llm-system-overview.md)
- [캐릭터 성격 시스템](./character-personality-system.md)
- [E2E 사용자 플로우](./e2e-user-flow.md)
