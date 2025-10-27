# 03. Emotion Log Page (감정 기록 페이지)

## Page Overview
사용자가 오늘의 감정 상태를 기록하고, AI 프롬프트를 선택하며, 지난 기록을 확인/수정할 수 있는 핵심 기능 페이지입니다.

**URL**: `/emotion`
**Access Level**: 회원(로그인)
**Primary Goal**: 감정 상태를 직관적으로 기록하고 시각화하여 자기 인식을 높이기

---

## Desktop Layout (1280px+)

```
┌─────────────────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션, 프로필)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  📊 감정 기록                                           │     │
│  │  오늘의 감정을 기록하고 나의 마음을 들여다보세요        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📝 오늘의 감정 기록하기                                │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │                                                          │    │
│  │  오늘 기분은 어떠신가요?                                │    │
│  │  😢 ━━━━━━●━━━━━━━━━━━━━━━━━━ 😊                       │    │
│  │        -5  -3  -1   0   +1  +3  +5                      │    │
│  │                                                          │    │
│  │  [현재 선택: +2 (조금 좋음)]                            │    │
│  │                                                          │    │
│  │  ──────────────────────────────────────────────────     │    │
│  │                                                          │    │
│  │  오늘 하루를 간단히 기록해주세요 (선택)                 │    │
│  │  ┌──────────────────────────────────────────────┐      │    │
│  │  │ 오늘은 회사에서 좋은 일이 있었어요...         │      │    │
│  │  │                                               │      │    │
│  │  └──────────────────────────────────────────────┘      │    │
│  │  0/500자                                               │    │
│  │                                                          │    │
│  │  ──────────────────────────────────────────────────     │    │
│  │                                                          │    │
│  │  AI 프롬프트 선택 (선택)                                │    │
│  │  [ ] 오늘 하루 어떤 일이 있었나요?                      │    │
│  │  [✓] 지금 가장 힘든 감정은 무엇인가요?                  │    │
│  │  [ ] 오늘 감사한 일이 있다면?                           │    │
│  │  [ ] 내일은 어떤 하루를 보내고 싶나요?                  │    │
│  │                                                          │    │
│  │              [취소]  [기록하기 →]                       │    │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  📅 감정 기록 히스토리                                   │   │
│  │  ───────────────────────────────────────────────────     │   │
│  │                                                           │   │
│  │  ┌────────┬────────┬────────┬────────┬────────┬───────┐ │   │
│  │  │  Mon   │  Tue   │  Wed   │  Thu   │  Fri   │  Sat  │ │   │
│  │  ├────────┼────────┼────────┼────────┼────────┼───────┤ │   │
│  │  │   😊   │   😐   │   😢   │   😊   │   🙂   │  😊   │ │   │
│  │  │   +3   │    0   │   -2   │   +3   │   +1   │  +4   │ │   │
│  │  └────────┴────────┴────────┴────────┴────────┴───────┘ │   │
│  │                                                           │   │
│  │  ──────────────────────────────────────────────────      │   │
│  │                                                           │   │
│  │  🗓️ 2024년 1월 15일 (월)                      [수정]    │   │
│  │  감정: 😊 +3 (좋음)                                      │   │
│  │  "오늘은 팀 프로젝트가 성공적으로 마무리되어서..."      │   │
│  │  AI 피드백: 긍정적인 성과를 이루셨네요! 이런 순간들... │   │
│  │                                                           │   │
│  │  🗓️ 2024년 1월 14일 (일)                      [수정]    │   │
│  │  감정: 😐 0 (보통)                                       │   │
│  │  "특별한 일은 없었지만 편안한 하루였어요."              │   │
│  │  AI 피드백: 평온한 하루를 보내셨군요...                 │   │
│  │                                                           │   │
│  │  🗓️ 2024년 1월 13일 (토)                      [수정]    │   │
│  │  감정: 😢 -2 (조금 안좋음)                               │   │
│  │  "가족과의 갈등이 있어서 마음이 힘들었어요."            │   │
│  │  AI 피드백: 관계에서 오는 어려움은 누구나...            │   │
│  │                                                           │   │
│  │                    [더보기 →]                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Tablet Layout (768px - 1023px)

```
┌─────────────────────────────────────────┐
│  Header                                  │
├─────────────────────────────────────────┤
│                                          │
│  📊 감정 기록                            │
│  오늘의 감정을 기록하고                  │
│  나의 마음을 들여다보세요                │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  📝 오늘의 감정 기록하기           │ │
│  │  ────────────────────────────────  │ │
│  │                                    │ │
│  │  오늘 기분은 어떠신가요?           │ │
│  │  😢 ━━━●━━━━━━━━━━━━━━━━━ 😊     │ │
│  │        -5   0   +5                 │ │
│  │  [현재: +2 (조금 좋음)]            │ │
│  │                                    │ │
│  │  오늘 하루 간단히 기록 (선택)      │ │
│  │  ┌──────────────────────────┐     │ │
│  │  │ 텍스트 입력...            │     │ │
│  │  └──────────────────────────┘     │ │
│  │                                    │ │
│  │  AI 프롬프트 선택 (선택)          │ │
│  │  [✓] 지금 가장 힘든 감정은?        │ │
│  │  [ ] 오늘 감사한 일이 있다면?      │ │
│  │                                    │ │
│  │        [취소]  [기록하기 →]       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  📅 감정 기록 히스토리             │ │
│  │  ────────────────────────────────  │ │
│  │                                    │ │
│  │  [7일 감정 미니 캘린더]            │ │
│  │  😊😐😢😊🙂😊😢                    │ │
│  │                                    │ │
│  │  🗓️ 1월 15일 (월)      [수정]     │ │
│  │  😊 +3 (좋음)                      │ │
│  │  "오늘은 팀 프로젝트가..."         │ │
│  │  AI: 긍정적인 성과를...            │ │
│  │                                    │ │
│  │  🗓️ 1월 14일 (일)      [수정]     │ │
│  │  😐 0 (보통)                       │ │
│  │  "특별한 일은 없었지만..."         │ │
│  │                                    │ │
│  │           [더보기 →]               │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

---

## Mobile Layout (320px - 767px)

```
┌─────────────────────────┐
│  [☰] 감정기록   [👤]    │
├─────────────────────────┤
│                          │
│  📊 감정 기록            │
│  오늘의 감정을 기록하고  │
│  나의 마음을             │
│  들여다보세요            │
│                          │
│  ┌────────────────────┐ │
│  │ 📝 오늘의 감정     │ │
│  │ ───────────────    │ │
│  │                    │ │
│  │ 오늘 기분은?       │ │
│  │ 😢━━●━━━━━━😊     │ │
│  │   -5  0  +5        │ │
│  │ [+2 조금 좋음]     │ │
│  │                    │ │
│  │ 오늘 하루 기록     │ │
│  │ ┌────────────┐     │ │
│  │ │ 입력...     │     │ │
│  │ └────────────┘     │ │
│  │ 0/500자            │ │
│  │                    │ │
│  │ AI 프롬프트        │ │
│  │ [✓] 가장 힘든      │ │
│  │     감정은?        │ │
│  │ [ ] 감사한 일?     │ │
│  │                    │ │
│  │  [취소][기록→]     │ │
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │ 📅 감정 히스토리   │ │
│  │ ───────────────    │ │
│  │                    │ │
│  │ [7일 미니 달력]    │ │
│  │ 😊😐😢😊🙂😊😢    │ │
│  │                    │ │
│  │ 1/15(월) [수정]    │ │
│  │ 😊 +3 (좋음)       │ │
│  │ "오늘은 팀..."     │ │
│  │ AI: 긍정적인...    │ │
│  │                    │ │
│  │ 1/14(일) [수정]    │ │
│  │ 😐 0 (보통)        │ │
│  │ "특별한 일은..."   │ │
│  │                    │ │
│  │    [더보기 →]      │ │
│  └────────────────────┘ │
│                          │
├─────────────────────────┤
│  [홈][기록][채팅][MY]   │
└─────────────────────────┘
```

---

## Component Breakdown

### 1. **Page Header Section**
- **Icon**: 📊
- **Title**: "감정 기록"
- **Subtitle**: "오늘의 감정을 기록하고 나의 마음을 들여다보세요"
- **Styling**:
  - Title: text-2xl, font-bold, text-neutral-800
  - Subtitle: text-base, text-neutral-600, mt-2

### 2. **Emotion Input Card** (Card component)
- **Title**: "📝 오늘의 감정 기록하기"
- **Background**: bg-white, rounded-xl, shadow-sm, p-6
- **Children**:
  - Emotion Slider
  - Text Input (Textarea)
  - Prompt Selection (Checkboxes)
  - Action Buttons

### 3. **Emotion Slider** (Custom slider component)
- **Range**: -5 (매우 안좋음) to +5 (매우 좋음)
- **Visual**:
  - Track: w-full, h-2, bg-neutral-200, rounded-full
  - Filled track: bg-gradient-to-r from-primary-400 to-primary-600
  - Thumb: w-6, h-6, rounded-full, bg-primary-500, shadow-md
  - Emoji indicators: 😢 (left), 😊 (right)
- **Labels**: -5, -3, -1, 0, +1, +3, +5 below track
- **Current value display**:
  - Box: mt-4, p-3, bg-neutral-50, rounded-lg
  - Text: "현재 선택: +2 (조금 좋음)"
  - Color coding:
    - -5 to -3: text-red-600
    - -2 to -1: text-orange-500
    - 0: text-neutral-600
    - +1 to +2: text-green-500
    - +3 to +5: text-green-600

### 4. **Emotion Text Input** (Textarea component)
- **Label**: "오늘 하루를 간단히 기록해주세요 (선택)"
- **Placeholder**: "오늘은 회사에서 좋은 일이 있었어요..."
- **Max length**: 500자
- **Character counter**: "0/500자" (text-sm, text-neutral-500)
- **Styling**:
  - w-full, min-h-[120px], p-4
  - border-neutral-300, rounded-lg
  - focus:border-primary-500, focus:ring-2, focus:ring-primary-200

### 5. **AI Prompt Selection** (Checkbox group)
- **Label**: "AI 프롬프트 선택 (선택)"
- **Options**:
  1. "오늘 하루 어떤 일이 있었나요?"
  2. "지금 가장 힘든 감정은 무엇인가요?"
  3. "오늘 감사한 일이 있다면?"
  4. "내일은 어떤 하루를 보내고 싶나요?"
- **Styling**:
  - Each checkbox: flex items-center, space-x-3, p-3
  - Checkbox: w-5, h-5, text-primary-600
  - Label: text-sm, text-neutral-700
  - Hover: bg-neutral-50, rounded-lg

### 6. **Action Buttons**
- **Cancel Button** (Ghost Button):
  - Text: "취소"
  - Styling: px-6, py-3, text-neutral-700, hover:bg-neutral-100
- **Submit Button** (Primary Button):
  - Text: "기록하기 →"
  - Styling: px-6, py-3, bg-primary-500, text-white, hover:bg-primary-600
  - Icon: Arrow right (→)

### 7. **Emotion History Card** (Card component)
- **Title**: "📅 감정 기록 히스토리"
- **Background**: bg-white, rounded-xl, shadow-sm, p-6, mt-6
- **Children**:
  - Weekly Calendar View
  - History List

### 8. **Weekly Calendar View** (Custom component)
- **Layout**: Grid 7 columns (Mon-Sun)
- **Each day cell**:
  - Date label (text-xs, text-neutral-500)
  - Emoji (text-2xl) representing emotion
  - Score (text-sm, text-neutral-700, font-medium)
  - Hover: bg-neutral-50, rounded-lg, cursor-pointer
- **Current day**: border-2, border-primary-500, bg-primary-50
- **No data**: Empty cell with "—" (text-neutral-300)

### 9. **History Item** (Card component)
- **Layout**: Vertical stack, border-b, pb-4, mb-4
- **Elements**:
  - **Header row**:
    - Date: 🗓️ "2024년 1월 15일 (월)" (text-sm, font-medium)
    - Edit button: "[수정]" (text-primary-600, text-sm, hover:underline)
  - **Emotion line**:
    - Emoji + score + label: "😊 +3 (좋음)" (text-base, font-medium)
    - Color coded by emotion score
  - **User text**:
    - Truncated to 2 lines: "오늘은 팀 프로젝트가 성공적으로..."
    - text-sm, text-neutral-700, line-clamp-2
  - **AI feedback**:
    - Label: "AI 피드백:" (text-xs, text-neutral-500, font-medium)
    - Text: Truncated to 2 lines
    - text-sm, text-neutral-600, line-clamp-2
- **Hover state**: bg-neutral-50, rounded-lg, cursor-pointer

### 10. **Load More Button** (Secondary Button)
- **Text**: "더보기 →"
- **Styling**: w-full, py-3, mt-4, border-2, border-neutral-300, text-neutral-700, hover:bg-neutral-50

---

## State Variations

### 1. **Empty State** (No emotion logs yet)
```
┌────────────────────────────────────┐
│  📝 오늘의 감정 기록하기           │
│  (Emotion input form - same as above) │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  📅 감정 기록 히스토리             │
│  ────────────────────────────────  │
│                                    │
│       🌱                            │
│  아직 기록된 감정이 없어요         │
│  첫 감정을 기록해보세요!           │
│                                    │
│     [첫 기록 시작하기 →]          │
│                                    │
└────────────────────────────────────┘
```

### 2. **Loading State** (Fetching history)
- Show skeleton loaders for history items
- Emotion slider and form remain interactive

### 3. **Success State** (After submitting)
- Toast notification: "감정이 기록되었습니다 ✓"
- Form resets to default state
- New log appears at top of history list
- Smooth scroll to new entry

### 4. **Error State** (Submission failed)
- Toast notification: "기록 저장에 실패했습니다. 다시 시도해주세요."
- Form data preserved
- Retry button available

### 5. **Edit Mode** (Clicking "[수정]" on history item)
- History item expands to show full form
- Pre-filled with existing data
- Action buttons change to "[취소]" and "[수정 완료]"

---

## Interactions & Animations

### Emotion Slider
- **Drag interaction**: Smooth thumb movement with haptic feedback (mobile)
- **Click interaction**: Jump to position on track
- **Animation**:
  - Thumb scale on hover: scale-110
  - Track fill animates on value change: transition-all duration-200
  - Value display updates in real-time

### Text Input
- **Focus**: Border color change + ring effect (200ms ease-out)
- **Character counter**:
  - Normal: text-neutral-500
  - Warning (>450 chars): text-orange-500
  - Limit reached: text-red-600

### Prompt Checkboxes
- **Hover**: Background highlight (bg-neutral-50)
- **Click**: Checkbox animation (scale + checkmark draw)
- **Multiple selection**: Allow 0-2 selections max
- **Disabled**: If 2 selected, disable others (opacity-50)

### Submit Button
- **Hover**: Background darkens + subtle scale (scale-102)
- **Click**: Loading spinner replaces arrow icon
- **Disabled**: When emotion score not selected (opacity-50, cursor-not-allowed)

### Calendar View
- **Hover**: Cell background highlight + scale-105
- **Click**: Scroll to that day's detail in history list
- **Tooltip**: Show full emotion text on hover ("조금 좋음")

### History Items
- **Hover**: Background highlight (bg-neutral-50)
- **Click**: Expand to show full text (remove line-clamp)
- **Edit button hover**: Underline effect
- **Edit mode**: Smooth height transition (300ms ease-out)

### Load More Button
- **Scroll trigger**: Auto-load on scroll to bottom (infinite scroll)
- **Click**: Loading spinner + fade-in new items
- **Animation**: Skeleton loaders → Fade-in actual content

---

## API Integration

### 1. **POST /api/emotions**
**Request:**
```json
{
  "emotion_score": 2,
  "note": "오늘은 회사에서 좋은 일이 있었어요...",
  "prompt_ids": ["prompt_2"],
  "created_at": "2024-01-15T18:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "emotion_score": 2,
    "note": "오늘은 회사에서...",
    "ai_feedback": "긍정적인 성과를 이루셨네요! 이런 순간들...",
    "created_at": "2024-01-15T18:30:00Z"
  }
}
```

### 2. **GET /api/emotions?limit=10&offset=0**
**Response:**
```json
{
  "success": true,
  "data": {
    "emotions": [
      {
        "id": "uuid",
        "emotion_score": 3,
        "emotion_label": "좋음",
        "note": "오늘은 팀 프로젝트가...",
        "ai_feedback": "긍정적인 성과를...",
        "created_at": "2024-01-15T18:30:00Z"
      }
    ],
    "total": 25,
    "has_more": true
  }
}
```

### 3. **PATCH /api/emotions/{id}**
**Request:**
```json
{
  "emotion_score": 4,
  "note": "수정된 내용..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "emotion_score": 4,
    "note": "수정된 내용...",
    "updated_at": "2024-01-15T19:00:00Z"
  }
}
```

### 4. **DELETE /api/emotions/{id}**
**Response:**
```json
{
  "success": true,
  "message": "감정 기록이 삭제되었습니다."
}
```

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Slider → Text input → Prompts → Buttons → History items
- **Slider navigation**:
  - Arrow keys: Move by 1 unit
  - Shift + Arrow keys: Move by 2 units
  - Home/End: Jump to -5/+5
- **Enter key**: Submit form when focused on any input
- **Esc key**: Clear form / Exit edit mode

### Screen Reader Support
- **Slider**:
  - `aria-label="감정 점수 선택"`
  - `aria-valuemin="-5"`, `aria-valuemax="5"`, `aria-valuenow="{value}"`
  - `aria-valuetext="조금 좋음 (+2점)"`
- **Text input**: `aria-label="오늘 하루 기록"`
- **Prompts**: `role="group"`, `aria-labelledby="prompt-label"`
- **History items**: `role="article"`, `aria-label="1월 15일 감정 기록"`
- **Edit button**: `aria-label="1월 15일 기록 수정하기"`

### Visual Accessibility
- **Color coding**: Never rely on color alone
  - Emotion scores include text labels ("좋음", "보통", "안좋음")
  - Emoji provide additional visual cues
- **Contrast ratios**:
  - Text on white: ≥4.5:1 (WCAG AA)
  - Primary button: ≥4.5:1
- **Focus indicators**:
  - Visible focus ring (ring-2, ring-primary-500, ring-offset-2)
  - High contrast mode support

### Touch Targets
- **Minimum size**: 44x44px (following WCAG guidelines)
- **Slider thumb**: 48x48px touch area (visual 24x24px)
- **Checkbox targets**: 48x48px touch area (visual 20x20px)
- **Spacing**: Minimum 8px between interactive elements

---

## Responsive Behavior

### Desktop (1280px+)
- Two-column layout: Input form (left) + Weekly calendar preview (right)
- History items show 5 entries initially
- Calendar shows full 7-day week with labels

### Tablet (768px - 1023px)
- Single-column layout: Input form → Calendar → History
- History items show 3 entries initially
- Calendar shows 7-day mini version (emoji only)

### Mobile (320px - 767px)
- Compact single-column layout
- Slider simplified (fewer tick marks)
- Text input reduced height (min-h-[80px])
- Prompt checkboxes stacked vertically
- Calendar shows 7-day horizontal scroll (emoji + score)
- History items show 2 entries initially
- Bottom navigation bar appears

### Breakpoint Transitions
- Smooth layout transitions (300ms ease-out)
- No content jump or layout shift
- Images/icons scale proportionally

---

## Performance Considerations

### Initial Load
- Fetch last 10 emotion logs
- Lazy load older entries on scroll/click
- Cache emotion data in localStorage (max 50 entries)

### Optimizations
- Debounce text input (300ms) before showing character count
- Throttle slider value updates (100ms) for smooth animation
- Virtual scrolling for history list (>50 entries)
- Image lazy loading for future features (photos/attachments)

### Data Management
- **Local state**: Current form data (emotion_score, note, prompts)
- **Cache**: Recent 50 emotion logs (7-day expiry)
- **Real-time sync**: Update cache after POST/PATCH/DELETE
- **Offline support**: Queue submissions when offline, sync on reconnect

---

## Security & Privacy

### Data Validation
- **Emotion score**: Must be integer between -5 and +5
- **Note**: Max 500 characters, sanitize HTML
- **Prompt IDs**: Validate against allowed prompt list
- **Rate limiting**: Max 10 submissions per day per user

### Privacy Controls
- **Visibility**: Private by default (only user can see)
- **Deletion**: Soft delete (mark as deleted, keep in DB for 30 days)
- **Export**: Allow user to download all emotion data (JSON/CSV)
- **Anonymization**: Remove personal identifiers if user deletes account

---

## Future Enhancements

### Phase 2 Features
- 📸 Photo attachment to emotion logs
- 🎨 Custom emotion emoji/sticker packs
- 📊 Emotion trends chart (line graph showing 30-day trend)
- 🔔 Daily reminder notifications
- 🏆 Streak tracking ("7일 연속 기록 중!")
- 🔗 Share logs with trusted friends/therapists (opt-in)

### Phase 3 Features
- 🎙️ Voice note recording
- 🌦️ Weather integration (auto-detect weather on log date)
- 📅 Calendar integration (Google Calendar, Apple Calendar)
- 🔍 Search and filter history (by date, emotion, keywords)
- 📈 Advanced analytics (correlation with activities, time of day)

---

## Related Pages
- **Chat/AI Coach**: Link from AI feedback to start conversation
- **Dashboard**: Link from calendar view to full analytics
- **Profile**: Link from settings to manage reminders/notifications

---

## Design Assets Needed
- Emotion emoji set (7 variations: 😢😟😐🙂😊😄🤩)
- Slider track gradient
- Calendar date picker icon
- Loading spinner/skeleton
- Empty state illustration (🌱 seedling)
- Success/error toast icons

---

## Notes
- **Design Philosophy**: Simple, calm, non-judgmental interface that encourages honest emotional expression
- **Color Usage**: Use emotion color coding sparingly to avoid overwhelming users
- **Tone**: Supportive and warm, never clinical or cold
- **AI Feedback**: Should feel like a gentle friend, not a therapist or evaluator
- **Consistency**: Emotion score range (-5 to +5) must be consistent across all features
