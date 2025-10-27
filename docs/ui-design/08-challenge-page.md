# 08. Challenge Page (챌린지/회복 미션 페이지)

## Page Overview
사용자가 일일/주간 챌린지 및 회복 미션을 수락하고, 진행 상황을 기록하며, 성취를 확인할 수 있는 동기부여 페이지입니다.

**URL**: `/challenge`
**Access Level**: 회원(로그인)
**Primary Goal**: 작은 행동 실천을 통해 긍정적인 변화를 만들고 성취감 얻기

---

## Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션, 프로필)                                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  🏆 챌린지                                                        │    │
│  │  작은 실천으로 만드는 긍정적인 변화                               │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  [🎯 진행중] [✅ 완료] [📅 예정] [🔥 인기]                       │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│  ┌───────────────────┬───────────────────┬───────────────────────┐       │
│  │  진행중 챌린지     │  이번 주 성취      │  연속 달성             │       │
│  │  ───────────────  │  ───────────────  │  ───────────────────  │       │
│  │      📝            │      ✅            │      🔥                │       │
│  │      2개           │      3개           │      5일 연속          │       │
│  │  ───────────────  │  ───────────────  │  ───────────────────  │       │
│  │  목표: 5개         │  목표: 5개         │  최고: 14일            │       │
│  └───────────────────┴───────────────────┴───────────────────────┘       │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  🎯 진행중 챌린지                                               │     │
│  │  ───────────────────────────────────────────────────────────    │     │
│  │                                                                 │     │
│  │  ┌────────────────────────────────────────────────────────────┐│     │
│  │  │  🧘 명상 5분                                          [⋮] ││     │
│  │  │  ──────────────────────────────────────────────────────  ││     │
│  │  │                                                          ││     │
│  │  │  매일 5분 명상으로 마음의 평화를 찾아보세요           ││     │
│  │  │                                                          ││     │
│  │  │  진행률: ████████░░░░░░░░░░░░ 40% (2/5일)             ││     │
│  │  │                                                          ││     │
│  │  │  오늘 실천:                                             ││     │
│  │  │  [ ] 아침 명상 5분 완료하기                            ││     │
│  │  │                                                          ││     │
│  │  │  🏅 보상: 명상 마스터 배지                             ││     │
│  │  │  📅 남은 기간: 3일                                      ││     │
│  │  │                                                          ││     │
│  │  │  [포기하기]                    [오늘 완료 체크 ✓]      ││     │
│  │  └────────────────────────────────────────────────────────────┘│     │
│  │                                                                 │     │
│  │  ┌────────────────────────────────────────────────────────────┐│     │
│  │  │  🚶 매일 산책 30분                                    [⋮] ││     │
│  │  │  ──────────────────────────────────────────────────────  ││     │
│  │  │                                                          ││     │
│  │  │  규칙적인 산책으로 스트레스를 낮추고 활력을 되찾으세요 ││     │
│  │  │                                                          ││     │
│  │  │  진행률: ████████████░░░░░░░░ 60% (3/5일)             ││     │
│  │  │                                                          ││     │
│  │  │  오늘 실천:                                             ││     │
│  │  │  [✓] 30분 산책 완료 (14:30 체크)                       ││     │
│  │  │                                                          ││     │
│  │  │  🏅 보상: 걸음 챔피언 배지                             ││     │
│  │  │  📅 남은 기간: 2일                                      ││     │
│  │  │                                                          ││     │
│  │  │  [포기하기]                    [수정하기]               ││     │
│  │  └────────────────────────────────────────────────────────────┘│     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  💡 추천 챌린지                                                 │     │
│  │  ───────────────────────────────────────────────────────────    │     │
│  │                                                                 │     │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │     │
│  │  │  💤            │  │  📖            │  │  ☕            │  │     │
│  │  │  수면 루틴     │  │  독서 10분     │  │  카페인 줄이기 │  │     │
│  │  │  7일 챌린지    │  │  5일 챌린지    │  │  7일 챌린지    │  │     │
│  │  │                │  │                │  │                │  │     │
│  │  │  🔥 234명 진행 │  │  🔥 156명 진행 │  │  🔥 98명 진행  │  │     │
│  │  │  [시작하기 →]  │  │  [시작하기 →]  │  │  [시작하기 →]  │  │     │
│  │  └────────────────┘  └────────────────┘  └────────────────┘  │     │
│  │                                                                 │     │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │     │
│  │  │  💧            │  │  🎵            │  │  🌅            │  │     │
│  │  │  물 8잔 마시기 │  │  음악 감상     │  │  아침 루틴     │  │     │
│  │  │  5일 챌린지    │  │  3일 챌린지    │  │  7일 챌린지    │  │     │
│  │  │                │  │                │  │                │  │     │
│  │  │  🔥 189명 진행 │  │  🔥 145명 진행 │  │  🔥 210명 진행 │  │     │
│  │  │  [시작하기 →]  │  │  [시작하기 →]  │  │  [시작하기 →]  │  │     │
│  │  └────────────────┘  └────────────────┘  └────────────────┘  │     │
│  │                                                                 │     │
│  │                    [더 많은 챌린지 보기 →]                      │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Tablet Layout (768px - 1023px)

```
┌──────────────────────────────────────────────┐
│  Header                                       │
├──────────────────────────────────────────────┤
│                                               │
│  🏆 챌린지                                    │
│  작은 실천으로 만드는 긍정적인 변화          │
│                                               │
│  [🎯][✅][📅][🔥]                            │
│                                               │
│  ┌──────────┬──────────┬──────────┐          │
│  │ 📝 2개   │ ✅ 3개   │ 🔥 5일  │          │
│  │ 진행중   │ 이번 주  │ 연속     │          │
│  └──────────┴──────────┴──────────┘          │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  🧘 명상 5분                    [⋮] │    │
│  │  ──────────────────────────────────  │    │
│  │                                      │    │
│  │  매일 5분 명상으로...                │    │
│  │                                      │    │
│  │  ████████░░░░ 40% (2/5일)          │    │
│  │                                      │    │
│  │  오늘: [ ] 아침 명상 5분            │    │
│  │                                      │    │
│  │  🏅 명상 마스터 배지 | 📅 3일 남음  │    │
│  │                                      │    │
│  │  [포기]        [오늘 완료 ✓]        │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  🚶 매일 산책 30분              [⋮] │    │
│  │  (Similar structure as above)        │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  💡 추천 챌린지                               │
│  ┌───────┐ ┌───────┐ ┌───────┐              │
│  │💤수면 │ │📖독서 │ │☕카페인│              │
│  │7일    │ │5일    │ │7일     │              │
│  │234명  │ │156명  │ │98명    │              │
│  │[시작→]│ │[시작→]│ │[시작→] │              │
│  └───────┘ └───────┘ └───────┘              │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Mobile Layout (320px - 767px)

```
┌──────────────────────────┐
│  [←] 챌린지     [👤]    │
├──────────────────────────┤
│                           │
│  🏆 챌린지                │
│  작은 실천으로 만드는     │
│  긍정적인 변화            │
│                           │
│  [🎯][✅][📅][🔥]        │
│                           │
│  ┌──────────────────────┐│
│  │ 📝 2개 진행중        ││
│  │ ✅ 3개 이번 주       ││
│  │ 🔥 5일 연속          ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 🧘 명상 5분     [⋮] ││
│  │ ─────────────────    ││
│  │                      ││
│  │ 매일 5분 명상으로... ││
│  │                      ││
│  │ ████░░ 40% (2/5일)  ││
│  │                      ││
│  │ 오늘: [ ] 명상 5분   ││
│  │                      ││
│  │ 🏅배지 | 📅3일 남음  ││
│  │                      ││
│  │ [포기] [완료 ✓]     ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 🚶 산책 30분    [⋮] ││
│  │ (Similar...)         ││
│  └──────────────────────┘│
│                           │
│  💡 추천 챌린지           │
│  [Horizontal scroll]      │
│  [💤수면][📖독서][☕]   │
│                           │
├──────────────────────────┤
│  [홈][기록][채팅][MY]    │
└──────────────────────────┘
```

---

## Component Breakdown

### 1. **Page Header Section**
- **Icon**: 🏆
- **Title**: "챌린지"
- **Subtitle**: "작은 실천으로 만드는 긍정적인 변화"
- **Styling**:
  - Title: text-2xl, font-bold, text-neutral-800
  - Subtitle: text-base, text-neutral-600, mt-2

### 2. **Filter Tabs**
- **Layout**: Horizontal tabs
- **Options**:
  - 🎯 진행중 (In progress)
  - ✅ 완료 (Completed)
  - 📅 예정 (Upcoming/Available)
  - 🔥 인기 (Popular)
- **Styling**:
  - Container: bg-white, rounded-lg, shadow-sm, p-4, mb-6
  - Each tab: px-4, py-2, rounded-lg, text-sm, font-medium
  - Active tab: bg-primary-500, text-white
  - Inactive tab: text-neutral-700, hover:bg-neutral-100

### 3. **Summary Stats Row** (3 stat cards)
- **Layout**: Grid 3 columns (desktop), 1 column (mobile)
- **Cards**:
  1. **진행중 챌린지** (Active challenges)
  2. **이번 주 성취** (This week's achievements)
  3. **연속 달성** (Streak)

### 4. **Active Challenge Card**
- **Background**: bg-white, rounded-xl, shadow-sm, p-6, mb-4
- **Border**: border border-neutral-200
- **Header**:
  - Icon + Title: "🧘 명상 5분"
  - Menu button: [⋮] (top-right)
- **Description**: "매일 5분 명상으로 마음의 평화를 찾아보세요"
- **Progress bar**:
  - Label: "진행률: 40% (2/5일)"
  - Bar: w-full, h-3, bg-neutral-200, rounded-full
  - Fill: bg-gradient-to-r from-primary-500 to-primary-600, rounded-full
  - Animation: Smooth width transition (500ms)
- **Today's task**:
  - Checkbox: "[ ] 아침 명상 5분 완료하기"
  - Checked state: "✓" with timestamp ("14:30 체크")
- **Metadata**:
  - Reward: "🏅 보상: 명상 마스터 배지"
  - Remaining: "📅 남은 기간: 3일"
- **Action buttons**:
  - **Give up**: Ghost button, "[포기하기]" (text-neutral-600)
  - **Complete today**: Primary button, "[오늘 완료 체크 ✓]"

### 5. **Challenge Menu Dropdown** (From [⋮])
- **Options**:
  - "상세 보기" (View details)
  - "수정하기" (Edit)
  - "포기하기" (Give up) - text-red-600
  - "공유하기" (Share) - text-neutral-700
- **Styling**:
  - Position: absolute, right-0, top-10
  - Background: bg-white, shadow-lg, rounded-lg, border
  - Each item: p-3, hover:bg-neutral-50, text-sm

### 6. **Recommended Challenge Card** (Grid item)
- **Layout**: Grid 3 columns (desktop), 2 columns (tablet), horizontal scroll (mobile)
- **Card structure**:
  - Icon: Large emoji (💤) centered
  - Title: "수면 루틴"
  - Duration: "7일 챌린지"
  - Participants: "🔥 234명 진행"
  - CTA button: "[시작하기 →]"
- **Styling**:
  - Background: bg-white, rounded-lg, shadow-sm
  - Padding: p-4, text-center
  - Border: border border-neutral-200
  - Hover: shadow-md, scale-102
  - Icon: text-4xl, mb-2
  - Title: text-base, font-semibold, text-neutral-800
  - Duration: text-sm, text-neutral-600
  - Participants: text-xs, text-primary-600, font-medium
  - Button: w-full, mt-3, bg-primary-500, text-white, py-2, rounded-lg

### 7. **Challenge Detail Modal** (Clicking card or "상세 보기")
```
┌────────────────────────────────────────┐
│  🧘 명상 5분 챌린지                [×]│
│  ──────────────────────────────────    │
│                                        │
│  📝 설명:                              │
│  매일 5분 명상으로 마음의 평화를       │
│  찾아보세요. 스트레스 감소와           │
│  집중력 향상에 효과적입니다.           │
│                                        │
│  🎯 목표:                              │
│  • 매일 5분 이상 명상 실천             │
│  • 5일 연속 달성하기                   │
│                                        │
│  🏅 보상:                              │
│  • 명상 마스터 배지 획득               │
│  • 감정 점수 +10 보너스                │
│                                        │
│  📊 통계:                              │
│  • 현재 234명 진행 중                  │
│  • 평균 완료율: 78%                    │
│  • 예상 소요 시간: 5분/일              │
│                                        │
│  💡 팁:                                │
│  • 매일 같은 시간에 실천하세요         │
│  • 조용한 공간을 찾으세요              │
│  • 처음엔 3분부터 시작해도 좋아요      │
│                                        │
│        [취소]    [챌린지 시작 →]      │
│                                        │
└────────────────────────────────────────┘
```

### 8. **Challenge Start Confirmation Modal**
```
┌────────────────────────────────────────┐
│  🎯 챌린지를 시작하시겠습니까?         │
│  ──────────────────────────────────    │
│                                        │
│  🧘 명상 5분 챌린지                   │
│  기간: 5일                             │
│                                        │
│  시작 날짜를 선택하세요:               │
│  ( ) 오늘 시작 (권장)                  │
│  ( ) 내일 시작                         │
│  ( ) 날짜 직접 선택                    │
│                                        │
│  알림 설정:                            │
│  [✓] 매일 오전 8시 알림 받기           │
│  [✓] 완료 리마인더 (오후 8시)          │
│                                        │
│        [취소]    [시작하기 →]         │
│                                        │
└────────────────────────────────────────┘
```

### 9. **Completed Challenge Card** (In "완료" tab)
```
┌────────────────────────────────────────┐
│  🧘 명상 5분 챌린지            ✓ 완료 │
│  ──────────────────────────────────    │
│                                        │
│  완료 날짜: 2024년 1월 15일            │
│  달성률: 100% (5/5일)                  │
│                                        │
│  🏅 획득한 보상:                       │
│  • 명상 마스터 배지                    │
│  • 감정 점수 +10 보너스                │
│                                        │
│  📊 나의 기록:                         │
│  • 총 명상 시간: 25분                  │
│  • 연속 달성: 5일                      │
│                                        │
│  [다시 시작하기]    [공유하기]        │
│                                        │
└────────────────────────────────────────┘
```

### 10. **Empty State** (No active challenges)
```
┌────────────────────────────────────────┐
│           🎯                            │
│  아직 진행중인 챌린지가 없어요         │
│  새로운 챌린지를 시작해보세요!         │
│                                        │
│     [챌린지 둘러보기 →]                │
└────────────────────────────────────────┘
```

### 11. **Give Up Confirmation Modal**
```
┌────────────────────────────────────────┐
│  ⚠️  챌린지를 포기하시겠습니까?        │
│  ──────────────────────────────────    │
│                                        │
│  진행률: 40% (2/5일)                   │
│  여기까지 오느라 수고했어요!           │
│                                        │
│  포기 대신 이렇게 해보세요:            │
│  • 하루만 더 시도해보기                │
│  • 목표를 줄여서 다시 시작             │
│  • AI 코치에게 상담하기                │
│                                        │
│        [계속하기]    [포기하기]        │
│                                        │
└────────────────────────────────────────┘
```

---

## State Variations

### 1. **Empty State** (No challenges)
- Show empty state illustration (🎯)
- Message: "아직 진행중인 챌린지가 없어요"
- CTA: "[챌린지 둘러보기 →]"

### 2. **Loading State** (Fetching challenges)
- Show 2-3 skeleton loaders (challenge card shape)
- Tabs remain interactive

### 3. **Challenge Start Success**
- Toast notification: "챌린지가 시작되었습니다! 화이팅 🔥"
- Modal closes
- New challenge appears in "진행중" tab
- Confetti animation (optional)

### 4. **Daily Task Completed**
- Checkbox animates (checkmark draw, 300ms)
- Progress bar updates (smooth width transition)
- Toast notification: "오늘의 미션 완료! 잘하고 있어요 👏"
- Card updates with timestamp

### 5. **Challenge Completed**
- Confetti animation (full screen)
- Modal appears with congratulations message
- Badge unlocked animation
- Update stats (completed count, streak)

### 6. **Challenge Given Up**
- Toast notification: "챌린지를 포기했습니다. 언제든 다시 시도할 수 있어요"
- Card fades out (300ms)
- Removed from "진행중" tab

### 7. **Streak Milestone Reached**
- Special toast notification: "🔥 5일 연속 달성! 멋져요!"
- Badge animation
- Sound effect (optional)

---

## Interactions & Animations

### Challenge Card
- **Hover**: Shadow increases (shadow-md), subtle scale (scale-101)
- **Click**: Open detail modal or navigate to detail page

### Progress Bar
- **Initial load**: Fill animates from 0 to current % (800ms, ease-out)
- **Update**: Smooth width transition (500ms)
- **Color**: Gradient from primary-500 to primary-600

### Checkbox (Daily Task)
- **Click**:
  - Checkbox scale animation (scale-110 → 100, 200ms)
  - Checkmark draws in (300ms, path animation)
  - Haptic feedback (mobile)
  - Progress bar updates
- **Undo**: Click again to uncheck (confirmation if after 5 min)

### Recommended Challenge Cards
- **Hover**: Shadow increases, scale-102
- **Click**: Open detail modal
- **Participants count**: Animate count-up on first view

### Start Button
- **Click**: Open start confirmation modal
- **Modal open**: Slide up from bottom (300ms, ease-out)
- **Confetti**: On successful start (particles fade-in and fall)

### Give Up Button
- **Click**: Open warning modal
- **Hover**: Text color changes to red-600

### Badge Unlock Animation
- **Sequence**:
  1. Badge scales from 0 to 1 (400ms, ease-out, overshoot)
  2. Glow effect (pulse, 600ms)
  3. Confetti particles (fall and fade, 2s)
  4. Sound effect (optional, short chime)

---

## API Integration

### 1. **GET /api/challenges?status={active|completed|available}&sort={popular|new}**
**Response:**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "uuid",
        "title": "명상 5분",
        "icon": "🧘",
        "description": "매일 5분 명상으로 마음의 평화를 찾아보세요",
        "category": "mindfulness",
        "duration_days": 5,
        "difficulty": "easy",
        "reward": {
          "badge": "명상 마스터",
          "points": 10
        },
        "participants_count": 234,
        "completion_rate": 0.78,
        "estimated_time_per_day": "5분",
        "status": "available"
      }
    ],
    "total": 45,
    "stats": {
      "active_count": 2,
      "completed_this_week": 3,
      "current_streak": 5
    }
  }
}
```

### 2. **POST /api/challenges/{id}/start**
**Request:**
```json
{
  "start_date": "2024-01-15",
  "notification_settings": {
    "morning_reminder": true,
    "evening_reminder": true,
    "reminder_time": "08:00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_challenge_id": "uuid",
    "challenge_id": "uuid",
    "start_date": "2024-01-15",
    "target_end_date": "2024-01-20",
    "progress": {
      "completed_days": 0,
      "total_days": 5,
      "percentage": 0
    },
    "status": "active"
  }
}
```

### 3. **GET /api/challenges/my?status={active|completed}**
**Response:**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "user_challenge_id": "uuid",
        "challenge": {
          "id": "uuid",
          "title": "명상 5분",
          "icon": "🧘",
          "description": "매일 5분 명상으로...",
          "duration_days": 5,
          "reward": { "badge": "명상 마스터", "points": 10 }
        },
        "progress": {
          "completed_days": 2,
          "total_days": 5,
          "percentage": 40,
          "streak": 2
        },
        "today_task": {
          "completed": false,
          "task_text": "아침 명상 5분 완료하기"
        },
        "start_date": "2024-01-13",
        "target_end_date": "2024-01-18",
        "days_remaining": 3,
        "status": "active"
      }
    ]
  }
}
```

### 4. **POST /api/challenges/my/{user_challenge_id}/complete-today**
**Response:**
```json
{
  "success": true,
  "data": {
    "user_challenge_id": "uuid",
    "completed_at": "2024-01-15T14:30:00Z",
    "progress": {
      "completed_days": 3,
      "total_days": 5,
      "percentage": 60,
      "streak": 3
    },
    "is_challenge_completed": false
  }
}
```

### 5. **POST /api/challenges/my/{user_challenge_id}/give-up**
**Response:**
```json
{
  "success": true,
  "message": "챌린지를 포기했습니다.",
  "data": {
    "user_challenge_id": "uuid",
    "final_progress": {
      "completed_days": 2,
      "total_days": 5,
      "percentage": 40
    },
    "ended_at": "2024-01-15T15:00:00Z"
  }
}
```

### 6. **GET /api/challenges/{id}**
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "명상 5분",
    "icon": "🧘",
    "description": "매일 5분 명상으로 마음의 평화를 찾아보세요. 스트레스 감소와 집중력 향상에 효과적입니다.",
    "category": "mindfulness",
    "duration_days": 5,
    "difficulty": "easy",
    "goals": [
      "매일 5분 이상 명상 실천",
      "5일 연속 달성하기"
    ],
    "reward": {
      "badge": "명상 마스터",
      "badge_icon": "🏅",
      "points": 10,
      "description": "명상 마스터 배지 획득, 감정 점수 +10 보너스"
    },
    "statistics": {
      "participants_count": 234,
      "completion_rate": 0.78,
      "average_completion_time": "5일"
    },
    "tips": [
      "매일 같은 시간에 실천하세요",
      "조용한 공간을 찾으세요",
      "처음엔 3분부터 시작해도 좋아요"
    ],
    "estimated_time_per_day": "5분"
  }
}
```

### 7. **GET /api/challenges/my/{user_challenge_id}/history**
**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "date": "2024-01-15",
        "completed": true,
        "completed_at": "2024-01-15T14:30:00Z",
        "note": "아침에 명상했어요. 마음이 평온해졌습니다."
      },
      {
        "date": "2024-01-14",
        "completed": true,
        "completed_at": "2024-01-14T08:15:00Z"
      },
      {
        "date": "2024-01-13",
        "completed": false,
        "reason": "바빠서 건너뛰었습니다"
      }
    ]
  }
}
```

---

## Gamification Elements

### Badges
- **Types**:
  - 명상 마스터 (Meditation Master) 🧘
  - 걸음 챔피언 (Walking Champion) 🚶
  - 수면 전문가 (Sleep Expert) 💤
  - 독서광 (Bookworm) 📖
  - 건강 지킴이 (Health Guardian) 💪
- **Unlock conditions**: Complete specific challenges
- **Display**: Show in profile, dashboard, achievement section

### Streaks
- **Daily streak**: Consecutive days completing any challenge
- **Challenge streak**: Consecutive days within a challenge
- **Milestones**: 5 days, 7 days, 14 days, 30 days, 100 days
- **Rewards**: Special badges, bonus points

### Points System
- **Earn points**: Complete challenges, maintain streaks
- **Points value**:
  - Daily task: 1 point
  - Challenge completion: 5-10 points (varies by difficulty)
  - Streak milestone: 5-20 points
- **Use points**: Unlock special challenges, customize profile (future)

### Leaderboard (Future)
- **Weekly leaderboard**: Top challengers this week
- **Friends leaderboard**: Compare with friends (opt-in)
- **Anonymous**: Show rank, not personal info

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Tabs → Stat cards → Challenge cards → Buttons
- **Shortcuts**:
  - `N`: New challenge (open recommended section)
  - `Space`: Check/uncheck daily task
  - `Enter`: Activate buttons, open modals
  - `Esc`: Close modals
  - `Arrow keys`: Navigate challenge cards

### Screen Reader Support
- **Challenge card**: `role="article"`, `aria-label="명상 5분 챌린지, 진행률 40%"`
- **Progress bar**: `role="progressbar"`, `aria-valuenow="40"`, `aria-valuemin="0"`, `aria-valuemax="100"`
- **Checkbox**: `aria-checked="true/false"`, `aria-label="오늘의 명상 5분 완료하기"`
- **Start button**: `aria-label="명상 5분 챌린지 시작하기"`
- **Give up button**: `aria-label="챌린지 포기하기, 주의 필요"`

### Visual Accessibility
- **Color coding**: Never rely on color alone
  - Progress bars include percentage text
  - Checkboxes have checkmarks, not just color change
- **Contrast ratios**: All text ≥4.5:1
- **Focus indicators**: Visible ring-2 ring-primary-500
- **Touch targets**: Minimum 44x44px

---

## Responsive Behavior

### Desktop (1280px+)
- Three-column grid for recommended challenges
- Full challenge cards with all details
- Progress bars: Full-width, 12px height

### Tablet (768px - 1023px)
- Two-column grid for recommended challenges
- Compact challenge cards
- Progress bars: Full-width, 10px height

### Mobile (320px - 767px)
- Single-column layout
- Horizontal scroll for recommended challenges
- Compact challenge cards (reduced padding)
- Progress bars: Full-width, 8px height
- Bottom navigation bar (fixed)

---

## Performance Considerations

### Initial Load
- Fetch active challenges first
- Lazy load recommended challenges (IntersectionObserver)
- Cache challenge data (15 min expiry)

### Optimizations
- Virtual scrolling for long challenge lists (>50 items)
- Debounce checkbox clicks (300ms) to prevent double-submission
- Optimize badge images: SVG or small PNG (<10KB)
- Lazy load completed challenge history

---

## Security & Privacy

### Data Validation
- **Start date**: Must be today or future (max 30 days ahead)
- **Daily task completion**: Validate user owns challenge
- **Give up**: Confirm user intent (modal)

### Rate Limiting
- **Start challenges**: Max 10 new challenges per day
- **Complete tasks**: Max 20 completions per day (prevent abuse)

---

## Future Enhancements

### Phase 2 Features
- 📊 Detailed progress charts (line graph over time)
- 🏆 Global leaderboard (opt-in)
- 👥 Group challenges (with friends)
- 🎁 Unlock special challenges with points
- 📸 Photo proof for tasks (e.g., meal photo)
- 🔔 Smart reminders (based on user habits)

### Phase 3 Features
- 🤖 AI-personalized challenges
- 🎮 Challenge creation (user-generated)
- 🌍 Community challenges (everyone participates)
- 📈 Long-term challenges (30-90 days)
- 🎯 Custom goals (set own targets)
- 🔗 Integration with fitness trackers

---

## Related Pages
- **Dashboard**: Link from stats
- **Emotion Log**: Link from completed challenges
- **Community**: Share achievements
- **Profile**: View all badges earned

---

## Design Assets Needed
- Badge icons (🧘🚶💤📖☕💧🎵🌅)
- Confetti animation
- Empty state illustration (🎯 or motivational character)
- Progress bar gradient
- Checkmark animation (SVG)
- Loading spinner
- Success/error toast icons

---

## Notes
- **Tone**: Encouraging, motivational, supportive (never shaming)
- **Language**: Focus on progress, not perfection
- **Flexibility**: Allow users to pause/resume challenges
- **Privacy**: Don't share challenge progress without permission
- **Accessibility**: Ensure all interactive elements are keyboard-accessible
- **Gamification balance**: Fun but not addictive, healthy motivation
