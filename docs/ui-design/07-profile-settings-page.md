# 07. Profile/Settings Page (프로필 및 설정)

## Page Overview
사용자의 닉네임, 프로필 이미지를 관리하고, 비밀번호/알림/개인정보를 설정하며, 계정 탈퇴를 진행할 수 있는 개인 설정 페이지입니다.

**URL**: `/profile`
**Access Level**: 회원(로그인)
**Primary Goal**: 개인정보를 안전하게 관리하고 서비스 이용 경험을 개인화하기

---

## Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션, 프로필)                                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────┬────────────────────────────────────────────────┐    │
│  │  ⚙️  설정        │  👤 프로필                                     │    │
│  │  ─────────────  │  ─────────────────────────────────────────     │    │
│  │                 │                                                │    │
│  │  [👤 프로필]    │  ┌──────────────────────────────────────────┐ │    │
│  │  [🔔 알림]      │  │           👤                             │ │    │
│  │  [🔒 보안]      │  │  [프로필 이미지]                         │ │    │
│  │  [🌐 계정]      │  │  128x128px                               │ │    │
│  │  [📊 데이터]    │  │  rounded-full                            │ │    │
│  │  [ℹ️  정보]      │  │                                          │ │    │
│  │                 │  │  [사진 변경] [삭제]                      │ │    │
│  │                 │  └──────────────────────────────────────────┘ │    │
│  │                 │                                                │    │
│  │                 │  ┌──────────────────────────────────────────┐ │    │
│  │                 │  │  닉네임                                  │ │    │
│  │                 │  │  ┌────────────────────────────────┐     │ │    │
│  │                 │  │  │ 마음쉼표                        │     │ │    │
│  │                 │  │  └────────────────────────────────┘     │ │    │
│  │                 │  │  2-20자, 한글/영문/숫자 가능             │ │    │
│  │                 │  └──────────────────────────────────────────┘ │    │
│  │                 │                                                │    │
│  │                 │  ┌──────────────────────────────────────────┐ │    │
│  │                 │  │  이메일                                  │ │    │
│  │                 │  │  hangyu@example.com                      │ │    │
│  │                 │  │  (이메일은 변경할 수 없습니다)           │ │    │
│  │                 │  └──────────────────────────────────────────┘ │    │
│  │                 │                                                │    │
│  │                 │  ┌──────────────────────────────────────────┐ │    │
│  │                 │  │  소셜 연동 계정                          │ │    │
│  │                 │  │  ─────────────────────────────────────  │ │    │
│  │                 │  │                                          │ │    │
│  │                 │  │  [G] Google 계정 연동됨   [연결 해제]   │ │    │
│  │                 │  │  [K] Kakao  연동 안 됨     [연동하기]   │ │    │
│  │                 │  │  [N] Naver  연동 안 됨     [연동하기]   │ │    │
│  │                 │  │                                          │ │    │
│  │                 │  └──────────────────────────────────────────┘ │    │
│  │                 │                                                │    │
│  │                 │  ┌──────────────────────────────────────────┐ │    │
│  │                 │  │  가입일: 2024년 1월 1일                  │ │    │
│  │                 │  │  마지막 로그인: 2024년 1월 15일 14:30    │ │    │
│  │                 │  └──────────────────────────────────────────┘ │    │
│  │                 │                                                │    │
│  │                 │              [변경사항 저장]                   │    │
│  │                 │                                                │    │
│  └─────────────────┴────────────────────────────────────────────────┘    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

[When 🔔 알림 is selected]
┌──────────────────────────────────────────────────────────────────────────┐
│  ⚙️  설정 > 🔔 알림 설정                                                  │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  📧 이메일 알림                                                      │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │                                                                      │ │
│  │  [ ] 매일 감정 기록 리마인더 (오후 8시)                             │ │
│  │  [✓] 주간 감정 요약 리포트 (일요일 오전 10시)                       │ │
│  │  [✓] 새로운 댓글 알림                                                │ │
│  │  [ ] 공감 알림                                                       │ │
│  │  [✓] 챌린지 시작 및 완료 알림                                        │ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  🔔 푸시 알림 (모바일 앱 - 향후 제공 예정)                          │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │                                                                      │ │
│  │  [ ] 모든 푸시 알림 활성화                                           │ │
│  │  [ ] 감정 기록 리마인더                                              │ │
│  │  [ ] 커뮤니티 활동 알림                                              │ │
│  │  [ ] AI 코치 제안 알림                                               │ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│              [변경사항 저장]                                               │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

[When 🔒 보안 is selected]
┌──────────────────────────────────────────────────────────────────────────┐
│  ⚙️  설정 > 🔒 보안 설정                                                  │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  🔑 비밀번호 변경                                                    │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │                                                                      │ │
│  │  현재 비밀번호                                                       │ │
│  │  ┌────────────────────────────────────────────────────────────┐    │ │
│  │  │ ••••••••                                             [👁️] │    │ │
│  │  └────────────────────────────────────────────────────────────┘    │ │
│  │                                                                      │ │
│  │  새 비밀번호                                                         │ │
│  │  ┌────────────────────────────────────────────────────────────┐    │ │
│  │  │ ••••••••                                             [👁️] │    │ │
│  │  └────────────────────────────────────────────────────────────┘    │ │
│  │  8자 이상, 영문/숫자/특수문자 조합                                   │ │
│  │                                                                      │ │
│  │  새 비밀번호 확인                                                    │ │
│  │  ┌────────────────────────────────────────────────────────────┐    │ │
│  │  │ ••••••••                                             [👁️] │    │ │
│  │  └────────────────────────────────────────────────────────────┘    │ │
│  │                                                                      │ │
│  │              [비밀번호 변경]                                         │ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  🔐 2단계 인증 (향후 제공 예정)                                      │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │                                                                      │ │
│  │  [ ] 2단계 인증 활성화                                               │ │
│  │  계정 보안을 강화하기 위해 로그인 시 추가 인증을 요구합니다          │ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  📱 로그인 기기 관리                                                 │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │                                                                      │ │
│  │  💻 MacBook Pro - Chrome     현재 기기                              │ │
│  │  2024년 1월 15일 14:30                                               │ │
│  │                                                                      │ │
│  │  📱 iPhone 13 - Safari                         [로그아웃]           │ │
│  │  2024년 1월 14일 22:15                                               │ │
│  │                                                                      │ │
│  │  💻 Windows PC - Edge                          [로그아웃]           │ │
│  │  2024년 1월 10일 09:45                                               │ │
│  │                                                                      │ │
│  │              [모든 기기에서 로그아웃]                                │ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

[When 🌐 계정 is selected]
┌──────────────────────────────────────────────────────────────────────────┐
│  ⚙️  설정 > 🌐 계정 관리                                                  │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  ⚠️  계정 탈퇴                                                       │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │                                                                      │ │
│  │  탈퇴 시 주의사항:                                                   │ │
│  │  • 모든 감정 기록 및 데이터가 영구적으로 삭제됩니다                  │ │
│  │  • 커뮤니티 게시글 및 댓글은 익명 처리됩니다                         │ │
│  │  • 탈퇴 후 30일간 재가입이 제한됩니다                                │ │
│  │  • 탈퇴 후 7일 이내 복구 가능 (이후 영구 삭제)                       │ │
│  │                                                                      │ │
│  │  [✓] 위 내용을 모두 확인했으며 탈퇴에 동의합니다                     │ │
│  │                                                                      │ │
│  │              [계정 탈퇴하기]                                         │ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Tablet & Mobile Layout (768px - 375px)

```
┌──────────────────────────┐
│  [←] 설정       [👤]    │
├──────────────────────────┤
│                           │
│  ⚙️  설정                 │
│                           │
│  ┌──────────────────────┐│
│  │ 👤 프로필             ││
│  │ 닉네임, 이미지 관리   ││
│  │                  [>] ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 🔔 알림               ││
│  │ 이메일, 푸시 알림     ││
│  │                  [>] ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 🔒 보안               ││
│  │ 비밀번호, 로그인 기기 ││
│  │                  [>] ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 🌐 계정               ││
│  │ 계정 관리, 탈퇴       ││
│  │                  [>] ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 📊 데이터             ││
│  │ 내보내기, 삭제        ││
│  │                  [>] ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ ℹ️  앱 정보            ││
│  │ 버전, 이용약관        ││
│  │                  [>] ││
│  └──────────────────────┘│
│                           │
├──────────────────────────┤
│  [홈][기록][채팅][MY]    │
└──────────────────────────┘

[When tapping a section - Full screen view]
┌──────────────────────────┐
│  [←] 프로필              │
├──────────────────────────┤
│                           │
│      ┌────────┐           │
│      │  👤   │           │
│      │Profile │           │
│      └────────┘           │
│   [사진 변경] [삭제]      │
│                           │
│  닉네임                   │
│  ┌──────────────────┐    │
│  │ 마음쉼표          │    │
│  └──────────────────┘    │
│  2-20자, 한글/영문/숫자  │
│                           │
│  이메일                   │
│  hangyu@example.com       │
│  (변경 불가)              │
│                           │
│  소셜 연동                │
│  [G] Google    [연결해제]│
│  [K] Kakao     [연동하기]│
│  [N] Naver     [연동하기]│
│                           │
│     [변경사항 저장]       │
│                           │
└──────────────────────────┘
```

---

## Component Breakdown

### 1. **Settings Navigation Sidebar** (Desktop only, list on mobile)
- **Title**: "⚙️ 설정"
- **Menu items**:
  - 👤 프로필
  - 🔔 알림
  - 🔒 보안
  - 🌐 계정
  - 📊 데이터
  - ℹ️ 정보
- **Styling**:
  - Width: 256px (desktop)
  - Background: bg-neutral-50
  - Border-right: border-r border-neutral-200
  - Each item: p-4, rounded-lg, hover:bg-white
  - Active item: bg-white, border-l-4 border-primary-500, font-semibold

### 2. **Settings Content Area**
- **Layout**: flex-1, p-6 (desktop), full-screen (mobile)
- **Background**: bg-white (desktop), bg-neutral-50 (mobile)
- **Max-width**: 800px (desktop, centered)

### 3. **Profile Image Section**
- **Layout**: Centered, flex-col items-center
- **Avatar**:
  - Size: 128x128px
  - Shape: rounded-full
  - Border: border-4 border-neutral-200
  - Default: 👤 icon with bg-neutral-200
- **Buttons**:
  - **Change photo**: Ghost button, "[사진 변경]"
  - **Delete**: Text button, "[삭제]" (text-red-600)
- **File upload**: Hidden input, triggered by "사진 변경" button
- **Accepted formats**: JPEG, PNG, WebP (max 5MB)

### 4. **Input Field Component** (Nickname, Email, etc.)
- **Label**: text-sm, font-medium, text-neutral-700, mb-2
- **Input**:
  - w-full, p-3, border, rounded-lg
  - focus:border-primary-500, focus:ring-2, focus:ring-primary-200
- **Helper text**: text-xs, text-neutral-500, mt-1
- **Error state**: border-red-500, text-red-600
- **Disabled state**: bg-neutral-100, cursor-not-allowed

### 5. **Social Login Connection Cards**
- **Layout**: flex items-center justify-between, p-4, border, rounded-lg
- **Left section**:
  - Icon: [G], [K], [N] (colored, 32x32px)
  - Provider name: "Google 계정"
  - Status: "연동됨" (text-green-600) or "연동 안 됨" (text-neutral-500)
- **Right section**:
  - Button: "[연결 해제]" or "[연동하기]"
- **Styling**:
  - Connected: border-green-200, bg-green-50
  - Not connected: border-neutral-200, bg-white

### 6. **Notification Settings** (Checkbox list)
- **Section title**: "📧 이메일 알림"
- **Each item**:
  - Checkbox: w-5, h-5, text-primary-600
  - Label: text-sm, text-neutral-700, ml-3
  - Description: text-xs, text-neutral-500 (optional)
- **Layout**: space-y-4
- **Styling**:
  - Container: bg-white, rounded-xl, shadow-sm, p-6, border

### 7. **Password Change Form**
- **Fields**:
  - Current password (required)
  - New password (required)
  - Confirm new password (required)
- **Each field**:
  - Label + input + toggle visibility button (👁️)
  - Password strength indicator (bars: weak/medium/strong)
  - Helper text: "8자 이상, 영문/숫자/특수문자 조합"
- **Submit button**: Primary button, "[비밀번호 변경]"
- **Validation**:
  - Real-time password strength check
  - Match validation for confirm field
  - Error messages below each field

### 8. **Logged-in Devices List**
- **Section title**: "📱 로그인 기기 관리"
- **Each device item**:
  - Icon: 💻 (desktop), 📱 (mobile), 🖥️ (tablet)
  - Device name: "MacBook Pro - Chrome"
  - Login date: "2024년 1월 15일 14:30"
  - Status: "현재 기기" (current) or "[로그아웃]" button
- **Layout**: space-y-3
- **Styling**:
  - Current device: bg-primary-50, border-l-4 border-primary-500
  - Other devices: bg-white, border border-neutral-200
  - Each item: p-4, rounded-lg

### 9. **Logout All Devices Button**
- **Text**: "모든 기기에서 로그아웃"
- **Styling**:
  - w-full, py-3, border-2, border-red-600, text-red-600
  - rounded-lg, hover:bg-red-50
- **Confirmation**: Show modal before executing

### 10. **Account Deletion Section** (⚠️ Danger zone)
- **Layout**: bg-red-50, border-2 border-red-200, rounded-xl, p-6
- **Title**: "⚠️ 계정 탈퇴" (text-red-700, font-bold)
- **Warning list**:
  - Bullet points with consequences
  - Each point: text-sm, text-neutral-700
- **Confirmation checkbox**:
  - "위 내용을 모두 확인했으며 탈퇴에 동의합니다"
  - Required to enable delete button
- **Delete button**:
  - "[계정 탈퇴하기]"
  - bg-red-600, text-white, hover:bg-red-700
  - Disabled: opacity-50, cursor-not-allowed

### 11. **Save Button** (Bottom of each section)
- **Text**: "변경사항 저장"
- **Position**: Centered or right-aligned
- **Styling**:
  - px-8, py-3, bg-primary-500, text-white, rounded-lg
  - hover:bg-primary-600
  - Disabled: opacity-50 (when no changes)
- **State**:
  - Show "저장 중..." with spinner when saving
  - Show checkmark (✓) briefly on success

### 12. **Info Section** (ℹ️ 앱 정보)
```
┌─────────────────────────────────────┐
│  ℹ️  앱 정보                         │
│  ───────────────────────────────    │
│                                     │
│  앱 버전: 1.0.0                     │
│  마지막 업데이트: 2024년 1월 15일   │
│                                     │
│  [이용약관]                         │
│  [개인정보 처리방침]                │
│  [오픈소스 라이선스]                │
│  [고객센터 문의]                    │
│                                     │
│  © 2024 마음쉼표. All rights reserved. │
└─────────────────────────────────────┘
```

---

## State Variations

### 1. **Loading State** (Fetching user data)
- Show skeleton loaders for profile section
- Navigation sidebar remains visible

### 2. **Save Success**
- Toast notification: "변경사항이 저장되었습니다 ✓"
- Button briefly shows checkmark
- Reload user data

### 3. **Save Error**
- Toast notification: "저장에 실패했습니다. 다시 시도해주세요."
- Form data preserved
- Retry button available

### 4. **Password Change Success**
- Toast notification: "비밀번호가 변경되었습니다 ✓"
- Form clears
- User remains logged in

### 5. **Password Change Error**
- Error message below field: "현재 비밀번호가 일치하지 않습니다"
- Field border turns red
- Focus on error field

### 6. **Image Upload Success**
- New image appears immediately (optimistic UI)
- Toast notification: "프로필 이미지가 변경되었습니다 ✓"

### 7. **Image Upload Error**
- Toast notification: "이미지 업로드에 실패했습니다. 다시 시도해주세요."
- Previous image remains

### 8. **Account Deletion Confirmation Modal**
```
┌────────────────────────────────────┐
│  ⚠️  정말 탈퇴하시겠습니까?         │
│  ──────────────────────────────    │
│                                    │
│  이 작업은 되돌릴 수 없습니다.     │
│  탈퇴 후 7일 이내 복구 가능합니다. │
│                                    │
│  확인을 위해 비밀번호를 입력하세요:│
│  ┌──────────────────────────┐     │
│  │ ••••••••          [👁️]   │     │
│  └──────────────────────────┘     │
│                                    │
│      [취소]    [탈퇴하기]         │
│                                    │
└────────────────────────────────────┘
```

---

## Interactions & Animations

### Profile Image
- **Hover**: Overlay with "변경" text and camera icon
- **Click**: Open file picker
- **Upload**: Show progress bar (if >1MB)
- **Success**: Fade in new image (300ms)

### Input Fields
- **Focus**: Border color change + ring effect (200ms)
- **Error**: Shake animation (300ms) + red border
- **Success**: Brief green border flash (500ms)

### Password Visibility Toggle
- **Click [👁️]**: Toggle between ••••••• and plain text
- **Icon change**: 👁️ ↔ 👁️‍🗨️ (crossed eye)
- **Animation**: Fade transition (150ms)

### Password Strength Indicator
- **Real-time update**: As user types
- **Visual**:
  - Weak: 1 bar, red
  - Medium: 2 bars, orange
  - Strong: 3 bars, green
- **Animation**: Bars fill from left to right (200ms)

### Save Button
- **Click**: Button text changes to "저장 중..." + spinner
- **Success**:
  - Brief green background (500ms)
  - Checkmark icon (✓) replaces text (300ms)
  - Return to normal state (500ms delay)

### Social Login Connections
- **Connect click**: OAuth flow in popup window
- **Success**: Card updates with "연동됨" status, fade-in effect (300ms)
- **Disconnect click**: Show confirmation modal
- **Disconnect success**: Card updates, fade-out effect (200ms)

### Device Logout
- **Click [로그아웃]**: Show confirmation modal
- **Confirm**: Device item fades out (300ms), removed from list
- **Logout all**: Show confirmation, loading spinner, all devices fade out

### Account Deletion
- **Checkbox**: Enable/disable delete button
- **Click delete**: Show final confirmation modal
- **Enter password**: Validate in real-time
- **Confirm**: Loading spinner, redirect to farewell page

---

## API Integration

### 1. **GET /api/users/me**
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "hangyu@example.com",
    "nickname": "마음쉼표",
    "profile_image_url": "https://cdn.mindpause.com/profiles/user_123.jpg",
    "social_logins": {
      "google": { "connected": true, "email": "hangyu@gmail.com" },
      "kakao": { "connected": false },
      "naver": { "connected": false }
    },
    "notification_settings": {
      "email_emotion_reminder": false,
      "email_weekly_summary": true,
      "email_comment_notification": true,
      "email_like_notification": false,
      "email_challenge_notification": true,
      "push_enabled": false
    },
    "created_at": "2024-01-01T00:00:00Z",
    "last_login_at": "2024-01-15T14:30:00Z"
  }
}
```

### 2. **PATCH /api/users/me**
**Request:**
```json
{
  "nickname": "새로운닉네임",
  "profile_image_url": "https://cdn.mindpause.com/profiles/user_123_new.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nickname": "새로운닉네임",
    "profile_image_url": "https://cdn.mindpause.com/profiles/user_123_new.jpg",
    "updated_at": "2024-01-15T15:00:00Z"
  }
}
```

### 3. **POST /api/users/me/upload-profile-image**
**Request:** FormData with image file

**Response:**
```json
{
  "success": true,
  "data": {
    "image_url": "https://cdn.mindpause.com/profiles/user_123_1234567890.jpg",
    "thumbnail_url": "https://cdn.mindpause.com/profiles/user_123_1234567890_thumb.jpg"
  }
}
```

### 4. **PATCH /api/users/me/password**
**Request:**
```json
{
  "current_password": "oldPassword123!",
  "new_password": "newPassword456!",
  "confirm_password": "newPassword456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다."
}
```

### 5. **PATCH /api/users/me/notifications**
**Request:**
```json
{
  "email_emotion_reminder": true,
  "email_weekly_summary": true,
  "push_enabled": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notification_settings": { ... }
  }
}
```

### 6. **GET /api/users/me/sessions**
**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_123",
        "device_type": "desktop",
        "device_name": "MacBook Pro",
        "browser": "Chrome",
        "ip_address": "123.456.789.0",
        "location": "Seoul, South Korea",
        "is_current": true,
        "last_active_at": "2024-01-15T14:30:00Z",
        "created_at": "2024-01-15T14:00:00Z"
      },
      {
        "id": "session_456",
        "device_type": "mobile",
        "device_name": "iPhone 13",
        "browser": "Safari",
        "is_current": false,
        "last_active_at": "2024-01-14T22:15:00Z",
        "created_at": "2024-01-14T22:00:00Z"
      }
    ]
  }
}
```

### 7. **DELETE /api/users/me/sessions/{session_id}**
**Response:**
```json
{
  "success": true,
  "message": "해당 기기에서 로그아웃되었습니다."
}
```

### 8. **DELETE /api/users/me/sessions**
**Response:**
```json
{
  "success": true,
  "message": "모든 기기에서 로그아웃되었습니다."
}
```

### 9. **DELETE /api/users/me**
**Request:**
```json
{
  "password": "userPassword123!",
  "confirm_deletion": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "계정 탈퇴가 완료되었습니다. 7일 이내 복구 가능합니다."
}
```

### 10. **POST /api/auth/social/connect/{provider}**
**Request:**
```json
{
  "provider": "google",
  "auth_code": "oauth_authorization_code"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": "google",
    "connected": true,
    "email": "hangyu@gmail.com"
  }
}
```

### 11. **DELETE /api/auth/social/disconnect/{provider}**
**Response:**
```json
{
  "success": true,
  "message": "Google 계정 연결이 해제되었습니다."
}
```

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Sidebar → Profile image → Fields → Buttons → Footer links
- **Shortcuts**:
  - `Ctrl/Cmd + S`: Save changes
  - `Arrow keys`: Navigate sidebar (desktop)
  - `Enter`: Activate buttons
  - `Space`: Toggle checkboxes
  - `Esc`: Close modals

### Screen Reader Support
- **Profile image**: `aria-label="프로필 이미지, 변경하려면 클릭"`
- **Input fields**: Clear `aria-label` and `aria-describedby` for helper text
- **Password visibility toggle**: `aria-label="비밀번호 표시/숨기기"`
- **Checkboxes**: `aria-checked="true/false"`, clear labels
- **Delete button**: `aria-label="계정 탈퇴하기, 위험한 작업"`
- **Save button**: Announce "저장 중..." state

### Visual Accessibility
- **Text contrast**: All text ≥4.5:1
- **Focus indicators**: Visible ring-2 ring-primary-500
- **Error states**: Never rely on color alone, include icons (⚠️) and text
- **Password strength**: Include text labels, not just colored bars

---

## Security Considerations

### Password Management
- **Strength validation**: Enforce 8+ chars, alphanumeric + special chars
- **Leak checking**: Check against haveibeenpwned API (optional)
- **Rate limiting**: Max 5 password change attempts per hour
- **Current password required**: Always verify current password before change

### Session Management
- **Session timeout**: 30 days inactivity, then auto-logout
- **Concurrent sessions**: Allow max 5 active sessions
- **IP tracking**: Log IP addresses for security monitoring
- **Logout all**: Invalidate all refresh tokens

### Account Deletion
- **Soft delete**: Mark as deleted, keep data for 7 days
- **Hard delete**: After 7 days, permanently delete all data
- **Anonymization**: Convert community posts to anonymous
- **Password confirmation**: Always require password for deletion

### File Upload Security
- **File type validation**: Accept only JPEG, PNG, WebP
- **File size limit**: Max 5MB
- **Virus scanning**: Scan uploads with antivirus (future)
- **Signed URLs**: Use time-limited signed URLs for uploads

---

## Responsive Behavior

### Desktop (1280px+)
- Two-column layout: Sidebar (256px) + Content (flex-1)
- All sections visible inline
- Forms: Max-width 600px, centered

### Tablet (768px - 1023px)
- Two-column layout: Narrower sidebar (200px) + Content
- Icons only in sidebar, labels on hover
- Forms: Full-width

### Mobile (320px - 767px)
- Single-column list view
- Each section navigates to full-screen page
- Back button to return to list
- Bottom navigation bar (fixed)

---

## Performance Considerations

### Initial Load
- Fetch user profile data first
- Lazy load device sessions (IntersectionObserver)
- Cache profile data (session storage)

### Optimizations
- Debounce nickname input (500ms) for availability check
- Lazy load social login status
- Image compression before upload (client-side)
- Optimize profile image: Resize to 256x256px, compress to <200KB

---

## Future Enhancements

### Phase 2 Features
- 🔐 Two-factor authentication (2FA)
- 📱 Mobile app push notifications
- 🌍 Language selection (English, Korean)
- 🎨 Theme selection (light, dark, auto)
- 📊 Privacy dashboard (data usage transparency)
- 🔗 Connect with therapists

### Phase 3 Features
- 🔒 Biometric login (Face ID, Touch ID)
- 🔑 Passkey support (WebAuthn)
- 📈 Export all data (GDPR compliance)
- 🔐 End-to-end encryption option
- 🌐 Multi-language interface

---

## Related Pages
- **Dashboard**: Link from profile stats
- **Emotion Log**: Quick access from profile
- **Community**: View my posts/comments
- **Help**: Link from app info section

---

## Design Assets Needed
- Default profile avatar (👤 placeholder)
- Social login icons (Google, Kakao, Naver)
- Device type icons (💻 desktop, 📱 mobile, 🖥️ tablet)
- Success/error toast icons
- Password strength indicator bars
- Loading spinner
- Confirmation modal icons (⚠️ warning)

---

## Notes
- **Privacy**: Clearly communicate what data is collected and how it's used
- **Security**: Always verify current password before sensitive changes
- **User experience**: Make settings easy to find and understand
- **Tone**: Professional, clear, reassuring (especially for security/deletion)
- **Accessibility**: Prioritize keyboard navigation and screen reader support
- **Mobile-first**: Optimize for thumb-friendly tap targets
