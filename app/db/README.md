# Database Schema - Drizzle ORM

이 디렉토리는 Mind Pause 애플리케이션의 데이터베이스 스키마와 관련 설정을 포함합니다.

## 디렉토리 구조

```
app/db/
├── schema/
│   ├── users.ts          # User 엔터티 (회원, 역할, 인증)
│   ├── emotions.ts       # EmotionLog 엔터티 (감정 기록)
│   ├── chat.ts           # ChatConversation, ChatMessage (AI 대화)
│   ├── community.ts      # CommunityPost, Comment (커뮤니티)
│   ├── challenges.ts     # Challenge (회복 미션)
│   ├── notifications.ts  # Notification (알림)
│   ├── files.ts          # FileAttachment (파일 첨부)
│   └── index.ts          # 전체 스키마 export
├── config.ts             # DB 연결 설정
├── index.ts              # 메인 export
└── README.md             # 이 파일
```

## 환경 설정

1. `.env` 파일 생성:
```bash
cp .env.example .env
```

2. `DATABASE_URL` 설정:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/mind_pause
```

## 마이그레이션

### 1. 마이그레이션 파일 생성
스키마 변경 후 마이그레이션 파일을 생성합니다:
```bash
npm run db:generate
```

### 2. 마이그레이션 실행
생성된 마이그레이션을 데이터베이스에 적용합니다:
```bash
npm run db:migrate
```

### 3. 개발 환경에서 빠른 스키마 푸시
개발 중에는 마이그레이션 파일 없이 바로 스키마를 푸시할 수 있습니다:
```bash
npm run db:push
```

### 4. Drizzle Studio 실행
데이터베이스를 GUI로 확인하고 관리합니다:
```bash
npm run db:studio
```

## 데이터베이스 스키마

### 핵심 엔터티

1. **User** (`users`)
   - 회원 정보, 인증, 프로필
   - Role: USER, ADMIN, EXPERT
   - Auth Provider: LOCAL, GOOGLE, KAKAO, NAVER

2. **EmotionLog** (`emotion_logs`)
   - 감정 기록 (-5 ~ +5 점수)
   - AI 피드백 저장

3. **ChatConversation** (`chat_conversations`)
   - AI 대화 세션
   - JSONB context 저장

4. **ChatMessage** (`chat_messages`)
   - 대화 메시지
   - Role: USER, ASSISTANT, SYSTEM

5. **CommunityPost** (`community_posts`)
   - 커뮤니티 게시글
   - 익명 게시 지원

6. **Comment** (`comments`)
   - 게시글 댓글
   - 익명 댓글 지원

7. **Challenge** (`challenges`)
   - 회복 미션
   - Status: PENDING, COMPLETED, SKIPPED

8. **Notification** (`notifications`)
   - 시스템 알림
   - Type: CHALLENGE, COMMENT, LIKE, SYSTEM, AI_FEEDBACK

9. **FileAttachment** (`file_attachments`)
   - 파일 첨부
   - Entity Type: POST, COMMENT, USER_PROFILE

## 사용 예시

### 데이터베이스 연결

```typescript
import { db, schema } from '~/db';

// 사용자 조회
const users = await db.select().from(schema.users);

// 특정 사용자의 감정 기록 조회
const emotions = await db
  .select()
  .from(schema.emotionLogs)
  .where(eq(schema.emotionLogs.userId, userId));
```

### 타입 안전한 쿼리

```typescript
import { users, type User, type NewUser } from '~/db';

// 새 사용자 생성
const newUser: NewUser = {
  email: 'user@example.com',
  nickname: 'user123',
  role: 'USER',
};

const [insertedUser] = await db
  .insert(users)
  .values(newUser)
  .returning();
```

## 관계 (Relations)

- User 1:N EmotionLog
- User 1:N ChatConversation
- ChatConversation 1:N ChatMessage
- User 1:N CommunityPost
- CommunityPost 1:N Comment
- User 1:N Comment
- User 1:N Challenge
- User 1:N Notification
- User 1:N FileAttachment

## 제약사항 및 규칙

- 이메일·닉네임 중복 금지
- 감정 점수는 -5~+5 범위
- AI 채팅 메시지는 수정 불가 (불변성)
- 파일 업로드 크기 제한: 프로필 5MB, 게시글 10MB
- 파일 확장자 제한: 이미지(jpg, png, gif, webp), 문서(pdf)
- Soft Delete 지원 (is_deleted 플래그)

## 참고 문서

- [Data Model Planning](/docs/data-model-planning.md)
- [Backend Implementation Plan](/docs/backend-implementation-plan.md)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
