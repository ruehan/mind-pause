# 06. Dashboard/Analytics Page (데이터 분석 및 대시보드)

## Page Overview
사용자의 감정 변화 데이터를 시각화하고, AI·커뮤니티 활동 피드백 이력을 열람하며, 행동 실천률과 챌린지 성과를 분석할 수 있는 인사이트 페이지입니다.

**URL**: `/dashboard`
**Access Level**: 회원(로그인)
**Primary Goal**: 자신의 감정 패턴을 이해하고, 긍정적인 변화를 추적하여 동기부여 얻기

---

## Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션, 프로필)                                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  📊 마음 대시보드                                                 │    │
│  │  나의 감정 변화와 성장을 한눈에 확인해보세요                      │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  [7일] [30일] [90일] [전체]                       2024년 1월    │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│  ┌───────────────────┬───────────────────┬───────────────────────┐       │
│  │  평균 감정 점수    │  기록 일수         │  연속 기록             │       │
│  │  ───────────────  │  ───────────────  │  ───────────────────  │       │
│  │      😊            │      📝            │      🔥                │       │
│  │      +2.3          │      23일          │      7일 연속          │       │
│  │  ───────────────  │  ───────────────  │  ───────────────────  │       │
│  │  이번 달: +2.3     │  이번 달: 23/31    │  최고 기록: 14일       │       │
│  │  지난 달: +1.8     │  목표: 25일        │  현재: 7일 🔥         │       │
│  └───────────────────┴───────────────────┴───────────────────────┘       │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  📈 감정 변화 추이                                              │     │
│  │  ───────────────────────────────────────────────────────────    │     │
│  │                                                                 │     │
│  │      +5 ┤                                     ●                 │     │
│  │         │                                   ╱                   │     │
│  │      +3 ┤                 ●──●          ╱                       │     │
│  │         │               ╱     ╲       ╱                         │     │
│  │      +1 ┤          ●──●        ●──●                             │     │
│  │         │        ╱                                              │     │
│  │       0 ┼──●──●                                                 │     │
│  │         │                                                        │     │
│  │      -1 ┤                                                        │     │
│  │         │                                                        │     │
│  │      -3 ┤                                                        │     │
│  │         │                                                        │     │
│  │      -5 ┼────────────────────────────────────────────────────  │     │
│  │         1/8  1/10  1/12  1/14  1/16  1/18  1/20  1/22  1/24    │     │
│  │                                                                 │     │
│  │  [내보내기 📥]                                                  │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│  ┌──────────────────────────┬───────────────────────────────────┐        │
│  │  🎯 자주 느낀 감정        │  📋 활동 요약                     │        │
│  │  ──────────────────────  │  ───────────────────────────────  │        │
│  │                          │                                   │        │
│  │  😊 좋음          8회    │  💬 AI 대화       12회           │        │
│  │  🙂 조금 좋음     7회    │  📝 커뮤니티 글   5개            │        │
│  │  😐 보통          5회    │  ❤️  공감 보냄    34회           │        │
│  │  😢 안좋음        3회    │  🏆 챌린지 완료   3개            │        │
│  │                          │  📊 성찰 일기     18일           │        │
│  │  [감정 패턴 분석 →]      │  [활동 상세 →]                   │        │
│  └──────────────────────────┴───────────────────────────────────┘        │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  💡 AI 인사이트                                                 │     │
│  │  ───────────────────────────────────────────────────────────    │     │
│  │                                                                 │     │
│  │  🎯 이번 주 변화                                                │     │
│  │  지난 주보다 평균 감정 점수가 +0.5점 상승했어요!                │     │
│  │  특히 주말에 감정이 긍정적으로 변화했네요.                      │     │
│  │                                                                 │     │
│  │  📊 패턴 발견                                                   │     │
│  │  평일 오후 시간대에 감정이 낮아지는 경향이 있어요.              │     │
│  │  💡 제안: 오후 3시에 5분 명상 루틴을 추천드립니다.             │     │
│  │                                                                 │     │
│  │  🏆 성취                                                        │     │
│  │  7일 연속 기록 달성! 꾸준한 자기 돌봄을 실천하고 계시네요 👏    │     │
│  │                                                                 │     │
│  │  [자세히 보기 →]                                                │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  🏅 이번 달 성과                                                │     │
│  │  ───────────────────────────────────────────────────────────    │     │
│  │                                                                 │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │     │
│  │  │     🔥      │  │     ✍️      │  │     💬      │            │     │
│  │  │  7일 연속   │  │  23일 기록  │  │  12회 대화  │            │     │
│  │  │  기록 달성  │  │  목표 달성  │  │  AI 코칭    │            │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │     │
│  │                                                                 │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │     │
│  │  │     ❤️      │  │     🎯      │  │     📈      │            │     │
│  │  │  34회 공감  │  │  3개 완료   │  │  +0.5점    │            │     │
│  │  │  나눔 실천  │  │  챌린지     │  │  감정 향상  │            │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │     │
│  │                                                                 │     │
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
│  📊 마음 대시보드                             │
│  나의 감정 변화와 성장을 한눈에              │
│                                               │
│  [7일][30일][90일]      2024년 1월           │
│                                               │
│  ┌──────────┬──────────┬──────────┐          │
│  │ 😊 +2.3  │ 📝 23일  │ 🔥 7일  │          │
│  │ 평균감정 │ 기록일수 │ 연속기록 │          │
│  └──────────┴──────────┴──────────┘          │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  📈 감정 변화 추이                   │    │
│  │  ──────────────────────────────────  │    │
│  │                                      │    │
│  │  [Line chart - same as desktop]     │    │
│  │                                      │    │
│  │  [내보내기 📥]                       │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  🎯 자주 느낀 감정                   │    │
│  │  😊 좋음       8회                   │    │
│  │  🙂 조금 좋음  7회                   │    │
│  │  😐 보통       5회                   │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  📋 활동 요약                        │    │
│  │  💬 AI 대화    12회                  │    │
│  │  📝 커뮤니티   5개                   │    │
│  │  ❤️  공감      34회                  │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  💡 AI 인사이트                      │    │
│  │  (Same content as desktop)           │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  🏅 이번 달 성과                     │    │
│  │  ┌───────┐ ┌───────┐ ┌───────┐      │    │
│  │  │🔥7일 │ │✍️23일│ │💬12회│      │    │
│  │  └───────┘ └───────┘ └───────┘      │    │
│  └──────────────────────────────────────┘    │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Mobile Layout (320px - 767px)

```
┌──────────────────────────┐
│  [☰] 대시보드   [👤]    │
├──────────────────────────┤
│                           │
│  📊 마음 대시보드         │
│  나의 감정 변화와 성장    │
│                           │
│  [7일][30일][90일]        │
│  2024년 1월               │
│                           │
│  ┌──────────────────────┐│
│  │ 😊 +2.3  평균 감정   ││
│  │ 📝 23일  기록 일수   ││
│  │ 🔥 7일   연속 기록   ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 📈 감정 변화 추이    ││
│  │ ────────────────     ││
│  │                      ││
│  │ [Compact chart]      ││
│  │                      ││
│  │ [내보내기 📥]        ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 🎯 자주 느낀 감정    ││
│  │ 😊 좋음       8회    ││
│  │ 🙂 조금 좋음  7회    ││
│  │ 😐 보통       5회    ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 📋 활동 요약         ││
│  │ 💬 AI 대화  12회     ││
│  │ 📝 커뮤니티 5개      ││
│  │ ❤️  공감    34회     ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 💡 AI 인사이트       ││
│  │ (Scrollable content) ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 🏅 이번 달 성과      ││
│  │ [Horizontal scroll]  ││
│  │ 🔥7일 ✍️23일 💬12회 ││
│  └──────────────────────┘│
│                           │
├──────────────────────────┤
│  [홈][기록][채팅][MY]    │
└──────────────────────────┘
```

---

## Component Breakdown

### 1. **Page Header Section**
- **Icon**: 📊
- **Title**: "마음 대시보드"
- **Subtitle**: "나의 감정 변화와 성장을 한눈에 확인해보세요"
- **Styling**:
  - Title: text-2xl, font-bold, text-neutral-800
  - Subtitle: text-base, text-neutral-600, mt-2

### 2. **Date Range Selector** (Tab group)
- **Layout**: Horizontal tabs
- **Options**:
  - 7일 (Last 7 days)
  - 30일 (Last 30 days)
  - 90일 (Last 90 days)
  - 전체 (All time)
- **Date display**: Current month/year (right-aligned)
- **Styling**:
  - Container: bg-white, rounded-lg, shadow-sm, p-4, mb-6
  - Each tab: px-4, py-2, rounded-lg, text-sm, font-medium
  - Active tab: bg-primary-500, text-white
  - Inactive tab: text-neutral-700, hover:bg-neutral-100

### 3. **Summary Stats Row** (3 stat cards)
- **Layout**: Grid 3 columns (desktop), 1 column (mobile)
- **Cards**:
  1. **평균 감정 점수** (Average emotion score)
  2. **기록 일수** (Days logged)
  3. **연속 기록** (Streak)

### 4. **Stat Card Component**
- **Title**: "평균 감정 점수"
- **Icon**: 😊 (large, centered)
- **Primary value**: "+2.3" (text-3xl, font-bold)
- **Secondary info**:
  - "이번 달: +2.3" (text-sm, text-neutral-700)
  - "지난 달: +1.8" (text-sm, text-neutral-500)
- **Styling**:
  - Background: bg-white, rounded-xl, shadow-sm
  - Padding: p-6
  - Border: border border-neutral-200
  - Hover: shadow-md
- **Color coding**:
  - Positive (+): text-green-600
  - Neutral (0): text-neutral-600
  - Negative (-): text-orange-600

### 5. **Emotion Trend Chart** (Line chart card)
- **Title**: "📈 감정 변화 추이"
- **Chart type**: Line chart with points
- **Axes**:
  - Y-axis: -5 to +5 (emotion score)
  - X-axis: Dates (1/8, 1/10, 1/12...)
- **Line styling**:
  - Color: primary-500 (blue)
  - Stroke-width: 2px
  - Points: w-3, h-3, rounded-full, bg-primary-500, border-2, border-white
  - Fill: Optional gradient under line (primary-100 to transparent)
- **Interactions**:
  - **Hover point**: Show tooltip with date, score, note excerpt
  - **Click point**: Navigate to that day's emotion log
- **Export button**: "[내보내기 📥]" (top-right)
  - Downloads CSV or PNG of chart
- **Styling**:
  - Background: bg-white, rounded-xl, shadow-sm, p-6
  - Chart area: min-height: 300px

### 6. **Two-Column Analytics** (Desktop layout)
- **Left column**: 자주 느낀 감정 (Emotion frequency)
- **Right column**: 활동 요약 (Activity summary)
- **Mobile**: Stacked vertically

### 7. **Emotion Frequency Card** (🎯 자주 느낀 감정)
- **Title**: "🎯 자주 느낀 감정"
- **List items**:
  - Emoji + label + count
  - "😊 좋음 8회"
  - Sorted by frequency (descending)
- **Bar visualization**:
  - Each item has horizontal progress bar
  - Width: Proportional to count
  - Color: Matches emotion (green for positive, orange for negative)
- **CTA button**: "[감정 패턴 분석 →]"
- **Styling**:
  - Background: bg-white, rounded-xl, shadow-sm, p-6
  - List item: flex justify-between, py-2, border-b (last:border-0)

### 8. **Activity Summary Card** (📋 활동 요약)
- **Title**: "📋 활동 요약"
- **List items**:
  - Icon + label + count
  - "💬 AI 대화 12회"
  - "📝 커뮤니티 글 5개"
  - "❤️ 공감 보냄 34회"
  - "🏆 챌린지 완료 3개"
  - "📊 성찰 일기 18일"
- **CTA button**: "[활동 상세 →]"
- **Styling**: Same as emotion frequency card

### 9. **AI Insights Card** (💡 AI 인사이트)
- **Title**: "💡 AI 인사이트"
- **Sections**:
  - **🎯 이번 주 변화**: Weekly summary with comparison
  - **📊 패턴 발견**: Detected patterns with suggestions
  - **🏆 성취**: Achievements and encouragement
- **Styling**:
  - Background: bg-gradient-to-br from-primary-50 to-lavender-50
  - Border: border-2 border-primary-200
  - Padding: p-6
  - Each section: mb-4, pb-4, border-b (last:border-0)
  - Section title: font-semibold, text-neutral-800, mb-2
  - Section content: text-sm, text-neutral-700, leading-relaxed
- **CTA button**: "[자세히 보기 →]"
- **Icon styling**: text-xl, mr-2 (inline with section title)

### 10. **Monthly Achievements Grid** (🏅 이번 달 성과)
- **Title**: "🏅 이번 달 성과"
- **Layout**: Grid 3 columns (desktop), 2 columns (mobile)
- **Achievement cards**:
  - Icon (large, centered): 🔥, ✍️, 💬, ❤️, 🎯, 📈
  - Value: "7일 연속" (text-lg, font-bold)
  - Label: "기록 달성" (text-sm, text-neutral-600)
- **Card styling**:
  - Background: bg-white, rounded-lg, shadow-sm
  - Padding: p-4, text-center
  - Border: border border-neutral-200
  - Hover: shadow-md, scale-102
- **Animation**: Fade-in on scroll (IntersectionObserver)

### 11. **Achievement Card Component**
- **Structure**:
  ```
  ┌─────────────┐
  │     🔥      │  (Icon, text-4xl)
  │  7일 연속   │  (Value, text-lg, font-bold)
  │  기록 달성  │  (Label, text-sm, text-neutral-600)
  └─────────────┘
  ```
- **Styling**:
  - Width: Full (grid-cols-3)
  - Aspect-ratio: square or 3:2
  - Background: bg-white
  - Border: border border-neutral-200
  - Hover: shadow-md, transition-all duration-200

### 12. **Export Modal** (Clicking [내보내기 📥])
- **Title**: "데이터 내보내기"
- **Options**:
  - **CSV**: "감정 기록 CSV 다운로드"
  - **PNG**: "차트 이미지 다운로드"
  - **PDF**: "전체 리포트 PDF" (future)
- **Date range selector**: Same as page header
- **Buttons**:
  - Cancel: Ghost button, "취소"
  - Export: Primary button, "내보내기"
- **Styling**:
  - Modal: max-w-md, bg-white, rounded-2xl, shadow-2xl, p-6
  - Each option: Radio button + label, p-3, rounded-lg, hover:bg-neutral-50

### 13. **Empty State** (No data yet)
```
┌────────────────────────────────────┐
│           📊                        │
│  아직 분석할 데이터가 없어요        │
│  감정을 기록하고 나만의             │
│  마음 대시보드를 만들어보세요!      │
│                                    │
│     [첫 감정 기록하기 →]           │
└────────────────────────────────────┘
```

### 14. **Tooltip Component** (Hover on chart point)
- **Content**:
  - Date: "1월 15일 (월)"
  - Score: "😊 +3 (좋음)"
  - Note: "오늘은 팀 프로젝트가..." (truncated)
- **Styling**:
  - Background: bg-neutral-800, text-white
  - Padding: p-3, rounded-lg
  - Shadow: shadow-lg
  - Arrow: Pointing to data point
  - Position: Above chart point, auto-adjust if near edge
  - Max-width: 200px
  - Font-size: text-sm

---

## State Variations

### 1. **Empty State** (No data)
- Show empty state illustration (📊)
- Message: "아직 분석할 데이터가 없어요"
- CTA: "[첫 감정 기록하기 →]"
- Hide all data sections

### 2. **Loading State** (Fetching data)
- Show skeleton loaders:
  - 3 stat cards (shimmer effect)
  - Chart area (gray placeholder)
  - List items (3-5 skeleton rows)
- Date range selector remains interactive

### 3. **Partial Data** (<7 days of logs)
- Show warning banner: "⚠️ 더 정확한 분석을 위해 7일 이상 기록을 추천드립니다"
- Display available data
- AI insights show limited patterns

### 4. **Chart Interaction States**
- **Hover point**: Highlight point (scale-125), show tooltip
- **Click point**: Navigate to emotion log detail
- **Drag to zoom**: Select date range (future feature)

### 5. **Export Success**
- Toast notification: "CSV 파일이 다운로드되었습니다 ✓"
- Modal closes
- File downloads automatically

### 6. **Export Error**
- Toast notification: "내보내기에 실패했습니다. 다시 시도해주세요."
- Modal remains open
- Retry button available

---

## Interactions & Animations

### Date Range Selector
- **Click tab**: Fade out old data (150ms) → Fetch new data → Fade in (200ms)
- **Active tab**: Border-bottom animation (slide-in effect)

### Stat Cards
- **Hover**: Shadow increases (shadow-md), subtle scale (scale-102)
- **Number change**: Count-up animation (500ms, easing)
- **Comparison**: Up arrow (green) or down arrow (red) for trends

### Chart
- **Initial load**: Line draws from left to right (800ms, ease-out)
- **Points**: Fade in sequentially with 50ms delay
- **Hover point**:
  - Point scales up (scale-125, 200ms)
  - Tooltip fades in (150ms)
  - Vertical line to x-axis (dashed, neutral-300)
- **Click point**: Brief pulse animation, then navigate

### Emotion Frequency Bars
- **Initial load**: Bars grow from 0 to full width (600ms, ease-out, staggered 100ms)
- **Hover**: Bar darkens slightly, cursor-pointer

### Activity Summary Items
- **Initial load**: Fade in sequentially (100ms delay each)
- **Hover**: Background highlight (bg-neutral-50)

### AI Insights Card
- **Initial load**: Slide up from bottom (400ms, ease-out)
- **Scroll trigger**: Animate when entering viewport (IntersectionObserver)

### Achievement Cards
- **Initial load**: Scale up from 0 (300ms, ease-out, staggered 50ms)
- **Hover**: Shadow increases, scale-102
- **Click**: Pulse animation, show detail modal (future)

### Export Modal
- **Open**:
  - Overlay fades in (200ms)
  - Modal slides down from top (300ms, ease-out)
- **Close**:
  - Modal slides up, overlay fades out (250ms)

---

## API Integration

### 1. **GET /api/emotions/stats?period={7d|30d|90d|all}**
**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "average_score": 2.3,
    "previous_average": 1.8,
    "total_logs": 23,
    "goal_logs": 25,
    "current_streak": 7,
    "max_streak": 14,
    "emotion_distribution": {
      "very_happy": { "emoji": "😄", "label": "매우 좋음", "count": 5 },
      "happy": { "emoji": "😊", "label": "좋음", "count": 8 },
      "slightly_happy": { "emoji": "🙂", "label": "조금 좋음", "count": 7 },
      "neutral": { "emoji": "😐", "label": "보통", "count": 5 },
      "slightly_sad": { "emoji": "😟", "label": "조금 안좋음", "count": 3 },
      "sad": { "emoji": "😢", "label": "안좋음", "count": 0 },
      "very_sad": { "emoji": "😭", "label": "매우 안좋음", "count": 0 }
    },
    "activity_summary": {
      "ai_chats": 12,
      "community_posts": 5,
      "likes_given": 34,
      "challenges_completed": 3,
      "reflection_days": 18
    }
  }
}
```

### 2. **GET /api/emotions?period={7d|30d|90d|all}&format=chart**
**Response:**
```json
{
  "success": true,
  "data": {
    "chart_data": [
      { "date": "2024-01-08", "score": 0, "label": "보통", "emoji": "😐" },
      { "date": "2024-01-09", "score": -1, "label": "조금 안좋음", "emoji": "😟" },
      { "date": "2024-01-10", "score": 1, "label": "조금 좋음", "emoji": "🙂" },
      { "date": "2024-01-11", "score": 2, "label": "좋음", "emoji": "😊" },
      { "date": "2024-01-12", "score": 3, "label": "좋음", "emoji": "😊" },
      { "date": "2024-01-13", "score": 2, "label": "좋음", "emoji": "😊" },
      { "date": "2024-01-14", "score": 4, "label": "매우 좋음", "emoji": "😄" }
    ]
  }
}
```

### 3. **GET /api/insights?period={7d|30d|90d}**
**Response:**
```json
{
  "success": true,
  "data": {
    "weekly_change": {
      "title": "이번 주 변화",
      "content": "지난 주보다 평균 감정 점수가 +0.5점 상승했어요! 특히 주말에 감정이 긍정적으로 변화했네요.",
      "trend": "positive"
    },
    "patterns": {
      "title": "패턴 발견",
      "content": "평일 오후 시간대에 감정이 낮아지는 경향이 있어요.",
      "suggestion": "오후 3시에 5분 명상 루틴을 추천드립니다.",
      "action_link": "/challenge/meditation"
    },
    "achievements": {
      "title": "성취",
      "content": "7일 연속 기록 달성! 꾸준한 자기 돌봄을 실천하고 계시네요 👏",
      "badges": ["streak_7", "consistent_logger"]
    }
  }
}
```

### 4. **POST /api/emotions/export**
**Request:**
```json
{
  "format": "csv",
  "period": "30d",
  "include_ai_feedback": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "download_url": "https://cdn.mindpause.com/exports/user_123_emotions_2024-01.csv",
    "expires_at": "2024-01-15T15:00:00Z",
    "file_size": 25600
  }
}
```

### 5. **GET /api/achievements?period=monthly**
**Response:**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "streak_7",
        "icon": "🔥",
        "value": "7일 연속",
        "label": "기록 달성",
        "unlocked_at": "2024-01-15T14:00:00Z"
      },
      {
        "id": "logs_23",
        "icon": "✍️",
        "value": "23일 기록",
        "label": "목표 달성",
        "unlocked_at": "2024-01-20T12:00:00Z"
      },
      {
        "id": "ai_chats_12",
        "icon": "💬",
        "value": "12회 대화",
        "label": "AI 코칭",
        "unlocked_at": "2024-01-18T16:00:00Z"
      }
    ],
    "total": 6
  }
}
```

---

## Chart Library Integration

### Recommended Library: **Chart.js** or **Recharts** (React)

### Chart.js Configuration
```javascript
const chartConfig = {
  type: 'line',
  data: {
    labels: ['1/8', '1/10', '1/12', '1/14', '1/16', '1/18', '1/20'],
    datasets: [{
      label: '감정 점수',
      data: [0, -1, 1, 2, 3, 2, 4],
      borderColor: '#5B8CFF', // primary-500
      backgroundColor: 'rgba(91, 140, 255, 0.1)',
      pointBackgroundColor: '#5B8CFF',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.3, // Smooth curves
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -5,
        max: 5,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          title: (context) => `1월 ${context[0].label}일`,
          label: (context) => {
            const score = context.parsed.y;
            const emoji = getEmojiForScore(score);
            return `${emoji} ${score} (${getLabelForScore(score)})`;
          }
        }
      }
    }
  }
};
```

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Date range tabs → Stat cards → Chart → Cards → Export button
- **Shortcuts**:
  - `1-4`: Switch date range (7d, 30d, 90d, all)
  - `E`: Export data
  - `Arrow keys`: Navigate chart points
  - `Enter`: Select chart point, view detail
  - `Esc`: Close modals

### Screen Reader Support
- **Chart**: `role="img"`, `aria-label="감정 변화 추이 차트, 30일간 평균 +2.3점"`
- **Data points**: Announced as "1월 15일, 감정 점수 +3, 좋음"
- **Stat cards**: `aria-label="평균 감정 점수 +2.3, 지난 달 대비 0.5점 상승"`
- **Achievements**: `aria-label="7일 연속 기록 달성 배지 획득"`
- **Export button**: `aria-label="감정 데이터 내보내기"`

### Visual Accessibility
- **Color coding**: Never rely on color alone
  - Emotion scores include emoji + text labels
  - Chart lines include point markers
- **Contrast ratios**: All text ≥4.5:1
- **Focus indicators**: Visible ring-2 ring-primary-500
- **Alternative text**: Provide data table alternative for chart (screen readers)

### Chart Accessibility
- **Data table fallback**: Provide `<table>` with same data for screen readers
- **Keyboard navigation**: Arrow keys to navigate chart points
- **Tooltip accessibility**: Announce tooltip content on focus
- **High contrast mode**: Ensure chart remains readable

---

## Responsive Behavior

### Desktop (1280px+)
- Two-column layout for emotion frequency + activity summary
- 3-column grid for achievements
- Full chart with all data points visible
- Stats row: 3 equal columns

### Tablet (768px - 1023px)
- Single-column layout
- 2-column grid for achievements
- Chart: Full-width, slightly compressed
- Stats row: 3 equal columns

### Mobile (320px - 767px)
- Single-column layout
- Stats: Stacked vertically
- Chart: Simplified (fewer tick marks, smaller points)
- Achievements: Horizontal scroll or 2-column grid
- Bottom navigation bar (fixed)

---

## Performance Considerations

### Initial Load
- Fetch stats summary first (fast endpoint)
- Lazy load chart data (IntersectionObserver)
- Cache data (15 min expiry)

### Optimizations
- **Chart rendering**: Use canvas (Chart.js) for performance
- **Data aggregation**: Server-side aggregation for large datasets
- **Lazy loading**: Load achievements on scroll
- **Image export**: Generate chart PNG on server
- **Debounce date range changes**: 300ms

### Data Management
- **Local state**: Current period, filters
- **Cache**: Stats data (15 min), chart data (15 min)
- **Real-time sync**: WebSocket for live updates (future)
- **Offline support**: Show cached data with banner "오프라인 모드"

---

## Security & Privacy

### Data Access
- **User-specific**: Only show data for logged-in user
- **Date range limits**: Max 365 days to prevent server overload
- **Rate limiting**: Max 10 requests per minute per user

### Export Security
- **Signed URLs**: Time-limited export URLs (15 min expiry)
- **File encryption**: Encrypt exported files (future)
- **Audit log**: Track all export operations

---

## Future Enhancements

### Phase 2 Features
- 📊 Advanced analytics: Correlation with activities, weather, day of week
- 🎯 Custom goals: Set and track personal emotion goals
- 📈 Comparative analytics: Compare with community averages (anonymized)
- 🔔 Insights notifications: Weekly/monthly summary emails
- 📅 Calendar heatmap: GitHub-style activity heatmap
- 🏆 More achievements: Unlock badges and milestones

### Phase 3 Features
- 🤝 Share dashboard: Public profile with anonymized stats
- 📊 Custom reports: Build custom analytics views
- 🔍 Advanced filtering: Filter by tags, activities, time of day
- 📈 Predictive analytics: AI predicts future emotional trends
- 🌐 Export to health apps: Apple Health, Google Fit integration
- 🎨 Custom themes: Personalize dashboard colors

---

## Related Pages
- **Emotion Log**: Link from chart points
- **Chat**: Link from AI chat count
- **Community**: Link from community post count
- **Challenge**: Link from challenge completion count

---

## Design Assets Needed
- Empty state illustration (📊 or data visualization character)
- Achievement badge icons (🔥, ✍️, 💬, ❤️, 🎯, 📈)
- Chart axis icons and labels
- Loading spinner for data fetch
- Export icons (CSV, PNG, PDF)
- Tooltip arrow/pointer
- Skeleton loaders (stat cards, chart, lists)

---

## Notes
- **Tone**: Encouraging, data-driven, motivational
- **Privacy**: Never compare users publicly, only show anonymized community averages
- **Accuracy**: Clearly label time periods and data sources
- **Encouragement**: Focus on positive progress, not failures
- **Insights**: AI insights should be supportive, not prescriptive
- **Accessibility**: Prioritize data table alternatives for screen readers
- **Performance**: Optimize chart rendering for smooth 60fps animations
