# 10. Admin Page (관리자 페이지)

## Page Overview
관리자가 사용자, 콘텐츠, 챌린지를 관리하고, 통계 대시보드를 확인하며, 버그/에러 로그를 모니터링할 수 있는 백오피스 페이지입니다.

**URL**: `/admin`
**Access Level**: 관리자(특수 권한)
**Primary Goal**: 서비스 운영을 효율적으로 관리하고 문제를 신속하게 해결하기

---

## Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [마음쉼표 로고]  관리자 콘솔                             [관리자: 홍길동] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────┬────────────────────────────────────────────────┐    │
│  │  📊 대시보드     │  📊 통계 대시보드                              │    │
│  │  ─────────────  │  ─────────────────────────────────────────     │    │
│  │                 │                                                │    │
│  │  [📊 대시보드]  │  ┌──────────┬──────────┬──────────┬──────────┐│    │
│  │  [👥 사용자]    │  │ 👥 총     │ 📝 감정  │ 💬 커뮤  │ 🏆 챌린 ││    │
│  │  [💬 컨텐츠]    │  │   사용자   │   기록수  │   니티   │   지    ││    │
│  │  [🏆 챌린지]    │  │          │          │          │         ││    │
│  │  [⚠️  신고]      │  │  1,234   │  5,678   │  2,345   │  890    ││    │
│  │  [📈 통계]      │  │          │          │          │         ││    │
│  │  [🐛 로그]      │  │  +12%    │  +8%     │  +15%    │  +5%    ││    │
│  │  [⚙️  설정]      │  └──────────┴──────────┴──────────┴──────────┘│    │
│  │                 │                                                │    │
│  │                 │  ┌────────────────────────────────────────────┐│    │
│  │                 │  │  📈 일일 활성 사용자 (DAU)                ││    │
│  │                 │  │  ────────────────────────────────────────  ││    │
│  │                 │  │                                            ││    │
│  │                 │  │      [Line chart showing DAU trend]        ││    │
│  │                 │  │                                            ││    │
│  │                 │  │  1/1  1/5  1/10  1/15  1/20  1/25  1/30   ││    │
│  │                 │  └────────────────────────────────────────────┘│    │
│  │                 │                                                │    │
│  │                 │  ┌────────────────────────────────────────────┐│    │
│  │                 │  │  📊 주요 지표                             ││    │
│  │                 │  │  ────────────────────────────────────────  ││    │
│  │                 │  │                                            ││    │
│  │                 │  │  • 신규 가입: 156명 (어제)                ││    │
│  │                 │  │  • 감정 기록률: 78% (활성 사용자)         ││    │
│  │                 │  │  • 평균 세션 시간: 12분                   ││    │
│  │                 │  │  • AI 채팅 사용률: 45%                    ││    │
│  │                 │  │  • 커뮤니티 참여율: 32%                   ││    │
│  │                 │  │                                            ││    │
│  │                 │  └────────────────────────────────────────────┘│    │
│  │                 │                                                │    │
│  └─────────────────┴────────────────────────────────────────────────┘    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

[When 👥 사용자 is selected]
┌──────────────────────────────────────────────────────────────────────────┐
│  📊 관리자 콘솔 > 👥 사용자 관리                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  [🔍 검색] [필터: 전체] [정렬: 최근 가입]                  [CSV 내보내기]│
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  Email              │ 닉네임   │ 가입일    │ 상태    │ 작업         │ │
│  ├─────────────────────┼─────────┼──────────┼────────┼──────────────┤ │
│  │  user1@example.com  │ 마음쉼표 │ 2024-01-15│ 활성   │[보기][정지]  │ │
│  │  user2@example.com  │ 평온함   │ 2024-01-14│ 활성   │[보기][정지]  │ │
│  │  user3@example.com  │ 익명123  │ 2024-01-13│ 정지중 │[보기][해제]  │ │
│  │  user4@example.com  │ 희망     │ 2024-01-12│ 활성   │[보기][정지]  │ │
│  │  user5@example.com  │ 응원단   │ 2024-01-11│ 탈퇴   │[보기]        │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  [1][2][3]...[10] (Pagination)                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

[When 💬 컨텐츠 is selected]
┌──────────────────────────────────────────────────────────────────────────┐
│  📊 관리자 콘솔 > 💬 컨텐츠 관리                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  [탭: 커뮤니티 글] [AI 채팅 로그] [챌린지]                                │
│                                                                            │
│  [🔍 검색] [필터: 전체] [정렬: 최신]                                      │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  작성자  │ 제목/내용           │ 작성일    │ 신고│ 상태 │ 작업      │ │
│  ├─────────┼────────────────────┼──────────┼────┼──────┼───────────┤ │
│  │  익명123 │ 오늘 회사에서...    │ 2024-01-15│ 0  │ 공개 │[보기][숨김│ │
│  │  마음쉼  │ 불안감 대처 방법... │ 2024-01-14│ 2  │ 검토 │[보기][삭제│ │
│  │  희망이  │ 무기력해요...       │ 2024-01-13│ 0  │ 공개 │[보기][숨김│ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  [1][2][3]...[10] (Pagination)                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

[When ⚠️  신고 is selected]
┌──────────────────────────────────────────────────────────────────────────┐
│  📊 관리자 콘솔 > ⚠️  신고 관리                                           │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  [탭: 미처리] [처리완료] [기각]                                           │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  신고일    │ 유형    │ 대상         │ 사유        │ 상태 │ 작업      │ │
│  ├───────────┼────────┼─────────────┼────────────┼──────┼───────────┤ │
│  │  01-15 14:30│커뮤니티│익명123 글    │부적절 내용  │미처리│[검토][처리│ │
│  │  01-14 09:15│댓글    │마음쉼 댓글   │스팸         │미처리│[검토][처리│ │
│  │  01-13 18:22│사용자  │익명456       │욕설/비방    │처리중│[보기]     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

[When 🐛 로그 is selected]
┌──────────────────────────────────────────────────────────────────────────┐
│  📊 관리자 콘솔 > 🐛 에러 로그                                            │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                            │
│  [Level: All] [Time: 24h] [Service: All]                  [실시간 갱신 ON]│
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  시간       │ Level │ Service    │ Message                          │ │
│  ├────────────┼───────┼───────────┼──────────────────────────────────┤ │
│  │  14:30:15   │ ERROR │ API        │ POST /api/emotions 500 Error     │ │
│  │  14:28:43   │ WARN  │ Auth       │ Failed login attempt for user... │ │
│  │  14:25:12   │ INFO  │ Background │ Daily summary email sent         │ │
│  │  14:22:05   │ ERROR │ Database   │ Connection timeout               │ │
│  │  14:18:30   │ DEBUG │ Frontend   │ Component rendered               │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  [더보기 →]  [로그 내보내기]                                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. **Admin Header**
- **Logo + Title**: "[마음쉼표 로고] 관리자 콘솔"
- **Admin info**: "관리자: 홍길동" (right-aligned)
- **Logout**: [로그아웃] button
- **Styling**:
  - Background: bg-neutral-900, text-white
  - Height: 64px, px-6

### 2. **Admin Sidebar Navigation**
- **Title**: "📊 대시보드"
- **Menu items**:
  - 📊 대시보드
  - 👥 사용자 관리
  - 💬 컨텐츠 관리
  - 🏆 챌린지 관리
  - ⚠️ 신고 관리
  - 📈 통계/분석
  - 🐛 에러 로그
  - ⚙️ 시스템 설정
- **Styling**:
  - Width: 256px
  - Background: bg-neutral-800, text-white
  - Active item: bg-neutral-700, border-l-4 border-primary-500

### 3. **Stats Cards** (Dashboard)
- **4 cards**:
  1. 총 사용자: 1,234 (+12%)
  2. 감정 기록수: 5,678 (+8%)
  3. 커뮤니티: 2,345 (+15%)
  4. 챌린지: 890 (+5%)
- **Styling**:
  - Grid 4 columns
  - Each card: bg-white, rounded-lg, shadow-sm, p-6
  - Icon: text-4xl
  - Value: text-3xl, font-bold
  - Change: text-sm, text-green-600 (positive) or text-red-600 (negative)

### 4. **Chart Component** (DAU trend)
- **Title**: "📈 일일 활성 사용자 (DAU)"
- **Chart type**: Line chart
- **Data**: Last 30 days
- **Styling**:
  - Background: bg-white, rounded-lg, shadow-sm, p-6
  - Min-height: 300px

### 5. **User Management Table**
- **Columns**:
  - Email
  - 닉네임 (Nickname)
  - 가입일 (Join date)
  - 상태 (Status): 활성/정지/탈퇴
  - 작업 (Actions): [보기][정지][해제]
- **Filters**:
  - Search: Email, nickname
  - Status filter: 전체/활성/정지/탈퇴
  - Sort: 최근 가입/이름순
- **Actions**:
  - [보기]: View user details
  - [정지]: Suspend user
  - [해제]: Unsuspend user
  - [CSV 내보내기]: Export user list

### 6. **Content Management Table**
- **Tabs**: 커뮤니티 글/AI 채팅 로그/챌린지
- **Columns**:
  - 작성자 (Author)
  - 제목/내용 (Title/Content, truncated)
  - 작성일 (Date)
  - 신고 (Report count)
  - 상태 (Status): 공개/숨김/검토/삭제
  - 작업 (Actions): [보기][숨김][삭제]
- **Filters**: Search, status, date range

### 7. **Report Management Table**
- **Tabs**: 미처리/처리완료/기각
- **Columns**:
  - 신고일 (Report date)
  - 유형 (Type): 커뮤니티/댓글/사용자
  - 대상 (Target)
  - 사유 (Reason)
  - 상태 (Status): 미처리/처리중/완료/기각
  - 작업 (Actions): [검토][처리][기각]

### 8. **Error Log Viewer**
- **Filters**:
  - Level: All/ERROR/WARN/INFO/DEBUG
  - Time: 1h/24h/7d/30d
  - Service: All/API/Auth/Database/Frontend
- **Real-time toggle**: [실시간 갱신 ON/OFF]
- **Columns**:
  - 시간 (Time)
  - Level (color-coded)
  - Service
  - Message
- **Actions**:
  - [더보기]: Load more logs
  - [로그 내보내기]: Export logs

### 9. **User Detail Modal** (Clicking [보기])
```
┌────────────────────────────────────────┐
│  👤 사용자 상세                   [×]  │
│  ──────────────────────────────────    │
│                                        │
│  기본 정보:                            │
│  • 이메일: user1@example.com          │
│  • 닉네임: 마음쉼표                    │
│  • 가입일: 2024년 1월 15일             │
│  • 마지막 로그인: 2024년 1월 20일      │
│  • 상태: 활성                          │
│                                        │
│  활동 통계:                            │
│  • 감정 기록: 23일                     │
│  • AI 대화: 12회                       │
│  • 커뮤니티 글: 5개                    │
│  • 챌린지 완료: 3개                    │
│                                        │
│  신고 이력: 없음                       │
│                                        │
│        [정지하기]    [닫기]           │
│                                        │
└────────────────────────────────────────┘
```

---

## API Integration

### 1. **GET /api/admin/stats**
**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1234,
      "change_percentage": 12,
      "new_today": 45
    },
    "emotions": {
      "total": 5678,
      "change_percentage": 8
    },
    "community": {
      "total_posts": 2345,
      "total_comments": 8901,
      "change_percentage": 15
    },
    "challenges": {
      "total_active": 890,
      "change_percentage": 5
    }
  }
}
```

### 2. **GET /api/admin/users?page=1&limit=20&status=all&sort=recent**
**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user1@example.com",
        "nickname": "마음쉼표",
        "status": "active",
        "joined_at": "2024-01-15T00:00:00Z",
        "last_login_at": "2024-01-20T14:30:00Z"
      }
    ],
    "total": 1234,
    "page": 1,
    "pages": 62
  }
}
```

### 3. **PATCH /api/admin/users/{id}/suspend**
**Request:**
```json
{
  "reason": "커뮤니티 가이드라인 위반",
  "duration_days": 7
}
```

**Response:**
```json
{
  "success": true,
  "message": "사용자가 정지되었습니다."
}
```

### 4. **GET /api/admin/reports?status=pending&page=1**
**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "uuid",
        "type": "community_post",
        "target_id": "uuid",
        "target_preview": "오늘 회사에서...",
        "reason": "inappropriate_content",
        "reporter_id": "uuid",
        "status": "pending",
        "created_at": "2024-01-15T14:30:00Z"
      }
    ],
    "total": 12
  }
}
```

### 5. **GET /api/admin/logs?level=all&time=24h&service=all&page=1**
**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "timestamp": "2024-01-15T14:30:15Z",
        "level": "ERROR",
        "service": "API",
        "message": "POST /api/emotions 500 Error",
        "details": { ... }
      }
    ],
    "total": 234
  }
}
```

---

## Security Considerations

### Access Control
- **Role check**: Verify admin role before allowing access
- **Permission levels**: Super admin, moderator, analyst
- **Audit log**: Track all admin actions (who, what, when)
- **Two-factor auth**: Require 2FA for admin login

### Data Privacy
- **PII masking**: Mask sensitive user data (email, phone)
- **Action confirmation**: Confirm destructive actions (delete, suspend)
- **Export limits**: Rate limit data exports

---

## Notes
- **Tone**: Professional, data-driven
- **Real-time**: Use WebSocket for real-time log updates
- **Performance**: Optimize table queries with pagination, indexing
- **Accessibility**: Keyboard navigation, screen reader support
- **Mobile**: Admin console is desktop-only (responsive not required)
