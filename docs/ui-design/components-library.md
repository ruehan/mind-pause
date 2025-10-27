# 마음쉼표 컴포넌트 라이브러리

## 소개
재사용 가능한 공통 UI 컴포넌트의 명세서입니다.
Tailwind CSS + Radix UI를 기반으로 설계되었습니다.

---

## 목차
1. [Navigation](#1-navigation)
2. [Buttons](#2-buttons)
3. [Form Elements](#3-form-elements)
4. [Cards](#4-cards)
5. [Modals & Dialogs](#5-modals--dialogs)
6. [Toasts & Notifications](#6-toasts--notifications)
7. [Loading States](#7-loading-states)
8. [Data Display](#8-data-display)
9. [Feedback](#9-feedback)
10. [Utilities](#10-utilities)

---

## 1. Navigation

### 1.1 Header (데스크톱)

**위치**: 모든 페이지 상단 고정
**높이**: 64px
**배경**: White with shadow-sm

```
┌────────────────────────────────────────────────────────────┐
│ [Logo] 마음쉼표    [감정기록] [AI코치] [커뮤니티] [챌린지]  │
│                                    [알림🔔] [프로필👤]     │
└────────────────────────────────────────────────────────────┘
```

**구성 요소**:
- Logo: 좌측, 홈(/) 링크
- Navigation Links: 중앙, Primary-700 (활성), Gray-600 (비활성)
- Notification Bell: 우측, 빨간 점 표시 (읽지 않은 알림 존재 시)
- Profile Avatar: 우측 끝, 드롭다운 메뉴

**States**:
- Active Link: `text-primary-700 font-semibold border-b-2 border-primary-500`
- Hover: `text-primary-600 transition-colors duration-200`

**Responsive**:
- Desktop (xl): 전체 네비게이션 표시
- Mobile (< md): 햄버거 메뉴로 전환

---

### 1.2 Mobile Bottom Navigation

**위치**: 모바일 화면 하단 고정
**높이**: 64px
**배경**: White with shadow-lg

```
┌──────────────────────────────────────────────────────┐
│  [홈]      [감정]      [커뮤니티]      [챌린지]      [내정보] │
│  🏠       📝        💬          🎯         👤      │
└──────────────────────────────────────────────────────┘
```

**구성 요소**:
- 5개 주요 메뉴
- 아이콘 + 레이블
- 활성 상태: Primary-500 색상

**States**:
- Active: `text-primary-500`
- Inactive: `text-gray-400`
- Tap: `scale-95 transform`

---

### 1.3 Sidebar (Admin/Dashboard)

**위치**: 왼쪽 고정
**너비**: 256px (열림), 64px (접힘)
**배경**: Gray-50

```
┌─────────────────────┐
│ 마음쉼표             │
│                     │
│ 📊 대시보드          │
│ 😊 감정 기록         │
│ 💬 AI 코치          │
│ 👥 커뮤니티          │
│ 🎯 챌린지            │
│ ⚙️  설정            │
│                     │
│ [접기 ◀]            │
└─────────────────────┘
```

---

## 2. Buttons

### 2.1 Button Variants

#### Primary Button
```
┌────────────────┐
│  Primary CTA   │ ← bg-primary-500, text-white
└────────────────┘
```

**Styles**:
```css
bg-primary-500 hover:bg-primary-600
text-white font-medium
px-6 py-3 rounded-md
shadow-sm hover:shadow-md
transition-all duration-200
```

**Sizes**:
- Small: `px-4 py-2 text-sm`
- Medium: `px-6 py-3 text-base` ⭐ Default
- Large: `px-8 py-4 text-lg`

---

#### Secondary Button
```
┌────────────────┐
│  Secondary     │ ← bg-lavender-100, text-lavender-700
└────────────────┘
```

**Styles**:
```css
bg-lavender-100 hover:bg-lavender-200
text-lavender-700 font-medium
px-6 py-3 rounded-md
transition-colors duration-200
```

---

#### Ghost Button
```
┌────────────────┐
│   Ghost        │ ← transparent, text-gray-700
└────────────────┘
```

**Styles**:
```css
bg-transparent hover:bg-gray-100
text-gray-700 font-medium
px-6 py-3 rounded-md
transition-colors duration-200
```

---

#### Icon Button
```
┌───┐
│ ❤ │ ← Icon only, circular or square
└───┘
```

**Styles**:
```css
w-10 h-10 rounded-full
flex items-center justify-center
bg-transparent hover:bg-gray-100
text-gray-600 hover:text-primary-500
transition-all duration-200
```

---

### 2.2 Button States

```
Normal:   ┌────────┐
          │ Button │
          └────────┘

Hover:    ┌────────┐
          │ Button │ ← shadow-md, brightness
          └────────┘

Active:   ┌────────┐
          │ Button │ ← scale-95
          └────────┘

Disabled: ┌────────┐
          │ Button │ ← opacity-50, cursor-not-allowed
          └────────┘

Loading:  ┌────────────┐
          │ ⏳ Loading │ ← spinner + text
          └────────────┘
```

---

## 3. Form Elements

### 3.1 Text Input

```
Label ────────────────
┌───────────────────────────┐
│ Placeholder text...       │ ← Input field
└───────────────────────────┘
Helper text or error message
```

**Structure**:
```jsx
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">
    Label
  </label>
  <input
    type="text"
    placeholder="Placeholder text..."
    className="
      w-full px-4 py-2.5
      border border-gray-300 rounded-md
      focus:ring-2 focus:ring-primary-500 focus:border-primary-500
      placeholder:text-gray-400
      transition-colors duration-200
    "
  />
  <p className="text-xs text-gray-500">Helper text</p>
</div>
```

**States**:
- **Default**: `border-gray-300`
- **Focus**: `border-primary-500 ring-2 ring-primary-500`
- **Error**: `border-error-500 ring-2 ring-error-500`
- **Success**: `border-success-500`
- **Disabled**: `bg-gray-100 cursor-not-allowed opacity-60`

---

### 3.2 Textarea

```
Label ────────────────
┌───────────────────────────┐
│                           │
│ Multi-line text...        │
│                           │
│                           │
└───────────────────────────┘
```

**Props**: Same as text input, plus `rows` attribute

---

### 3.3 Select Dropdown

```
Label ────────────────
┌───────────────────────────┐
│ Select option...       ▼  │ ← Dropdown trigger
└───────────────────────────┘

(Opened state)
┌───────────────────────────┐
│ ✓ Option 1                │ ← Selected
│   Option 2                │
│   Option 3                │
└───────────────────────────┘
```

**Using Radix UI Select**:
```jsx
<Select.Root>
  <Select.Trigger className="...">
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select.Root>
```

---

### 3.4 Checkbox

```
☐ Unchecked label
☑ Checked label
☒ Indeterminate label
```

**Styles**:
```css
w-5 h-5 rounded border-2 border-gray-300
checked:bg-primary-500 checked:border-primary-500
focus:ring-2 focus:ring-primary-500
```

---

### 3.5 Radio Button

```
◯ Option A
◉ Option B (selected)
◯ Option C
```

---

### 3.6 Toggle Switch

```
OFF: ○──────  (gray-300)
ON:  ──────○  (primary-500)
```

**Using Radix UI Switch**:
```jsx
<Switch.Root className="...">
  <Switch.Thumb className="..." />
</Switch.Root>
```

---

### 3.7 Slider (감정 점수 입력)

```
Very Sad          Neutral          Very Happy
    -5  -4  -3  -2  -1  0  +1  +2  +3  +4  +5
    |═══|═══|═══|═══|●══|═══|═══|═══|═══|═══|
    🔴                  🟡                  🟢
```

**Props**:
- Min: -5
- Max: +5
- Default: 0
- Color: 점수에 따라 동적 변경

---

## 4. Cards

### 4.1 Base Card

```
┌─────────────────────────────────┐
│ Card Title                      │
│ ─────────────────────────────── │
│                                 │
│ Card content here...            │
│                                 │
└─────────────────────────────────┘
```

**Styles**:
```css
bg-white rounded-lg shadow-sm
p-6 transition-shadow duration-200
hover:shadow-md
```

---

### 4.2 Emotion Log Card

```
┌─────────────────────────────────┐
│ 2025년 1월 20일 (월)     😊 +3   │
│ ─────────────────────────────── │
│ "오늘은 기분이 좋았어요!"         │
│                                 │
│ 💬 AI 피드백: 긍정적인 하루였네요│
│ [자세히 보기]                    │
└─────────────────────────────────┘
```

**구성**:
- Header: 날짜 + 감정 점수 (색상 표시)
- Body: 사용자 텍스트
- Footer: AI 피드백 미리보기 + 액션 버튼

---

### 4.3 Community Post Card

```
┌─────────────────────────────────┐
│ 익명123 · 2시간 전         [⋯]   │
│ ─────────────────────────────── │
│ 오늘 힘든 하루였어요             │
│                                 │
│ 직장에서 상사와 갈등이...        │
│ (더보기)                        │
│                                 │
│ ❤ 15    💬 3                    │
└─────────────────────────────────┘
```

**구성**:
- Header: 작성자 (익명) + 시간 + 메뉴 버튼
- Body: 제목 + 내용 미리보기
- Footer: 좋아요 수 + 댓글 수

---

### 4.4 Challenge Card

```
┌─────────────────────────────────┐
│ 🎯 일일 챌린지                   │
│ ─────────────────────────────── │
│ 매일 10분 명상하기               │
│                                 │
│ ━━━━━━━━░░░░  60%               │
│ 3일 연속 달성 중!                │
│                                 │
│ [오늘 완료하기]                  │
└─────────────────────────────────┘
```

**구성**:
- Title: 아이콘 + 챌린지 이름
- Progress Bar: 진행률 시각화
- Status: 연속 달성 정보
- Action: 완료 버튼

---

## 5. Modals & Dialogs

### 5.1 Modal Structure

```
      [배경 오버레이 - 어두움]

    ┌─────────────────────────────┐
    │ Modal Title            [X]  │
    │ ─────────────────────────── │
    │                             │
    │ Modal content here...       │
    │                             │
    │ ─────────────────────────── │
    │        [Cancel] [Confirm]   │
    └─────────────────────────────┘
```

**Using Radix UI Dialog**:
```jsx
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 ...">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Content</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

### 5.2 Confirmation Dialog

```
┌──────────────────────────────┐
│ ⚠️  정말 삭제하시겠습니까?     │
│                              │
│ 이 작업은 되돌릴 수 없습니다. │
│                              │
│    [취소]  [삭제]            │
└──────────────────────────────┘
```

---

### 5.3 Popover (작은 컨텍스트 메뉴)

```
    [버튼]
       ↓
    ┌────────────┐
    │ 수정       │
    │ 삭제       │
    │ 공유       │
    └────────────┘
```

---

## 6. Toasts & Notifications

### 6.1 Toast (알림 메시지)

```
┌────────────────────────────────┐
│ ✓ 감정 기록이 저장되었습니다.   │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ⚠️ 네트워크 연결을 확인해주세요. │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ❌ 로그인에 실패했습니다.        │
└────────────────────────────────┘
```

**위치**: 우측 하단 또는 상단 중앙
**Duration**: 3-5초 자동 사라짐
**Types**: Success (green), Warning (yellow), Error (red), Info (blue)

---

### 6.2 Notification Badge

```
🔔 (12) ← 읽지 않은 알림 수
```

---

## 7. Loading States

### 7.1 Spinner

```
   ⏳  Loading...
```

**Sizes**:
- Small: 16px
- Medium: 24px (default)
- Large: 48px

---

### 7.2 Skeleton Loader

```
┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░            │
│ ░░░░░░░░░░░░░░░░░░░░            │
│ ░░░░░░░░░░░░░░░░                │
└─────────────────────────────────┘
```

**사용**: 카드, 리스트 아이템 로딩 시

---

### 7.3 Progress Bar

```
━━━━━━━━━━░░░░░░░░░░  50%
```

---

### 7.4 Infinite Scroll Loader

페이지 하단에 도달 시 자동 로딩

---

## 8. Data Display

### 8.1 Avatar

```
┌───┐
│ AB │ ← 이니셜 또는 이미지
└───┘
```

**Sizes**: xs (24px), sm (32px), md (40px), lg (48px), xl (64px)
**Shape**: Circle (`rounded-full`)

---

### 8.2 Badge

```
[New] [Beta] [Pro]
```

**Colors**: Primary, Success, Warning, Error, Gray

---

### 8.3 Stat Card (통계 카드)

```
┌─────────────────┐
│ 📊 Total Logs   │
│                 │
│      127        │
│                 │
│ +12 this week   │
└─────────────────┘
```

---

### 8.4 Chart (감정 변화 차트)

```
   +5 │             ╱╲
      │            ╱  ╲
    0 │──────────╱    ╲──
      │         ╱       ╲
   -5 │________╱         ╲___
      └─────────────────────────→
       Mon  Tue  Wed  Thu  Fri
```

**Library**: Recharts or Chart.js

---

## 9. Feedback

### 9.1 Empty State

```
┌─────────────────────────────────┐
│                                 │
│         📭                      │
│    아직 기록이 없습니다.         │
│                                 │
│   [첫 감정 기록하기]             │
│                                 │
└─────────────────────────────────┘
```

---

### 9.2 Error State

```
┌─────────────────────────────────┐
│         ⚠️                      │
│   문제가 발생했습니다            │
│                                 │
│   [다시 시도]                   │
└─────────────────────────────────┘
```

---

### 9.3 Success State

```
┌─────────────────────────────────┐
│         ✅                      │
│   성공적으로 저장되었습니다!     │
│                                 │
│   [확인]                        │
└─────────────────────────────────┘
```

---

## 10. Utilities

### 10.1 Divider

```
─────────────────────────────────
(thin gray line)
```

---

### 10.2 Tooltip

```
    [버튼]
      ↑
    ┌──────────┐
    │ Tooltip  │
    └──────────┘
```

**Using Radix UI Tooltip**

---

### 10.3 Accordion

```
▼ Section 1 (expanded)
  └─ Content here...

▶ Section 2 (collapsed)

▶ Section 3 (collapsed)
```

---

### 10.4 Tabs

```
[감정 기록]  [AI 대화]  [챌린지]
─────────
Content for selected tab...
```

---

## 컴포넌트 사용 우선순위

### 우선 구현 (Phase 1 - MVP)
1. Buttons (모든 variants)
2. Form Elements (Input, Textarea, Select)
3. Cards (Emotion, Community, Challenge)
4. Navigation (Header, Bottom Nav)
5. Modals & Dialogs
6. Loading States (Spinner, Skeleton)
7. Toasts

### 차후 구현 (Phase 2)
8. Charts & Data Visualization
9. Advanced Interactions (Drag & Drop)
10. Animations & Transitions
11. Complex Layouts

---

## 결론

이 컴포넌트 라이브러리는 마음쉼표 프로젝트의 **일관된 UI/UX**를 보장합니다.
모든 컴포넌트는 **디자인 시스템**의 원칙을 따르며, **Tailwind CSS + Radix UI**로 구현됩니다.

다음 단계에서는 각 페이지별 상세 디자인을 진행합니다.
