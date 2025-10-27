# 인증/인가 전략 (Authentication & Authorization Strategy)

## 소개
마음쉼표(Mind Pause) 프로젝트의 인증(Authentication) 및 인가(Authorization) 전략을 정의합니다.
보안성, 사용성, 확장성을 모두 고려한 설계입니다.

---

## 1. 인증 방식 개요

### 지원하는 인증 방법
1. **이메일/비밀번호** - 일반 회원가입
2. **Google OAuth 2.0** - 소셜 로그인
3. **Kakao OAuth 2.0** - 소셜 로그인
4. **Naver OAuth 2.0** - 소셜 로그인 (선택적)
5. **익명 로그인** - 제한된 기능 사용

### 토큰 기반 인증
- **JWT (JSON Web Token)** 사용
- **Access Token** + **Refresh Token** 패턴
- Stateless 인증 (서버 세션 불필요)

---

## 2. JWT Token 구조

### Access Token
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "role": "USER",
    "isAnonymous": false,
    "iat": 1705747200,
    "exp": 1705750800
  },
  "signature": "..."
}
```

**만료 시간**: 1시간 (3600초)

### Refresh Token
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "type": "refresh",
    "iat": 1705747200,
    "exp": 1713523200
  },
  "signature": "..."
}
```

**만료 시간**: 90일 (7,776,000초)

### Token Payload 필드
- `sub`: User ID (UUID)
- `email`: 사용자 이메일
- `role`: 사용자 역할 (USER, ADMIN, EXPERT)
- `isAnonymous`: 익명 사용자 여부
- `type`: 토큰 타입 (refresh token에만 존재)
- `iat`: 발급 시간 (Issued At)
- `exp`: 만료 시간 (Expiration)

---

## 3. 이메일/비밀번호 인증

### 회원가입 흐름
```
1. 클라이언트 → 서버: POST /auth/register
   {
     "email": "user@example.com",
     "password": "password123!",
     "nickname": "닉네임"
   }

2. 서버:
   - 이메일 중복 확인
   - 닉네임 중복 확인
   - 비밀번호 검증 (길이, 복잡도)
   - 비밀번호 해싱 (bcrypt, salt rounds: 10)
   - User 레코드 생성
   - Access Token + Refresh Token 생성

3. 서버 → 클라이언트: 201 Created
   {
     "user": { ... },
     "tokens": {
       "accessToken": "...",
       "refreshToken": "...",
       "expiresIn": 3600
     }
   }

4. 클라이언트:
   - Access Token → 메모리 또는 localStorage
   - Refresh Token → httpOnly Cookie (권장) 또는 localStorage
```

### 로그인 흐름
```
1. 클라이언트 → 서버: POST /auth/login
   {
     "email": "user@example.com",
     "password": "password123!"
   }

2. 서버:
   - 이메일로 User 조회
   - 비밀번호 검증 (bcrypt.compare)
   - last_login_at 업데이트
   - Access Token + Refresh Token 생성

3. 서버 → 클라이언트: 200 OK
   {
     "user": { ... },
     "tokens": { ... }
   }
```

### 비밀번호 요구사항
- 최소 8자 이상
- 영문 대소문자, 숫자, 특수문자 중 3가지 이상 포함
- 이메일 주소와 유사하지 않아야 함
- 일반적인 비밀번호 금지 (common-passwords 리스트 체크)

### 비밀번호 재설정
```
1. 비밀번호 재설정 요청:
   POST /auth/forgot-password
   { "email": "user@example.com" }

   → 이메일로 재설정 링크 발송
   → 링크: https://mindpause.com/reset-password?token={reset_token}
   → 토큰 유효기간: 1시간

2. 비밀번호 재설정 실행:
   POST /auth/reset-password
   {
     "token": "reset_token",
     "newPassword": "newpassword123!"
   }

   → 토큰 검증
   → 새 비밀번호 해싱 및 저장
   → 모든 기존 Refresh Token 무효화
```

---

## 4. 소셜 로그인 (OAuth 2.0)

### OAuth 2.0 흐름 (Authorization Code Flow)

#### Google OAuth
```
1. 클라이언트 → 서버: GET /auth/google

2. 서버 → Google:
   Redirect to:
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id={GOOGLE_CLIENT_ID}&
     redirect_uri={CALLBACK_URL}&
     response_type=code&
     scope=openid email profile

3. 사용자: Google 로그인 및 권한 승인

4. Google → 서버: GET /auth/google/callback?code={auth_code}

5. 서버 → Google:
   POST https://oauth2.googleapis.com/token
   {
     "code": "auth_code",
     "client_id": "...",
     "client_secret": "...",
     "redirect_uri": "...",
     "grant_type": "authorization_code"
   }

   ← Google 응답:
   {
     "access_token": "...",
     "id_token": "...",
     "expires_in": 3600
   }

6. 서버:
   - ID Token 검증
   - Google User Info 추출 (email, name, picture)
   - DB에서 auth_provider=GOOGLE, auth_provider_id={google_id} 조회
   - 없으면 새 User 생성, 있으면 기존 User 사용
   - Access Token + Refresh Token 생성

7. 서버 → 클라이언트:
   Redirect to: https://mindpause.com/auth/callback?
     accessToken={jwt_access_token}&
     refreshToken={jwt_refresh_token}
```

#### Kakao OAuth
```
유사한 흐름, 엔드포인트만 다름:
- Authorization: https://kauth.kakao.com/oauth/authorize
- Token: https://kauth.kakao.com/oauth/token
- User Info: https://kapi.kakao.com/v2/user/me
```

### 소셜 로그인 사용자 처리
- **처음 로그인**: 새 User 레코드 생성
  - `email`: 소셜 계정 이메일
  - `nickname`: 소셜 계정 이름 또는 자동 생성
  - `auth_provider`: GOOGLE | KAKAO | NAVER
  - `auth_provider_id`: 소셜 계정 고유 ID
  - `password_hash`: NULL (소셜 로그인은 비밀번호 없음)
  - `profile_image_url`: 소셜 계정 프로필 사진

- **재로그인**: 기존 User 레코드 사용
  - `last_login_at` 업데이트
  - 프로필 정보 동기화 (선택적)

### 소셜 계정 연결
사용자가 이메일 계정과 소셜 계정을 연결할 수 있음:
```
POST /users/me/connect/google
Authorization: Bearer {access_token}

→ 이미 로그인된 상태에서 Google OAuth 진행
→ 동일한 이메일인지 확인
→ User 레코드에 auth_provider, auth_provider_id 추가
```

---

## 5. 익명 로그인

### 익명 사용자 생성
```
POST /auth/anonymous

서버:
- 임시 UUID 생성
- 익명 닉네임 생성 (예: "익명1234")
- User 레코드 생성:
  - isAnonymous: true
  - email: NULL
  - password_hash: NULL
- Access Token 생성 (Refresh Token 없음)

응답:
{
  "user": {
    "id": "uuid",
    "nickname": "익명1234",
    "isAnonymous": true
  },
  "tokens": {
    "accessToken": "...",
    "expiresIn": 86400  // 24시간
  }
}
```

### 익명 → 정식 회원 전환
```
POST /auth/convert-anonymous
Authorization: Bearer {anonymous_access_token}
{
  "email": "user@example.com",
  "password": "password123!",
  "nickname": "새닉네임"
}

서버:
- 익명 User 레코드 업데이트
- isAnonymous: false
- email, password_hash, nickname 설정
- 기존 데이터(감정 기록, 채팅 등) 유지
```

---

## 6. Token 관리

### Access Token 검증
```javascript
// 미들웨어: verifyAccessToken
1. Authorization 헤더에서 토큰 추출
   Authorization: Bearer {token}

2. JWT 검증
   - 서명 확인
   - 만료 시간 확인
   - Payload 추출

3. User 조회 (선택적, 캐싱 권장)
   - Redis에서 User 정보 캐시 확인
   - 없으면 DB에서 조회 후 캐시 저장

4. req.user에 User 정보 저장

5. 다음 미들웨어로 전달
```

### Refresh Token 갱신
```
POST /auth/refresh
{
  "refreshToken": "..."
}

서버:
1. Refresh Token 검증
   - JWT 검증
   - type === "refresh" 확인
   - 만료 시간 확인

2. Redis에서 Refresh Token 유효성 확인
   - key: refresh:{user_id}:{jti}
   - 존재하지 않으면 무효화된 토큰

3. 새 Access Token 생성
   (Refresh Token은 재사용)

응답:
{
  "accessToken": "...",
  "expiresIn": 3600
}
```

### Token 저장 전략

#### 클라이언트 측
**권장: httpOnly Cookie**
```javascript
// 서버에서 설정
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,  // HTTPS only
  sameSite: 'strict',
  maxAge: 90 * 24 * 60 * 60 * 1000  // 90일
});
```

**대안: localStorage**
```javascript
// 클라이언트에서 저장
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', token);

// XSS 공격 취약, 프로덕션에서 비권장
```

#### 서버 측 (Redis)
```
key: refresh:{user_id}:{jti}
value: {
  "userId": "uuid",
  "createdAt": "2025-01-20T10:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
ttl: 90 days
```

### Token 무효화 (Logout)
```
POST /auth/logout
Authorization: Bearer {access_token}
{
  "refreshToken": "..."
}

서버:
1. Refresh Token에서 jti 추출
2. Redis에서 refresh:{user_id}:{jti} 삭제
3. Access Token은 만료까지 유효 (블랙리스트 구현 시 추가 처리)

클라이언트:
- localStorage 또는 Cookie에서 토큰 삭제
```

### 모든 기기 로그아웃
```
POST /auth/logout-all
Authorization: Bearer {access_token}

서버:
1. Redis에서 refresh:{user_id}:* 모두 삭제
2. 사용자의 모든 Refresh Token 무효화
```

---

## 7. 권한 제어 (Authorization)

### 역할 기반 접근 제어 (RBAC)

#### 사용자 역할
```typescript
enum UserRole {
  USER = 'USER',          // 일반 사용자
  ADMIN = 'ADMIN',        // 관리자
  EXPERT = 'EXPERT'       // 전문가/상담사
}
```

#### 권한 매트릭스
| 기능 | USER | EXPERT | ADMIN |
|------|------|--------|-------|
| 감정 기록 | ✅ 본인 | ✅ 본인 | ✅ 전체 조회 |
| AI 채팅 | ✅ 본인 | ✅ 본인 + 검수 | ✅ 전체 조회 |
| 커뮤니티 글 | ✅ 작성/수정/삭제(본인) | ✅ 작성/수정/삭제(본인) | ✅ 전체 삭제 |
| 댓글 | ✅ 작성/수정/삭제(본인) | ✅ 작성/수정/삭제(본인) | ✅ 전체 삭제 |
| 챌린지 | ✅ 본인 | ✅ 본인 + 제안 | ✅ 전체 조회 |
| 사용자 관리 | ❌ | ❌ | ✅ |
| 시스템 설정 | ❌ | ❌ | ✅ |

### 미들웨어 구현

#### requireAuth
```typescript
// 인증 필수
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_MISSING',
        message: '인증 토큰이 필요합니다.'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_TOKEN_INVALID',
        message: '유효하지 않은 토큰입니다.'
      }
    });
  }
};
```

#### requireRole
```typescript
// 특정 역할 필요
export const requireRole = (...roles: UserRole[]) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_REQUIRED', message: '인증이 필요합니다.' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'PERMISSION_DENIED', message: '권한이 없습니다.' }
      });
    }

    next();
  };
};
```

#### requireOwnership
```typescript
// 리소스 소유자만 접근
export const requireOwnership = (resourceType: string) => {
  return async (req, res, next) => {
    const resourceId = req.params.id;
    const userId = req.user.sub;

    // resourceType에 따라 DB 조회
    const resource = await getResource(resourceType, resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESOURCE_NOT_FOUND', message: '리소스를 찾을 수 없습니다.' }
      });
    }

    if (resource.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'PERMISSION_DENIED', message: '권한이 없습니다.' }
      });
    }

    req.resource = resource;
    next();
  };
};
```

### 라우트 보호 예시
```typescript
// 공개 엔드포인트
app.get('/community/posts', getPosts);

// 인증 필요
app.post('/emotions', requireAuth, createEmotion);

// 역할 필요
app.get('/admin/users', requireAuth, requireRole('ADMIN'), getUsers);

// 소유자만
app.patch('/emotions/:id', requireAuth, requireOwnership('emotion'), updateEmotion);
```

---

## 8. 보안 고려사항

### 비밀번호 보안
- **bcrypt** 사용 (salt rounds: 10)
- 평문 비밀번호 절대 저장 금지
- 비밀번호 재설정 시 이메일 인증
- 비밀번호 변경 시 기존 세션 무효화

### JWT 보안
- **강력한 Secret Key** (32자 이상 랜덤 문자열)
- Secret Key 환경 변수로 관리 (코드에 하드코딩 금지)
- Access Token 짧은 만료 시간 (1시간)
- Refresh Token httpOnly Cookie 사용 권장

### HTTPS 필수
- 프로덕션 환경에서 HTTPS 강제
- HTTP Strict Transport Security (HSTS) 활성화

### CORS 설정
```typescript
app.use(cors({
  origin: [
    'https://mindpause.com',
    'https://www.mindpause.com'
  ],
  credentials: true,  // Cookie 전송 허용
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

// 로그인 제한
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15분
  max: 5,  // 최대 5회 시도
  message: '너무 많은 로그인 시도입니다. 나중에 다시 시도해주세요.'
});

app.post('/auth/login', loginLimiter, login);
```

### XSS 방지
- 입력 sanitization (express-validator)
- Content Security Policy (CSP) 헤더 설정
- React의 기본 XSS 보호 활용

### SQL Injection 방지
- Prisma ORM 사용 (파라미터화된 쿼리)
- 직접 SQL 쿼리 작성 시 prepared statements 사용

---

## 9. 로깅 및 모니터링

### 로그인 이벤트 로깅
```typescript
await loginAuditLog.create({
  userId: user.id,
  event: 'LOGIN_SUCCESS',
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date()
});
```

### 의심스러운 활동 감지
- 짧은 시간 내 여러 IP에서 로그인
- 잦은 비밀번호 재설정 요청
- 비정상적인 API 호출 패턴

### 알림 설정
- 관리자 계정 로그인 시 이메일 알림
- 새 기기에서 로그인 시 사용자 알림
- 비정상 활동 감지 시 계정 잠금

---

## 10. 테스트 전략

### 유닛 테스트
```typescript
describe('JWT Token', () => {
  it('should generate valid access token', () => {
    const token = generateAccessToken(mockUser);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.sub).toBe(mockUser.id);
  });

  it('should reject expired token', () => {
    const expiredToken = generateExpiredToken(mockUser);
    expect(() => {
      jwt.verify(expiredToken, process.env.JWT_SECRET);
    }).toThrow('jwt expired');
  });
});
```

### 통합 테스트
```typescript
describe('POST /auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
  });
});
```

---

## 11. 마이그레이션 및 롤백

### 기존 사용자 마이그레이션
소셜 로그인 추가 시:
```sql
-- 기존 User 테이블에 컬럼 추가
ALTER TABLE User ADD COLUMN auth_provider VARCHAR(20);
ALTER TABLE User ADD COLUMN auth_provider_id VARCHAR(255);
ALTER TABLE User ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE User ADD COLUMN deleted_at TIMESTAMP;

-- 기존 사용자는 LOCAL로 설정
UPDATE User SET auth_provider = 'LOCAL' WHERE auth_provider IS NULL;
```

### 토큰 Secret Key 변경
```
1. 새 Secret Key 생성
2. 환경 변수에 NEW_JWT_SECRET 추가
3. 일정 기간 OLD_SECRET과 NEW_SECRET 모두 검증
4. 모든 사용자가 새 토큰으로 전환 후 OLD_SECRET 제거
```

---

## 결론

이 인증/인가 전략은 **보안성**, **사용성**, **확장성**을 모두 고려하여 설계되었습니다.

핵심 원칙:
- JWT 기반 Stateless 인증
- Access Token (1시간) + Refresh Token (90일)
- 다양한 인증 방법 지원 (이메일, 소셜, 익명)
- 역할 기반 접근 제어 (RBAC)
- 철저한 보안 조치 (HTTPS, Rate Limiting, 로깅)

MVP 출시 후 보안 감사(Security Audit)를 통해 취약점을 지속적으로 개선할 계획입니다.
