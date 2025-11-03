# 인프라 선택 가이드 (스토리지 & 데이터베이스)

## 개요

마음쉼표 프로젝트의 스토리지와 데이터베이스 선택을 위한 비교 분석입니다.
MVP 단계와 확장 단계를 나누어 최적의 선택을 제안합니다.

---

## 1. 파일 스토리지 비교

### 저장할 파일 유형
- **프로필 이미지**: 100KB - 5MB
- **커뮤니티 첨부 파일**: 1MB - 10MB
- **예상 월간 업로드**: 1,000 - 10,000 파일 (MVP)

---

### Option 1: Google Cloud Storage (GCS) ⭐ 추천

**장점:**
- 글로벌 CDN 기본 제공
- 99.95% 가용성 보장
- 자동 백업 및 버전 관리
- Cloud Run과 통합 우수
- IAM 기반 세밀한 권한 관리
- 이미지 최적화 (Cloud CDN + 리사이징)

**단점:**
- 초기 설정 복잡 (GCP 프로젝트 필요)
- 비용이 다른 옵션보다 약간 높음
- 한국 리전 없음 (도쿄/싱가포르 사용)

**비용 (월간 예상):**
- 저장 용량 (10GB): $0.20 - $0.26
- 네트워크 송신 (50GB): $0 (CDN 캐시 활용)
- API 요청 (10만 건): $0.40
- **총 예상: $5-10/월** (MVP)

**구현 예시:**
```python
from google.cloud import storage

storage_client = storage.Client()
bucket = storage_client.bucket('mindpause-files')

# 파일 업로드
blob = bucket.blob(f'profiles/{user_id}/{filename}')
blob.upload_from_file(file_obj, content_type='image/jpeg')

# 공개 URL 생성
public_url = blob.public_url
```

---

### Option 2: AWS S3

**장점:**
- 가장 성숙한 객체 스토리지
- CloudFront CDN 통합
- 서울 리전 사용 가능 (낮은 레이턴시)
- 풍부한 생태계 및 도구

**단점:**
- GCP 기반 프로젝트와 혼용 시 관리 복잡
- IAM 정책이 GCS보다 복잡
- 비용 구조 복잡 (여러 요금 항목)

**비용 (월간 예상):**
- 저장 용량 (10GB): $0.23
- 네트워크 송신 (50GB): $4.50
- API 요청 (10만 건): $0.40
- **총 예상: $10-15/월** (MVP)

---

### Option 3: Cloudflare R2

**장점:**
- **네트워크 송신 비용 무료** (가장 저렴)
- Cloudflare CDN 기본 제공
- S3 호환 API
- 빠른 글로벌 배포

**단점:**
- 저장 용량 최소 요금제 (10GB)
- GCP 통합 제한적
- 한국 데이터 센터 없음
- 상대적으로 새로운 서비스

**비용 (월간 예상):**
- 저장 용량 (10GB): $0.15
- 네트워크 송신: **$0 (무료)**
- API 요청 (10만 건): $0.36
- **총 예상: $3-5/월** (MVP) ⭐ 가장 저렴

---

### Option 4: Supabase Storage

**장점:**
- PostgreSQL과 통합 (인증, 권한)
- 무료 티어 관대 (1GB)
- 간단한 설정
- 이미지 자동 리사이징

**단점:**
- 스케일링 시 비용 급증
- CDN 성능 제한적
- 엔터프라이즈 기능 부족

**비용 (월간 예상):**
- Pro 플랜: $25/월 (100GB 포함)
- **총 예상: $25/월** (고정 비용)

---

### ⭐ 추천: GCS (Google Cloud Storage)

**선택 이유:**
1. **Cloud Run과 네이티브 통합** - 같은 GCP 생태계
2. **안정성** - 99.95% SLA
3. **확장성** - 트래픽 증가 시 자동 스케일
4. **CDN 기본 제공** - 추가 설정 없이 빠른 전송
5. **보안** - IAM + 버킷 정책으로 세밀한 제어

**대안: Cloudflare R2**
- 비용 최적화가 최우선이면 R2 사용
- 네트워크 송신 무료로 장기적 비용 절감

---

## 2. 데이터베이스 비교

### 저장할 데이터 유형
- **관계형 데이터**: User, EmotionLog, CommunityPost, Comment, Challenge
- **반구조화 데이터**: ChatMessage metadata, ChatConversation context (JSONB)
- **예상 데이터**: 10,000 사용자, 100만 감정 기록 (1년)

---

### Option 1: PostgreSQL 15 ⭐ 추천

**장점:**
- **JSONB 지원** - 반구조화 데이터 저장 (AI 메타데이터, 대화 컨텍스트)
- 강력한 트랜잭션 (ACID)
- 복잡한 쿼리 지원 (JOIN, 서브쿼리, CTE)
- 풍부한 확장 (PostGIS, pg_trgm, pgvector)
- 인덱스 최적화 우수
- 오픈소스 + 성숙한 생태계

**단점:**
- 수평 확장 어려움 (샤딩 필요)
- 대용량 트래픽 시 최적화 필요

**비용 (GCP Cloud SQL):**
- db-f1-micro (0.6GB RAM): $7/월
- db-g1-small (1.7GB RAM): $25/월
- db-n1-standard-1 (3.75GB RAM): $50/월
- **총 예상: $25-50/월** (MVP)

**구현 예시:**
```python
from sqlalchemy import create_engine, Column, String, Integer, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(String, primary_key=True)
    content = Column(String)
    metadata = Column(JSON)  # JSONB: 프롬프트 정보, 감정 점수 등
```

---

### Option 2: MySQL 8.0

**장점:**
- JSON 지원 (PostgreSQL JSONB만큼은 아님)
- 간단한 설정 및 관리
- 읽기 성능 우수
- 레플리케이션 쉬움

**단점:**
- JSONB 기능 제한적
- 복잡한 쿼리 성능 낮음
- 트랜잭션 격리 수준 약함

**비용:**
- PostgreSQL과 유사

---

### Option 3: Supabase (PostgreSQL 호스팅)

**장점:**
- 관리형 PostgreSQL
- 실시간 구독 기능
- 인증/권한 통합
- 무료 티어 (500MB, 2개 프로젝트)
- Row Level Security

**단점:**
- 커스터마이징 제한적
- 대규모 트래픽 시 비용 급증
- 벤더 락인

**비용:**
- 무료: 500MB
- Pro: $25/월 (8GB)
- **총 예상: $25/월** (고정 비용)

---

### Option 4: MongoDB

**장점:**
- 스키마 유연성
- 수평 확장 쉬움
- JSON 네이티브 지원

**단점:**
- 관계형 데이터 처리 약함
- 트랜잭션 복잡
- 데이터 무결성 보장 어려움
- **이 프로젝트에 부적합** (User-EmotionLog 관계 많음)

---

### ⭐ 추천: PostgreSQL 15 (GCP Cloud SQL)

**선택 이유:**
1. **JSONB 지원** - AI 메타데이터, 대화 컨텍스트 저장에 최적
2. **관계형 데이터 강점** - User, Post, Comment 관계 명확
3. **복잡한 쿼리** - 통계, 분석, 대시보드 쿼리 우수
4. **확장성** - 읽기 복제본, 연결 풀링으로 확장
5. **GCP 통합** - Cloud Run, Cloud Storage와 동일 생태계

**예시 스키마:**
```sql
-- User 관계
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    nickname VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- JSONB 활용
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    conversation_id UUID,
    content TEXT,
    metadata JSONB,  -- {"emotion_score": -2, "prompt_type": "empathy"}
    created_at TIMESTAMP DEFAULT NOW()
);

-- JSONB 인덱스
CREATE INDEX idx_chat_metadata ON chat_messages USING GIN(metadata);
```

---

## 3. 캐싱 레이어: Redis

### 캐싱이 필요한 데이터
- **감정 통계** - 자주 조회, 계산 비용 높음
- **인기 게시글** - 좋아요 순 정렬, 실시간 업데이트
- **세션/토큰** - JWT 리프레시 토큰, 로그아웃 처리
- **Rate limiting** - API 요청 제한 카운터

---

### Option 1: Redis (GCP Memorystore) ⭐ 추천

**장점:**
- 인메모리 초고속 성능 (< 1ms)
- 다양한 자료구조 (String, Hash, List, Set, Sorted Set)
- Pub/Sub 지원 (실시간 알림)
- 영속성 옵션 (RDB, AOF)

**비용 (GCP Memorystore):**
- Basic (1GB): $30/월
- **총 예상: $30-50/월** (MVP)

**사용 예시:**
```python
import redis

redis_client = redis.Redis(host='localhost', port=6379)

# 감정 통계 캐싱 (1시간)
redis_client.setex(
    f'emotion_stats:{user_id}:week',
    3600,
    json.dumps(stats)
)

# JWT 리프레시 토큰 저장 (30일)
redis_client.setex(
    f'refresh_token:{user_id}',
    2592000,
    refresh_token
)

# Rate limiting
redis_client.incr(f'rate_limit:{user_id}:chat', ex=3600)
```

---

### Option 2: Redis Cloud (Upstash)

**장점:**
- 서버리스 (사용한 만큼만 비용)
- 글로벌 리전
- 무료 티어 (10,000 명령/일)
- 간단한 설정

**단점:**
- GCP 통합 제한적
- 대규모 트래픽 시 비용 급증

**비용:**
- 무료: 10,000 명령/일
- Pay as you go: $0.2/100K 명령
- **총 예상: $10-20/월** (MVP)

---

### ⭐ 추천: Redis (GCP Memorystore)

**선택 이유:**
1. **GCP 네이티브 통합** - Cloud Run과 VPC 연결
2. **안정성** - 99.9% SLA, 자동 백업
3. **성능** - 저레이턴시 (같은 리전)
4. **확장성** - 수직/수평 스케일 지원

**대안: MVP 초기엔 로컬 Redis**
- Docker Compose로 로컬 Redis 사용
- 트래픽 증가 시 Memorystore 이전

---

## 4. 최종 추천 구성

### MVP 단계 (3-6개월, DAU < 1,000)

```yaml
파일 스토리지:
  - Google Cloud Storage (Standard)
  - 한국 사용자 → 도쿄 리전 (asia-northeast1)
  - CDN 활성화
  - 비용: $5-10/월

데이터베이스:
  - PostgreSQL 15 (GCP Cloud SQL)
  - db-g1-small (1.7GB RAM)
  - 자동 백업 활성화
  - 비용: $25-30/월

캐싱:
  - Redis 7 (Docker Compose - 로컬)
  - 초기엔 로컬 개발환경에서만 사용
  - 비용: $0

총 예상 비용: $30-40/월
```

### 성장 단계 (DAU 1,000-10,000)

```yaml
파일 스토리지:
  - Google Cloud Storage + Cloud CDN
  - 이미지 최적화 (WebP 변환, 리사이징)
  - 비용: $50-100/월

데이터베이스:
  - PostgreSQL 15 (Cloud SQL)
  - db-n1-standard-2 (7.5GB RAM)
  - 읽기 복제본 1개
  - 연결 풀링 (PgBouncer)
  - 비용: $150-200/월

캐싱:
  - Redis (GCP Memorystore Basic)
  - 1GB 인스턴스
  - 비용: $30-50/월

총 예상 비용: $230-350/월
```

### 확장 단계 (DAU > 10,000)

```yaml
파일 스토리지:
  - Google Cloud Storage + Cloud CDN
  - 멀티 리전 (도쿄, 싱가포르)
  - 비용: $200-500/월

데이터베이스:
  - PostgreSQL 15 (Cloud SQL HA)
  - db-n1-standard-4 (15GB RAM)
  - 읽기 복제본 2-3개
  - 샤딩 검토
  - 비용: $500-1000/월

캐싱:
  - Redis (Memorystore Standard - HA)
  - 5GB 인스턴스
  - 비용: $100-150/월

총 예상 비용: $800-1650/월
```

---

## 5. 구현 우선순위

### Phase 1: 로컬 개발 환경
```bash
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mindpause
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
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

### Phase 2: GCS 설정
```bash
# GCS 버킷 생성
gsutil mb -c STANDARD -l asia-northeast1 gs://mindpause-files

# 공개 읽기 권한
gsutil iam ch allUsers:objectViewer gs://mindpause-files

# CORS 설정
gsutil cors set cors.json gs://mindpause-files
```

### Phase 3: Cloud SQL 설정
```bash
# PostgreSQL 인스턴스 생성
gcloud sql instances create mindpause-db \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region=asia-northeast1

# 데이터베이스 생성
gcloud sql databases create mindpause \
  --instance=mindpause-db
```

### Phase 4: Memorystore 설정 (성장 단계)
```bash
# Redis 인스턴스 생성
gcloud redis instances create mindpause-cache \
  --size=1 \
  --region=asia-northeast1 \
  --redis-version=redis_7_0
```

---

## 6. 마이그레이션 전략

### 로컬 → GCP 이전
1. **데이터베이스**
   - pg_dump로 백업
   - Cloud SQL에 복원
   - 연결 문자열 변경

2. **파일 스토리지**
   - gsutil로 기존 파일 업로드
   - URL 경로 업데이트

3. **캐시**
   - Redis 데이터는 휘발성이므로 마이그레이션 불필요
   - Memorystore 연결 후 재생성

---

## 7. 비용 최적화 팁

### 스토리지 비용 절감
- **Lifecycle 정책**: 90일 이상 미접근 파일 → Nearline/Coldline 이동
- **이미지 최적화**: WebP 변환, 리사이징으로 용량 50% 절감
- **CDN 캐싱**: 정적 자산 캐시로 네트워크 비용 절감

### 데이터베이스 비용 절감
- **연결 풀링**: PgBouncer로 연결 수 최소화
- **쿼리 최적화**: 인덱스 활용, N+1 문제 해결
- **읽기 복제본**: 읽기 부하 분산
- **자동 스케일링**: 트래픽에 따라 자동 조정

### 캐싱 비용 절감
- **TTL 최적화**: 적절한 만료 시간 설정
- **캐시 워밍**: 자주 조회되는 데이터만 캐싱
- **압축**: JSON 데이터 압축 저장

---

## 8. 결론

**최종 추천:**
- **파일 스토리지**: Google Cloud Storage ⭐
- **데이터베이스**: PostgreSQL 15 (GCP Cloud SQL) ⭐
- **캐싱**: Redis 7 (MVP: Docker / 성장: Memorystore) ⭐

**선택 근거:**
1. **일관된 생태계** - 모두 GCP 기반으로 통합 관리
2. **안정성** - 99.9%+ SLA 보장
3. **확장성** - 트래픽 증가에 대응 가능
4. **비용 효율** - MVP 단계 $30-40/월로 시작

**대안 (비용 최우선):**
- 스토리지: Cloudflare R2 (네트워크 비용 무료)
- 데이터베이스: Supabase (무료 티어 활용)
- 캐싱: Upstash Redis (서버리스)
- 총 예상: $10-25/월 (초기)
