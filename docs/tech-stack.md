# 기술 스택 명세서 (Tech Stack Specification)

## 소개

마음쉼표(Mind Pause) 프로젝트의 기술 스택 선정 및 구조를 정의합니다.
MVP 개발부터 확장 가능한 아키텍처까지 고려한 기술 선택입니다.

---

## 1. Frontend

### Core Framework

- **React 18.x** with TypeScript
- **React Router 6.x** - 클라이언트 사이드 라우팅
- **Vite** - 빌드 도구 (빠른 개발 경험)

### State Management

- **Zustand** - 경량 상태 관리 (Redux 대비 단순함)
- **TanStack Query (React Query)** - 서버 상태 관리 및 캐싱

### UI/Styling

- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Headless UI** or **Radix UI** - 접근성 높은 컴포넌트
- **Framer Motion** - 애니메이션 (선택적)

### Form & Validation

- **React Hook Form** - 폼 상태 관리
- **Zod** - 타입 안전 스키마 검증

### Utilities

- **Axios** - HTTP 클라이언트
- **date-fns** - 날짜 처리
- **recharts** or **visx** - 데이터 시각화 (감정 차트)

### Build & Deploy

- **Vite** - 번들러
- **TypeScript** - 타입 안전성
- **ESLint + Prettier** - 코드 품질

---

## 2. Backend

### Runtime & Framework

- **Node.js 20.x (LTS)**
- **Express.js 4.x** - 웹 프레임워크
- **TypeScript** - 타입 안전성

**대안**: Python + FastAPI (무조건 FastAPI 사용하기 Node.js 사용 금지)

### Database

- **PostgreSQL 15.x** - 메인 데이터베이스
  - JSONB 지원 (ChatMessage metadata, ChatConversation context)
  - 강력한 트랜잭션 지원
  - 확장성 및 안정성
- **Redis 7.x** - 캐싱 및 세션 스토어
  - 감정 통계 캐싱
  - JWT refresh token 저장
  - 인기 게시글 캐싱

### ORM/Query Builder

- **Prisma** - TypeScript 기반 ORM
  - 타입 안전 쿼리
  - 마이그레이션 관리
  - 자동 생성 클라이언트

**대안**: TypeORM, Drizzle ORM

### Authentication

- **Passport.js** - 인증 미들웨어
  - Local Strategy (이메일/비밀번호)
  - Google OAuth 2.0
  - Kakao OAuth 2.0
  - Naver OAuth 2.0
- **jsonwebtoken (JWT)** - 토큰 기반 인증
- **bcrypt** - 비밀번호 해싱

### File Storage

- **Google Cloud Storage (GCS)** - 파일 저장
  - 프로필 이미지
  - 커뮤니티 첨부 파일
- **Multer** - 파일 업로드 미들웨어
- **Sharp** - 이미지 리사이징/최적화

### Validation & Error Handling

- **Zod** - 런타임 스키마 검증
- **express-validator** (대안)
- **Winston** - 구조화된 로깅
- **express-async-errors** - 비동기 에러 처리

---

## 3. AI & Machine Learning

### AI Integration

- **OpenAI API (GPT-4 or GPT-3.5-turbo)**
  - 감정 코칭 챗봇
  - 프롬프트 기반 대화
  - 감정 분석 및 피드백
- **OpenAI Embeddings** - 의미 기반 검색 (선택적)

### Alternative Considerations

- **Claude API (Anthropic)** - 긴 대화 컨텍스트
- **Gemini API (Google)** - 비용 효율성
- **Open Source Models** (장기 계획)
  - Llama 3
  - Mistral
  - Self-hosted on GCP

### NLP Tools (Optional)

- **Langchain** - LLM 체인 관리
- **한국어 형태소 분석** (비속어 필터링)

---

## 4. Infrastructure & DevOps

### Cloud Provider

- **Google Cloud Platform (GCP)**
  - **Cloud Run** - 컨테이너 기반 서버리스 (백엔드)
  - **Cloud SQL** - 관리형 PostgreSQL
  - **Memorystore** - 관리형 Redis
  - **Cloud Storage** - 파일 저장
  - **Cloud CDN** - 정적 자산 배포
  - **Cloud Build** - CI/CD

**대안**: AWS (ECS, RDS, ElastiCache, S3, CloudFront)

### Containerization

- **Docker** - 컨테이너화
- **Docker Compose** - 로컬 개발 환경

### CI/CD

- **GitHub Actions** - 자동 테스트 및 배포
  - 테스트 자동 실행
  - 스테이징/프로덕션 배포
  - 코드 품질 검사

### Monitoring & Logging

- **Sentry** - 에러 트래킹
- **Google Cloud Monitoring** - 인프라 모니터링
- **Google Cloud Logging** - 로그 집계
- **Uptime Monitoring** - 헬스 체크

---

## 5. Testing

### Frontend Testing

- **Vitest** - 유닛 테스트 (Vite 통합)
- **React Testing Library** - 컴포넌트 테스트
- **Playwright** or **Cypress** - E2E 테스트

### Backend Testing

- **Jest** - 유닛 테스트
- **Supertest** - API 통합 테스트
- **@faker-js/faker** - 테스트 데이터 생성

### Test Coverage Goals

- 유닛 테스트: 70% 이상
- 통합 테스트: 핵심 API 100%
- E2E 테스트: 주요 사용자 흐름 커버

---

## 6. Development Tools

### Version Control

- **Git** + **GitHub**
- **Conventional Commits** - 커밋 메시지 규칙

### API Documentation

- **Swagger/OpenAPI 3.0** - API 문서 자동 생성
- **Postman** or **Insomnia** - API 테스트

### Code Quality

- **ESLint** - JavaScript/TypeScript 린팅
- **Prettier** - 코드 포매팅
- **Husky** - Git hooks
- **lint-staged** - 스테이징 파일 린팅

### Package Management

- **pnpm** - 빠르고 효율적인 패키지 관리 (npm/yarn 대안)

---

## 7. Security

### Security Measures

- **Helmet.js** - HTTP 헤더 보안
- **CORS** - Cross-Origin 정책
- **Rate Limiting** - API 요청 제한 (express-rate-limit)
- **XSS Protection** - 입력 sanitization
- **SQL Injection Prevention** - Prisma ORM (파라미터화된 쿼리)
- **Environment Variables** - 민감 정보 관리 (dotenv)

### Compliance

- **개인정보보호법** 준수
- **GDPR** 고려 (글로벌 확장 시)
- 데이터 암호화 (전송: HTTPS, 저장: 필요 시 GCS 암호화)

---

## 8. Third-Party Services

### Communication

- **Nodemailer** - 이메일 발송 (회원가입, 비밀번호 찾기)
- **SendGrid** or **AWS SES** (프로덕션)

### Analytics (Optional)

- **Google Analytics 4** - 사용자 행동 분석
- **Mixpanel** or **Amplitude** - 제품 분석

### Notification (Future)

- **Firebase Cloud Messaging (FCM)** - 푸시 알림 (모바일 앱 시)
- **WebSocket (Socket.io)** - 실시간 알림

---

## 9. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  React + TypeScript + Zustand + React Query + Tailwind  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────────┐
│              Load Balancer (Cloud Run)                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│         Backend API (Express + TypeScript)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Auth    │  │   API    │  │   AI     │              │
│  │Middleware│  │ Routes   │  │ Service  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────┬────────────┬────────────┬───────────────────────┘
      │            │            │
      ↓            ↓            ↓
┌──────────┐ ┌──────────┐ ┌────────────┐
│PostgreSQL│ │  Redis   │ │  OpenAI    │
│ (Cloud   │ │(Memory   │ │    API     │
│   SQL)   │ │ store)   │ └────────────┘
└──────────┘ └──────────┘
      ↓
┌──────────────────┐
│  Cloud Storage   │
│  (GCS)           │
└──────────────────┘
```

---

## 10. Development Environment Setup

### Prerequisites

- Node.js 20.x
- pnpm 8.x
- Docker & Docker Compose
- PostgreSQL 15.x (로컬 or Docker)
- Redis 7.x (로컬 or Docker)

### Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/mindpause
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
GCS_BUCKET_NAME=mindpause-files
GCS_PROJECT_ID=mindpause-project

# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Docker Compose (로컬 개발)

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mindpause
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 11. MVP vs Future Stack

### MVP (3-4주)

- ✅ React + TypeScript + Zustand
- ✅ Express + TypeScript + Prisma
- ✅ PostgreSQL + Redis
- ✅ OpenAI API (GPT-3.5-turbo)
- ✅ GCP Cloud Run + Cloud SQL
- ✅ 기본 OAuth (Google, Kakao)

### Post-MVP (확장)

- 📱 React Native (모바일 앱)
- 🔄 WebSocket (실시간 알림)
- 📊 고급 분석 (Mixpanel)
- 🤖 Self-hosted LLM
- 🌐 다국어 지원 (i18next)
- 📈 A/B 테스트 (LaunchDarkly)

---

## 12. Cost Estimation (월간, MVP 기준)

| 항목                       | 예상 비용       |
| -------------------------- | --------------- |
| GCP Cloud Run (백엔드)     | $20-50          |
| GCP Cloud SQL (PostgreSQL) | $30-70          |
| GCP Memorystore (Redis)    | $30-50          |
| GCP Cloud Storage          | $5-20           |
| OpenAI API (GPT-3.5)       | $50-200         |
| Sentry (에러 트래킹)       | Free tier       |
| 도메인 + SSL               | $10-20          |
| **총 예상 비용**           | **$145-410/월** |

사용자 수 증가 시 자동 스케일링, 비용 최적화 필요.

---

## 13. Technology Decision Rationale

### Why React?

- 풍부한 생태계 및 커뮤니티
- TypeScript 지원 우수
- 컴포넌트 재사용성
- 성능 최적화 (Virtual DOM)

### Why Express.js?

- Node.js 생태계와 통합
- 유연하고 가벼움
- 미들웨어 생태계 풍부
- 팀의 JavaScript/TypeScript 전문성

### Why PostgreSQL?

- 관계형 데이터 무결성
- JSONB 지원 (유연성)
- 강력한 쿼리 성능
- 확장성 및 안정성

### Why GCP?

- Cloud Run 서버리스 (비용 효율)
- 관리형 서비스 통합
- 글로벌 인프라
- 확장성

### Why OpenAI API?

- 최고 수준의 한국어 이해
- 빠른 MVP 개발
- API 안정성
- 비용 대비 성능

---

## 14. Migration & Scalability Plan

### Phase 1: MVP (현재)

- Monolithic architecture
- Single Cloud Run instance
- Shared database

### Phase 2: Growth (100+ DAU)

- Horizontal scaling (Cloud Run auto-scale)
- Redis caching layer
- CDN for static assets
- Database read replicas

### Phase 3: Scale (1000+ DAU)

- Microservices (AI service 분리)
- Message queue (Pub/Sub)
- Database sharding (if needed)
- Multi-region deployment

### Phase 4: Enterprise (10000+ DAU)

- Kubernetes (GKE)
- Global CDN
- Advanced caching strategies
- Self-hosted AI models

---

## 결론

이 기술 스택은 **빠른 MVP 개발**, **확장성**, **유지보수성**을 균형있게 고려하여 선정되었습니다.
TypeScript를 프론트엔드와 백엔드에 공통으로 사용하여 개발 효율성을 높이고,
GCP의 관리형 서비스를 활용하여 인프라 관리 부담을 줄였습니다.

MVP 출시 후 사용자 피드백과 성능 메트릭을 기반으로 기술 스택을 점진적으로 최적화할 계획입니다.
