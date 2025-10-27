# API 명세서 (API Specification)

## 소개
마음쉼표(Mind Pause) RESTful API 명세서입니다.
모든 API는 JSON 형식으로 요청/응답하며, JWT 기반 인증을 사용합니다.

---

## 1. Base Information

### Base URL
```
개발: http://localhost:3000/api/v1
스테이징: https://staging-api.mindpause.com/api/v1
프로덕션: https://api.mindpause.com/api/v1
```

### Common Headers
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

### Response Format
```json
{
  "success": true,
  "data": { /* 응답 데이터 */ },
  "message": "Success",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": { /* 추가 정보 */ }
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### HTTP Status Codes
- `200` OK - 성공
- `201` Created - 리소스 생성 성공
- `400` Bad Request - 잘못된 요청
- `401` Unauthorized - 인증 실패
- `403` Forbidden - 권한 없음
- `404` Not Found - 리소스 없음
- `409` Conflict - 충돌 (중복 등)
- `422` Unprocessable Entity - 검증 실패
- `429` Too Many Requests - 요청 제한 초과
- `500` Internal Server Error - 서버 오류

---

## 2. Authentication APIs

### 2.1 회원가입 (이메일)
```http
POST /auth/register
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123!",
  "nickname": "마음쉼표유저",
  "isAnonymous": false
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "마음쉼표유저",
      "isAnonymous": false,
      "role": "USER",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

### 2.2 로그인 (이메일)
```http
POST /auth/login
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123!"
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "user": { /* User 객체 */ },
    "tokens": { /* Tokens 객체 */ }
  }
}
```

### 2.3 소셜 로그인 (Google)
```http
GET /auth/google
```
Redirects to Google OAuth consent screen.

```http
GET /auth/google/callback?code={auth_code}
```
Handles OAuth callback and returns tokens.

### 2.4 소셜 로그인 (Kakao)
```http
GET /auth/kakao
GET /auth/kakao/callback?code={auth_code}
```

### 2.5 토큰 갱신
```http
POST /auth/refresh
```

**Request Body**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### 2.6 로그아웃
```http
POST /auth/logout
Authorization: Bearer {access_token}
```

**Response (200)**
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

### 2.7 비밀번호 재설정 요청
```http
POST /auth/forgot-password
```

**Request Body**
```json
{
  "email": "user@example.com"
}
```

### 2.8 비밀번호 재설정
```http
POST /auth/reset-password
```

**Request Body**
```json
{
  "token": "reset-token",
  "newPassword": "newpassword123!"
}
```

---

## 3. User APIs

### 3.1 내 프로필 조회
```http
GET /users/me
Authorization: Bearer {access_token}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "nickname": "마음쉼표유저",
    "profileImageUrl": "https://storage.../profile.jpg",
    "isAnonymous": false,
    "role": "USER",
    "authProvider": "LOCAL",
    "createdAt": "2025-01-15T10:30:00Z",
    "lastLoginAt": "2025-01-20T09:15:00Z"
  }
}
```

### 3.2 프로필 수정
```http
PATCH /users/me
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "nickname": "새로운닉네임",
  "profileImageUrl": "https://storage.../new-profile.jpg"
}
```

### 3.3 비밀번호 변경
```http
PATCH /users/me/password
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "currentPassword": "oldpassword123!",
  "newPassword": "newpassword123!"
}
```

### 3.4 회원 탈퇴
```http
DELETE /users/me
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "password": "password123!",
  "reason": "탈퇴 사유 (선택)"
}
```

---

## 4. Emotion Log APIs

### 4.1 감정 기록 생성
```http
POST /emotions
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "emotionScore": 3,
  "emotionText": "오늘은 기분이 좋았어요",
  "promptUsed": "하루를 돌아보며",
  "recordedAt": "2025-01-20T20:30:00Z"
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "emotionScore": 3,
    "emotionText": "오늘은 기분이 좋았어요",
    "promptUsed": "하루를 돌아보며",
    "aiFeedback": "긍정적인 하루였네요! ...",
    "recordedAt": "2025-01-20T20:30:00Z",
    "createdAt": "2025-01-20T20:35:00Z"
  }
}
```

### 4.2 감정 기록 목록 조회
```http
GET /emotions?page=1&limit=20&startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {access_token}
```

**Query Parameters**
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지 크기 (default: 20, max: 100)
- `startDate`: 시작 날짜 (ISO 8601)
- `endDate`: 종료 날짜 (ISO 8601)

**Response (200)**
```json
{
  "success": true,
  "data": {
    "emotions": [
      { /* EmotionLog 객체 */ },
      { /* EmotionLog 객체 */ }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 4.3 감정 기록 상세 조회
```http
GET /emotions/{emotionId}
Authorization: Bearer {access_token}
```

### 4.4 감정 기록 수정
```http
PATCH /emotions/{emotionId}
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "emotionScore": 4,
  "emotionText": "수정된 내용"
}
```

### 4.5 감정 기록 삭제
```http
DELETE /emotions/{emotionId}
Authorization: Bearer {access_token}
```

### 4.6 감정 통계 조회
```http
GET /emotions/stats?period=week
Authorization: Bearer {access_token}
```

**Query Parameters**
- `period`: week | month | year

**Response (200)**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "averageScore": 2.5,
    "totalLogs": 7,
    "scoreDistribution": {
      "-5": 0,
      "-4": 1,
      "-3": 0,
      "-2": 1,
      "-1": 0,
      "0": 1,
      "1": 1,
      "2": 1,
      "3": 1,
      "4": 0,
      "5": 1
    },
    "dailyScores": [
      { "date": "2025-01-13", "score": 2 },
      { "date": "2025-01-14", "score": 3 }
    ]
  }
}
```

---

## 5. Chat APIs

### 5.1 새 대화 시작
```http
POST /chat/conversations
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "title": "오늘의 감정 상담",
  "context": {
    "emotionScore": 2,
    "mood": "조금 우울함"
  }
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sessionId": "session-123",
    "userId": "uuid",
    "title": "오늘의 감정 상담",
    "context": { /* context 객체 */ },
    "createdAt": "2025-01-20T20:30:00Z"
  }
}
```

### 5.2 대화 목록 조회
```http
GET /chat/conversations?page=1&limit=20
Authorization: Bearer {access_token}
```

### 5.3 대화 상세 조회 (메시지 포함)
```http
GET /chat/conversations/{conversationId}
Authorization: Bearer {access_token}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "uuid",
      "title": "오늘의 감정 상담",
      "createdAt": "2025-01-20T20:30:00Z"
    },
    "messages": [
      {
        "id": "uuid",
        "role": "USER",
        "content": "오늘 기분이 안 좋아요",
        "createdAt": "2025-01-20T20:30:15Z"
      },
      {
        "id": "uuid",
        "role": "ASSISTANT",
        "content": "무슨 일이 있었나요? 이야기해주세요.",
        "createdAt": "2025-01-20T20:30:18Z"
      }
    ]
  }
}
```

### 5.4 메시지 전송
```http
POST /chat/conversations/{conversationId}/messages
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "content": "오늘 직장에서 힘든 일이 있었어요",
  "metadata": {
    "emotionScore": -2
  }
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "uuid",
      "role": "USER",
      "content": "오늘 직장에서 힘든 일이 있었어요",
      "createdAt": "2025-01-20T20:31:00Z"
    },
    "assistantMessage": {
      "id": "uuid",
      "role": "ASSISTANT",
      "content": "직장에서의 어려움은 많은 분들이 겪는 일이에요...",
      "createdAt": "2025-01-20T20:31:03Z"
    }
  }
}
```

### 5.5 대화 삭제
```http
DELETE /chat/conversations/{conversationId}
Authorization: Bearer {access_token}
```

---

## 6. Community APIs

### 6.1 게시글 작성
```http
POST /community/posts
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "title": "오늘 힘든 하루였어요",
  "content": "직장에서 상사와 갈등이...",
  "isAnonymous": true
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "오늘 힘든 하루였어요",
    "content": "직장에서 상사와 갈등이...",
    "isAnonymous": true,
    "numLikes": 0,
    "numComments": 0,
    "createdAt": "2025-01-20T20:35:00Z"
  }
}
```

### 6.2 게시글 목록 조회
```http
GET /community/posts?page=1&limit=20&sort=recent
Authorization: Bearer {access_token} (Optional)
```

**Query Parameters**
- `page`: 페이지 번호
- `limit`: 페이지 크기
- `sort`: recent | popular | liked

**Response (200)**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "author": {
          "nickname": "익명123",
          "isAnonymous": true
        },
        "title": "오늘 힘든 하루였어요",
        "contentPreview": "직장에서 상사와 갈등이...",
        "numLikes": 15,
        "numComments": 3,
        "createdAt": "2025-01-20T20:35:00Z"
      }
    ],
    "pagination": { /* pagination 객체 */ }
  }
}
```

### 6.3 게시글 상세 조회
```http
GET /community/posts/{postId}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "uuid",
      "author": {
        "nickname": "익명123",
        "profileImageUrl": null
      },
      "title": "오늘 힘든 하루였어요",
      "content": "직장에서 상사와 갈등이...",
      "numLikes": 15,
      "numComments": 3,
      "isLiked": false,
      "createdAt": "2025-01-20T20:35:00Z"
    }
  }
}
```

### 6.4 게시글 수정
```http
PATCH /community/posts/{postId}
Authorization: Bearer {access_token}
```

### 6.5 게시글 삭제
```http
DELETE /community/posts/{postId}
Authorization: Bearer {access_token}
```

### 6.6 게시글 좋아요
```http
POST /community/posts/{postId}/like
Authorization: Bearer {access_token}
```

### 6.7 게시글 좋아요 취소
```http
DELETE /community/posts/{postId}/like
Authorization: Bearer {access_token}
```

---

## 7. Comment APIs

### 7.1 댓글 작성
```http
POST /community/posts/{postId}/comments
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "content": "저도 비슷한 경험이 있어요. 힘내세요!",
  "isAnonymous": true
}
```

### 7.2 댓글 목록 조회
```http
GET /community/posts/{postId}/comments?page=1&limit=50
```

### 7.3 댓글 수정
```http
PATCH /community/comments/{commentId}
Authorization: Bearer {access_token}
```

### 7.4 댓글 삭제
```http
DELETE /community/comments/{commentId}
Authorization: Bearer {access_token}
```

---

## 8. Challenge APIs

### 8.1 챌린지 생성 (사용자가 직접 또는 AI 제안)
```http
POST /challenges
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "title": "매일 10분 명상하기",
  "description": "아침에 일어나서 10분간 호흡 명상",
  "status": "PENDING"
}
```

### 8.2 내 챌린지 목록
```http
GET /challenges?status=PENDING
Authorization: Bearer {access_token}
```

**Query Parameters**
- `status`: PENDING | COMPLETED | SKIPPED | all (default: all)

### 8.3 챌린지 상태 업데이트
```http
PATCH /challenges/{challengeId}
Authorization: Bearer {access_token}
```

**Request Body**
```json
{
  "status": "COMPLETED",
  "feedback": "오늘 명상을 하니 마음이 편안해졌어요"
}
```

### 8.4 챌린지 삭제
```http
DELETE /challenges/{challengeId}
Authorization: Bearer {access_token}
```

---

## 9. Notification APIs

### 9.1 알림 목록 조회
```http
GET /notifications?page=1&limit=20&unreadOnly=true
Authorization: Bearer {access_token}
```

**Query Parameters**
- `unreadOnly`: true | false (default: false)

### 9.2 알림 읽음 처리
```http
PATCH /notifications/{notificationId}/read
Authorization: Bearer {access_token}
```

### 9.3 모든 알림 읽음 처리
```http
PATCH /notifications/read-all
Authorization: Bearer {access_token}
```

### 9.4 알림 삭제
```http
DELETE /notifications/{notificationId}
Authorization: Bearer {access_token}
```

---

## 10. File Upload APIs

### 10.1 파일 업로드 (프로필 이미지)
```http
POST /files/upload/profile
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (FormData)**
```
file: (binary)
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://storage.googleapis.com/.../profile-123.jpg",
    "fileName": "profile.jpg",
    "fileSize": 245678,
    "mimeType": "image/jpeg"
  }
}
```

### 10.2 파일 업로드 (게시글 첨부)
```http
POST /files/upload/attachment
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

---

## 11. Admin APIs

### 11.1 전체 사용자 목록
```http
GET /admin/users?page=1&limit=50
Authorization: Bearer {admin_access_token}
```

### 11.2 사용자 정지/복구
```http
PATCH /admin/users/{userId}/suspend
Authorization: Bearer {admin_access_token}
```

### 11.3 게시글/댓글 삭제
```http
DELETE /admin/posts/{postId}
DELETE /admin/comments/{commentId}
Authorization: Bearer {admin_access_token}
```

### 11.4 시스템 통계
```http
GET /admin/stats
Authorization: Bearer {admin_access_token}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1234,
    "activeUsers": 567,
    "totalEmotionLogs": 8901,
    "totalPosts": 456,
    "totalComments": 1234,
    "totalConversations": 789
  }
}
```

---

## 12. Rate Limiting

API 요청 제한:

| 엔드포인트 유형 | 제한 |
|----------------|------|
| 인증 (로그인/가입) | 5 requests / 15분 |
| 일반 API | 100 requests / 15분 |
| AI 챗봇 | 30 requests / 시간 |
| 파일 업로드 | 10 requests / 시간 |
| Admin API | 1000 requests / 시간 |

제한 초과 시 `429 Too Many Requests` 응답.

---

## 13. Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 잘못된 인증 정보 | 이메일 또는 비밀번호 오류 |
| `AUTH_TOKEN_EXPIRED` | 토큰 만료 | 액세스 토큰 만료 |
| `AUTH_TOKEN_INVALID` | 유효하지 않은 토큰 | 토큰 형식 또는 서명 오류 |
| `USER_NOT_FOUND` | 사용자를 찾을 수 없음 | 존재하지 않는 사용자 |
| `USER_ALREADY_EXISTS` | 이미 존재하는 사용자 | 중복 이메일/닉네임 |
| `RESOURCE_NOT_FOUND` | 리소스를 찾을 수 없음 | 게시글, 댓글 등 |
| `PERMISSION_DENIED` | 권한 없음 | 접근 권한 부족 |
| `VALIDATION_ERROR` | 입력 검증 오류 | 필수 필드 누락 등 |
| `FILE_TOO_LARGE` | 파일 크기 초과 | 업로드 제한 초과 |
| `FILE_TYPE_NOT_ALLOWED` | 허용되지 않은 파일 형식 | MIME 타입 오류 |
| `RATE_LIMIT_EXCEEDED` | 요청 제한 초과 | 너무 많은 요청 |
| `SERVER_ERROR` | 서버 오류 | 내부 서버 오류 |

---

## 14. Webhooks (Future)

향후 구현 예정:
- AI 응답 완료 웹훅
- 알림 전송 웹훅
- 결제 완료 웹훅 (프리미엄 기능)

---

## 15. API Versioning

- 현재 버전: `v1`
- URL 경로에 버전 포함: `/api/v1/...`
- 하위 호환성 유지
- 주요 변경 시 새 버전 릴리스

---

## 결론

이 API 명세서는 MVP 개발을 위한 핵심 엔드포인트를 정의합니다.
실제 구현 시 Swagger/OpenAPI 문서로 자동 생성하여 실시간 업데이트합니다.

Swagger UI: `{base_url}/api-docs`
