# Data Model Planning Worksheet

## 소개

- 개발에 앞서 애플리케이션의 **데이터 구조를 최대한 체계적으로 정의**하는 것이 이 과제의 목표입니다.
- 엔터티, 필드, 관계, 권한, 비즈니스 규칙 등을 사전에 정리하는 작업은 **데이터 모델링의 오류나 누락을 줄이고**, 이후 개발의 방향성을 명확히 하는 데 큰 도움이 됩니다.
- **어떤 엔터티(데이터 객체)** 들이 존재하며, **서로 어떤 관계와 규칙**을 가지고 있는지를 중심으로 워크시트를 작성해보세요.

---

## 1. 시스템의 핵심 엔터티(Entities)는 무엇인가요? (3~5개)

- User (회원/익명 계정)
- EmotionLog (감정 기록)
- ChatConversation (AI 대화 세션)
- ChatMessage (AI 대화 메시지)
- CommunityPost (커뮤니티 게시글)
- Comment (커뮤니티 댓글)
- Challenge (회복 미션/챌린지)
- Notification (알림)
- FileAttachment (파일 첨부)

---

## 2. 각 엔터티의 필드를 정의하세요

**User**

- `id` (UUID / Primary Key)
- `email` (String, unique, nullable for 익명)
- `nickname` (String, unique)
- `password_hash` (String, nullable for 소셜로그인)
- `profile_image_url` (String, optional)
- `is_anonymous` (Boolean, default: false)
- `role` (Enum: USER, ADMIN, EXPERT)
- `auth_provider` (Enum: LOCAL, GOOGLE, KAKAO, NAVER, nullable)
- `auth_provider_id` (String, nullable)
- `is_deleted` (Boolean, default: false)
- `deleted_at` (Datetime, nullable)
- `created_at` (Datetime)
- `updated_at` (Datetime)
- `last_login_at` (Datetime)

**EmotionLog**

- `id` (UUID / Primary Key)
- `user_id` (UUID, FK: User)
- `recorded_at` (Datetime)
- `emotion_score` (Integer, -5 to +5)
- `emotion_text` (String, optional)
- `prompt_used` (String, optional)
- `ai_feedback` (String, optional)
- `created_at` (Datetime)

**CommunityPost**

- `id` (UUID / Primary Key)
- `user_id` (UUID, FK: User, 익명 시 null)
- `title` (String)
- `content` (Text)
- `is_anonymous` (Boolean)
- `created_at` (Datetime)
- `updated_at` (Datetime)
- `num_likes` (Integer, default: 0)
- `num_comments` (Integer, default: 0)

**Comment**

- `id` (UUID / Primary Key)
- `post_id` (UUID, FK: CommunityPost)
- `user_id` (UUID, FK: User, 익명 시 null)
- `content` (Text)
- `is_anonymous` (Boolean)
- `created_at` (Datetime)

**Challenge**

- `id` (UUID / Primary Key)
- `user_id` (UUID, FK: User)
- `title` (String)
- `description` (Text)
- `status` (Enum: PENDING, COMPLETED, SKIPPED)
- `started_at` (Datetime)
- `completed_at` (Datetime, nullable)
- `feedback` (String, optional)

**ChatConversation**

- `id` (UUID / Primary Key)
- `user_id` (UUID, FK: User)
- `session_id` (String, unique)
- `title` (String, optional, 대화 제목)
- `context` (JSONB, 대화 컨텍스트 메타데이터)
- `created_at` (Datetime)
- `updated_at` (Datetime)

**ChatMessage**

- `id` (UUID / Primary Key)
- `conversation_id` (UUID, FK: ChatConversation)
- `role` (Enum: USER, ASSISTANT, SYSTEM)
- `content` (Text)
- `metadata` (JSONB, optional, 프롬프트 정보 등)
- `created_at` (Datetime)

**Notification**

- `id` (UUID / Primary Key)
- `user_id` (UUID, FK: User)
- `type` (Enum: CHALLENGE, COMMENT, LIKE, SYSTEM, AI_FEEDBACK)
- `title` (String)
- `content` (Text)
- `link_url` (String, optional, 관련 페이지 링크)
- `is_read` (Boolean, default: false)
- `created_at` (Datetime)

**FileAttachment**

- `id` (UUID / Primary Key)
- `entity_type` (Enum: POST, COMMENT, USER_PROFILE)
- `entity_id` (UUID, 연결된 엔터티 ID)
- `file_name` (String)
- `file_url` (String)
- `file_size` (Integer, bytes)
- `mime_type` (String)
- `uploaded_by` (UUID, FK: User)
- `created_at` (Datetime)

---

## 3. 어떤 관계들이 존재하나요?

- User 1:N EmotionLog (한 사용자는 여러 감정 기록)
- User 1:N ChatConversation (한 사용자는 여러 AI 대화 세션)
- ChatConversation 1:N ChatMessage (대화 세션 하나에 여러 메시지)
- User 1:N CommunityPost (한 사용자는 여러 게시글 작성)
- User 1:N Comment (한 사용자는 여러 댓글 작성)
- CommunityPost 1:N Comment (게시글 하나에 여러 댓글)
- User 1:N Challenge (한 사용자는 여러 챌린지 진행 가능)
- User 1:N Notification (한 사용자는 여러 알림 수신)
- User 1:N FileAttachment (한 사용자는 여러 파일 업로드)
- CommunityPost/Comment 1:N FileAttachment (게시글/댓글에 여러 파일 첨부)
- EmotionLog와 Challenge/AI는 데이터 상 분석 연동(별도 테이블 X, API/ETL 활용)

---

## 4. 어떤 CRUD 작업이 필요한가요?

| Entity           | Create                | Read                  | Update                | Delete             |
| ---------------- | --------------------- | --------------------- | --------------------- | ------------------ |
| User             | 자체/소셜가입(누구나) | 본인, 관리자 전체     | 본인(닉네임, 비번 등) | 본인(탈퇴), 관리자 |
| EmotionLog       | 회원/익명(본인)       | 본인, 통계(관리자/AI) | 본인                  | 본인, 관리자       |
| ChatConversation | 회원(본인, 자동생성)  | 본인, 관리자          | 본인(제목), 관리자    | 본인, 관리자       |
| ChatMessage      | 회원(본인+AI 자동)    | 본인(대화 내), 관리자 | 불가                  | 대화 삭제 시 연쇄  |
| CommunityPost    | 회원/익명(글쓰기)     | 전체(익명허용)        | 작성자(본인), 관리자  | 작성자, 관리자     |
| Comment          | 회원/익명(댓글)       | 전체(게시글 하위)     | 작성자(본인), 관리자  | 작성자, 관리자     |
| Challenge        | 회원(본인)            | 본인/통계(관리자/AI)  | 본인(상태), 관리자    | 본인, 관리자       |
| Notification     | 시스템(자동생성)      | 본인                  | 본인(읽음상태)        | 본인, 관리자       |
| FileAttachment   | 회원(본인)            | 본인, 게시글 열람자   | 불가                  | 본인, 관리자       |

---

## 5. 어떤 규칙이나 제약이 존재하나요?

- 이메일·닉네임 중복 금지(닉네임은 익명/무작위 생성 허용)
- 소셜 로그인 사용자는 auth_provider + auth_provider_id 조합이 unique
- 감정 기록/챌린지/커뮤니티 등 등록 시 비속어 필터링·내용 길이 제한
- 감정 점수는 -5~+5 범위로만 입력 가능(예외 확인)
- AI 채팅 메시지는 생성 후 수정 불가(불변성)
- 채팅 세션은 30일 이상 활동 없으면 자동 아카이브
- 커뮤니티 글/댓글은 삭제 시 Soft Delete(is_deleted=true) 처리
- 파일 업로드 크기 제한: 프로필 이미지 5MB, 게시글 첨부 10MB
- 파일 확장자 제한: 이미지(jpg, png, gif, webp), 문서(pdf)만 허용
- 알림은 생성 후 30일 경과 시 자동 삭제
- 모든 데이터 생성/수정 시 타임스탬프 기록 필수
- 일부 기능은 미성년자/비회원에게 제한(권한/나이 기반)
- Challenge는 PENDING → COMPLETED/SKIPPED 으로만 전이 가능(회고 입력 필수)
- 관리자/운영자만 유저 데이터 일괄 삭제, 데이터 복구 가능
- User 삭제(탈퇴) 시 개인정보는 익명화, 감정 기록/채팅은 통계 목적으로 30일 보관 후 삭제

---

## 6. 데이터베이스 인덱스 전략

성능 최적화를 위한 인덱스 설계:

### User

```sql
CREATE UNIQUE INDEX idx_user_email ON User(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX idx_user_nickname ON User(nickname);
CREATE UNIQUE INDEX idx_user_provider ON User(auth_provider, auth_provider_id) WHERE auth_provider IS NOT NULL;
CREATE INDEX idx_user_created ON User(created_at DESC);
CREATE INDEX idx_user_deleted ON User(is_deleted) WHERE is_deleted = false;
```

### EmotionLog

```sql
CREATE INDEX idx_emotion_user_date ON EmotionLog(user_id, recorded_at DESC);
CREATE INDEX idx_emotion_date ON EmotionLog(recorded_at DESC);
CREATE INDEX idx_emotion_score ON EmotionLog(emotion_score);
```

### ChatConversation

```sql
CREATE INDEX idx_chat_conv_user ON ChatConversation(user_id, updated_at DESC);
CREATE UNIQUE INDEX idx_chat_conv_session ON ChatConversation(session_id);
CREATE INDEX idx_chat_conv_updated ON ChatConversation(updated_at DESC);
```

### ChatMessage

```sql
CREATE INDEX idx_chat_msg_conv ON ChatMessage(conversation_id, created_at);
CREATE INDEX idx_chat_msg_created ON ChatMessage(created_at DESC);
```

### CommunityPost

```sql
CREATE INDEX idx_post_created ON CommunityPost(created_at DESC);
CREATE INDEX idx_post_user ON CommunityPost(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_post_likes ON CommunityPost(num_likes DESC);
CREATE INDEX idx_post_deleted ON CommunityPost(is_deleted) WHERE is_deleted = false;
```

### Comment

```sql
CREATE INDEX idx_comment_post ON Comment(post_id, created_at);
CREATE INDEX idx_comment_user ON Comment(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_comment_created ON Comment(created_at DESC);
```

### Challenge

```sql
CREATE INDEX idx_challenge_user_status ON Challenge(user_id, status);
CREATE INDEX idx_challenge_started ON Challenge(started_at DESC);
CREATE INDEX idx_challenge_completed ON Challenge(completed_at DESC) WHERE completed_at IS NOT NULL;
```

### Notification

```sql
CREATE INDEX idx_notif_user_read ON Notification(user_id, is_read, created_at DESC);
CREATE INDEX idx_notif_created ON Notification(created_at DESC);
CREATE INDEX idx_notif_type ON Notification(type, created_at DESC);
```

### FileAttachment

```sql
CREATE INDEX idx_file_entity ON FileAttachment(entity_type, entity_id);
CREATE INDEX idx_file_uploader ON FileAttachment(uploaded_by);
CREATE INDEX idx_file_created ON FileAttachment(created_at DESC);
```
