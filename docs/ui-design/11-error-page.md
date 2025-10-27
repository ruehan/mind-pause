# 11. Error Page (에러 페이지)

## Page Overview
사용자가 오류를 만났을 때 안내 메시지를 확인하고, 홈/이전 페이지로 복귀하거나 고객센터에 문의할 수 있는 에러 처리 페이지입니다.

**URL**: `/error` (또는 404, 500 상태 코드)
**Access Level**: 누구나
**Primary Goal**: 사용자가 오류 상황을 이해하고 다음 행동을 취할 수 있도록 안내하기

---

## Error Types

### 1. **404 - Page Not Found**
```
┌──────────────────────────────────────────────┐
│                                               │
│              🔍                                │
│         페이지를 찾을 수 없습니다              │
│                                               │
│  요청하신 페이지가 존재하지 않거나            │
│  이동/삭제되었을 수 있습니다.                 │
│                                               │
│  잘못 입력된 주소인지 확인해주세요.           │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │[🏠 홈으로]   │  │[← 이전 페이지]│          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  💡 이런 페이지를 찾으시나요?                 │
│  • 감정 기록하기                              │
│  • AI 코치와 대화                             │
│  • 커뮤니티 둘러보기                          │
│                                               │
└───────────────────────────────────────────────┘
```

### 2. **500 - Server Error**
```
┌──────────────────────────────────────────────┐
│                                               │
│              ⚠️                                │
│         서버 오류가 발생했습니다               │
│                                               │
│  일시적인 오류로 서비스를 이용할 수           │
│  없습니다. 잠시 후 다시 시도해주세요.         │
│                                               │
│  문제가 계속되면 고객센터로 문의해주세요.     │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │[🔄 다시시도] │  │[🏠 홈으로]   │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  [📧 고객센터 문의]                           │
│                                               │
│  오류 코드: ERR_500_20240115_143045           │
│  (문의 시 이 코드를 알려주세요)               │
│                                               │
└───────────────────────────────────────────────┘
```

### 3. **403 - Access Denied**
```
┌──────────────────────────────────────────────┐
│                                               │
│              🔒                                │
│         접근 권한이 없습니다                   │
│                                               │
│  이 페이지에 접근할 수 있는 권한이            │
│  없습니다.                                    │
│                                               │
│  로그인이 필요하거나 관리자 권한이            │
│  필요한 페이지일 수 있습니다.                 │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │[🔑 로그인]   │  │[🏠 홈으로]   │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
└───────────────────────────────────────────────┘
```

### 4. **Network Error (Offline)**
```
┌──────────────────────────────────────────────┐
│                                               │
│              📡                                │
│         인터넷 연결을 확인해주세요             │
│                                               │
│  네트워크 연결이 끊어졌거나                   │
│  불안정합니다.                                │
│                                               │
│  Wi-Fi 또는 모바일 데이터 연결을              │
│  확인해주세요.                                │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │[🔄 다시시도] │  │[오프라인모드]│          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  💾 저장된 데이터:                            │
│  최근 감정 기록 3개가 기기에 저장되어있습니다.│
│  연결 후 자동으로 동기화됩니다.               │
│                                               │
└───────────────────────────────────────────────┘
```

### 5. **Maintenance Mode**
```
┌──────────────────────────────────────────────┐
│                                               │
│              🛠️                                │
│         서비스 점검 중입니다                   │
│                                               │
│  더 나은 서비스를 위해 시스템 점검을          │
│  진행하고 있습니다.                           │
│                                               │
│  점검 시간: 2024년 1월 15일 02:00 - 04:00     │
│  (약 1시간 30분 남음)                         │
│                                               │
│  점검 내용:                                   │
│  • 서버 안정성 개선                           │
│  • 새로운 기능 추가                           │
│                                               │
│  [🔔 점검 완료 시 알림받기]                  │
│                                               │
│  빠른 시일 내에 찾아뵙겠습니다.               │
│  불편을 드려 죄송합니다.                      │
│                                               │
└───────────────────────────────────────────────┘
```

### 6. **Session Expired**
```
┌──────────────────────────────────────────────┐
│                                               │
│              ⏰                                │
│         세션이 만료되었습니다                  │
│                                               │
│  보안을 위해 일정 시간 활동이 없으면          │
│  자동으로 로그아웃됩니다.                     │
│                                               │
│  다시 로그인해주세요.                         │
│                                               │
│  ┌──────────────────────────────┐            │
│  │[🔑 다시 로그인하기]           │            │
│  └──────────────────────────────┘            │
│                                               │
└───────────────────────────────────────────────┘
```

### 7. **Rate Limit Exceeded**
```
┌──────────────────────────────────────────────┐
│                                               │
│              ⏱️                                │
│         요청 횟수 제한 초과                    │
│                                               │
│  짧은 시간에 너무 많은 요청을 보내셨습니다.   │
│                                               │
│  잠시 후 다시 시도해주세요.                   │
│  (약 5분 후 이용 가능)                        │
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │[🏠 홈으로]   │  │[⏰ 5분 대기] │          │
│  └──────────────┘  └──────────────┘          │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션 - 최소화)                                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                                                                            │
│                         ┌────────────────────────┐                        │
│                         │                        │                        │
│                         │       [Error Icon]     │                        │
│                         │        🔍 / ⚠️          │                        │
│                         │                        │                        │
│                         │   Error Title          │                        │
│                         │   (Large, bold)        │                        │
│                         │                        │                        │
│                         │   Error Description    │                        │
│                         │   (2-3 lines)          │                        │
│                         │                        │                        │
│                         │  ┌──────┐  ┌──────┐   │                        │
│                         │  │Button│  │Button│   │                        │
│                         │  └──────┘  └──────┘   │                        │
│                         │                        │                        │
│                         │  Additional Info       │                        │
│                         │  (Optional)            │                        │
│                         │                        │                        │
│                         └────────────────────────┘                        │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
Footer (도움말, 연락처)
```

---

## Mobile Layout (320px - 767px)

```
┌──────────────────────────┐
│  [마음쉼표 로고]          │
├──────────────────────────┤
│                           │
│                           │
│       [Error Icon]        │
│           🔍              │
│                           │
│   페이지를 찾을 수        │
│   없습니다                │
│                           │
│   요청하신 페이지가       │
│   존재하지 않거나         │
│   이동/삭제되었을 수      │
│   있습니다.               │
│                           │
│  ┌──────────────────────┐│
│  │[🏠 홈으로]           ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │[← 이전 페이지]       ││
│  └──────────────────────┘│
│                           │
│  💡 추천 페이지:          │
│  • 감정 기록하기          │
│  • AI 코치와 대화         │
│  • 커뮤니티 둘러보기      │
│                           │
└──────────────────────────┘
Footer
```

---

## Component Breakdown

### 1. **Error Icon** (Centered, large)
- **404**: 🔍 (magnifying glass)
- **500**: ⚠️ (warning)
- **403**: 🔒 (lock)
- **Network**: 📡 (antenna)
- **Maintenance**: 🛠️ (tools)
- **Session**: ⏰ (clock)
- **Rate Limit**: ⏱️ (stopwatch)
- **Size**: text-8xl (desktop), text-6xl (mobile)
- **Color**: text-neutral-400

### 2. **Error Title**
- **Text**: "페이지를 찾을 수 없습니다" (varies by error type)
- **Styling**:
  - text-3xl (desktop), text-2xl (mobile)
  - font-bold, text-neutral-800
  - mt-6, text-center

### 3. **Error Description**
- **Text**: 2-3 lines explaining the error
- **Styling**:
  - text-base, text-neutral-600
  - mt-4, text-center
  - max-w-md, mx-auto
  - leading-relaxed

### 4. **Action Buttons**
- **Primary button**: "[🏠 홈으로]" or "[🔄 다시시도]"
- **Secondary button**: "[← 이전 페이지]" or "[📧 고객센터]"
- **Styling**:
  - flex gap-4, justify-center, mt-8
  - Primary: bg-primary-500, text-white, px-6, py-3, rounded-lg
  - Secondary: border-2, border-neutral-300, text-neutral-700, px-6, py-3, rounded-lg

### 5. **Additional Info Section** (Optional)
- **Error code**: "오류 코드: ERR_500_20240115_143045"
- **Helpful links**: Suggested pages
- **Offline data**: Cached data info
- **Maintenance ETA**: Remaining time
- **Styling**:
  - bg-neutral-50, rounded-lg, p-4, mt-6
  - text-sm, text-neutral-600

### 6. **Countdown Timer** (For maintenance/rate limit)
- **Format**: "약 1시간 30분 남음" or "5분 후 이용 가능"
- **Live countdown**: Update every second
- **Styling**:
  - text-lg, font-semibold, text-primary-600
  - Animated: Pulse effect

---

## Interactions & Animations

### Initial Load
- **Fade-in**: Error icon and text (400ms ease-out)
- **Slide-up**: Buttons (300ms ease-out, 100ms delay)

### Retry Button (500 error)
- **Click**:
  - Button text changes to "재시도 중..." + spinner
  - Reload page or retry API call
  - If fails again: Show error code, suggest contact support

### Home Button
- **Click**: Navigate to `/` (home page)

### Back Button
- **Click**: `history.back()` or navigate to previous route

### Countdown Timer
- **Update**: Every second
- **Completion**: Auto-refresh page or enable retry button

---

## API Integration

### Error Logging
**POST /api/errors/log**
**Request:**
```json
{
  "error_type": "404",
  "url": "/nonexistent-page",
  "user_agent": "Mozilla/5.0...",
  "user_id": "uuid (if logged in)",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "error_id": "ERR_404_20240115_143045"
}
```

### Maintenance Status Check
**GET /api/system/status**
**Response:**
```json
{
  "success": true,
  "data": {
    "status": "maintenance",
    "maintenance_start": "2024-01-15T02:00:00Z",
    "maintenance_end": "2024-01-15T04:00:00Z",
    "message": "서버 안정성 개선 및 새로운 기능 추가"
  }
}
```

---

## Error Handling Strategy

### Client-Side Errors
- **404**: Show friendly 404 page with navigation
- **Network error**: Detect offline, show cached data
- **Timeout**: Retry with exponential backoff

### Server-Side Errors
- **500**: Log error, show generic message
- **503**: Show maintenance page
- **Rate limit**: Show countdown, auto-enable after time

### Monitoring
- **Error tracking**: Sentry, LogRocket
- **Analytics**: Track error frequency, user impact
- **Alerts**: Notify team for critical errors

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Logo → Primary button → Secondary button → Links
- **Enter**: Activate focused button
- **Esc**: No modal, not applicable

### Screen Reader Support
- **Page title**: `<title>오류 - 마음쉼표</title>`
- **Main content**: `role="main"`, `aria-live="polite"`
- **Error message**: Clear, descriptive alt text for icon
- **Buttons**: Descriptive `aria-label`

### Visual Accessibility
- **Contrast**: All text ≥4.5:1
- **Focus indicators**: Visible ring on buttons
- **No color-only info**: Icons + text for all errors

---

## SEO & Meta Tags

```html
<!-- 404 Page -->
<title>페이지를 찾을 수 없습니다 - 마음쉼표</title>
<meta name="robots" content="noindex, nofollow">

<!-- 500 Page -->
<title>서버 오류 - 마음쉼표</title>
<meta name="robots" content="noindex, nofollow">
```

---

## Notes
- **Tone**: Friendly, apologetic, helpful (not blaming user)
- **Clarity**: Clear explanation of what happened
- **Action**: Always provide next steps
- **Offline support**: Show cached data when possible
- **Error codes**: Provide for debugging (support team reference)
- **Monitoring**: Track error occurrences, analyze patterns
- **Recovery**: Auto-retry where appropriate, don't trap users
