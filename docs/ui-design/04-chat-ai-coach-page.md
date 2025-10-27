# 04. Chat/AI Coach Page (AI 코치 대화 페이지)

## Page Overview
사용자가 AI 챗봇과 1:1 대화를 나누며 감정 코칭, 상담, 행동 제안을 받을 수 있는 핵심 기능 페이지입니다.

**URL**: `/chat`
**Access Level**: 회원(로그인)
**Primary Goal**: AI와의 자연스러운 대화를 통해 감정을 탐색하고 실질적인 조언을 얻기

---

## Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션, 프로필)                                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────┬────────────────────────────────────────────────┐    │
│  │  💬 대화 목록   │  🤖 AI 코치와의 대화                          │    │
│  │  ────────────   │  ──────────────────────────────────────────    │    │
│  │                 │                                                │    │
│  │  [+ 새 대화]    │  [세션 제목: "오늘의 감정 상담"]       [⋮]   │    │
│  │                 │                                                │    │
│  │  ┌───────────┐  │  ┌──────────────────────────────────────────┐ │    │
│  │  │ 🟢 진행중 │  │  │                                          │ │    │
│  │  │ 오늘의    │  │  │  [AI 메시지]                             │ │    │
│  │  │ 감정 상담 │  │  │  ┌────────────────────────────────┐     │ │    │
│  │  │ 15분 전   │  │  │  │ 🤖 안녕하세요! 오늘 하루는      │     │ │    │
│  │  └───────────┘  │  │  │    어떠셨나요?                  │     │ │    │
│  │                 │  │  │    편하게 이야기해주세요 😊    │     │ │    │
│  │  ┌───────────┐  │  │  └────────────────────────────────┘     │ │    │
│  │  │ 어제의    │  │  │  14:32                                   │ │    │
│  │  │ 고민      │  │  │                                          │ │    │
│  │  │ 1일 전    │  │  │  [사용자 메시지]                         │ │    │
│  │  └───────────┘  │  │         ┌────────────────────────────┐  │ │    │
│  │                 │  │         │ 오늘은 회사에서 실수를...  │  │ │    │
│  │  ┌───────────┐  │  │         │ 계속 마음에 걸려요 😢     │  │ │    │
│  │  │ 불안감    │  │  │         └────────────────────────────┘  │ │    │
│  │  │ 대화      │  │  │                                    14:33 │ │    │
│  │  │ 3일 전    │  │  │                                          │ │    │
│  │  └───────────┘  │  │  [AI 메시지 + 행동 제안]                 │ │    │
│  │                 │  │  ┌────────────────────────────────┐     │ │    │
│  │  ┌───────────┐  │  │  │ 🤖 실수는 누구나 하는 것이에요  │     │ │    │
│  │  │ 스트레스  │  │  │  │    자책하기보다는...           │     │ │    │
│  │  │ 관리      │  │  │  └────────────────────────────────┘     │ │    │
│  │  │ 1주 전    │  │  │  14:33                                   │ │    │
│  │  └───────────┘  │  │  ┌────────────────────────────────┐     │ │    │
│  │                 │  │  │ 💡 제안: 호흡 명상 5분          │     │ │    │
│  │                 │  │  │ [지금 시작하기 →]              │     │ │    │
│  │                 │  │  └────────────────────────────────┘     │ │    │
│  │                 │  │                                          │ │    │
│  │                 │  │                                          │ │    │
│  │                 │  │  (Scroll for more messages...)           │ │    │
│  │                 │  │                                          │ │    │
│  │                 │  └──────────────────────────────────────────┘ │    │
│  │                 │                                                │    │
│  │                 │  ┌──────────────────────────────────────────┐ │    │
│  │                 │  │  ┌────┐                                   │ │    │
│  │                 │  │  │ 📎 │ [메시지를 입력하세요...]  [전송]│ │    │
│  │                 │  │  └────┘                                   │ │    │
│  │                 │  └──────────────────────────────────────────┘ │    │
│  │                 │                                                │    │
│  │                 │  💡 추천 질문:                                 │    │
│  │                 │  • "오늘 스트레스 관리 방법 알려줘"            │    │
│  │                 │  • "불안할 때 어떻게 해야 할까?"               │    │
│  └─────────────────┴────────────────────────────────────────────────┘    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Tablet Layout (768px - 1023px)

```
┌─────────────────────────────────────────────────┐
│  Header                                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  [☰ 대화목록]  🤖 AI 코치와의 대화    [⋮]      │
│  ──────────────────────────────────────────      │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │                                          │   │
│  │  [AI 메시지]                             │   │
│  │  ┌────────────────────────────────┐     │   │
│  │  │ 🤖 안녕하세요! 오늘 하루는      │     │   │
│  │  │    어떠셨나요?                  │     │   │
│  │  │    편하게 이야기해주세요 😊    │     │   │
│  │  └────────────────────────────────┘     │   │
│  │  14:32                                   │   │
│  │                                          │   │
│  │  [사용자 메시지]                         │   │
│  │         ┌────────────────────────────┐  │   │
│  │         │ 오늘은 회사에서 실수를...  │  │   │
│  │         │ 계속 마음에 걸려요 😢     │  │   │
│  │         └────────────────────────────┘  │   │
│  │                                    14:33 │   │
│  │                                          │   │
│  │  [AI 메시지 + 행동 제안]                 │   │
│  │  ┌────────────────────────────────┐     │   │
│  │  │ 🤖 실수는 누구나 하는 것이에요  │     │   │
│  │  │    자책하기보다는...           │     │   │
│  │  └────────────────────────────────┘     │   │
│  │  ┌────────────────────────────────┐     │   │
│  │  │ 💡 제안: 호흡 명상 5분          │     │   │
│  │  │ [지금 시작하기 →]              │     │   │
│  │  └────────────────────────────────┘     │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  [📎] [메시지 입력...]         [전송]   │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  💡 추천 질문:                                   │
│  • "오늘 스트레스 관리 방법 알려줘"              │
│  • "불안할 때 어떻게 해야 할까?"                 │
│                                                  │
└──────────────────────────────────────────────────┘

[대화 목록 Drawer - Opens from left on [☰] click]
┌─────────────────┐
│ 💬 대화 목록    │
│ ─────────────   │
│                 │
│ [+ 새 대화]     │
│                 │
│ 🟢 오늘의 감정  │
│    상담         │
│    15분 전      │
│                 │
│ 어제의 고민     │
│ 1일 전          │
│                 │
│ 불안감 대화     │
│ 3일 전          │
│                 │
└─────────────────┘
```

---

## Mobile Layout (320px - 767px)

```
┌──────────────────────────┐
│  [☰] AI 코치     [⋮]    │
├──────────────────────────┤
│                           │
│  ┌──────────────────────┐│
│  │                      ││
│  │ [AI 메시지]          ││
│  │ ┌──────────────┐    ││
│  │ │🤖 안녕하세요! │    ││
│  │ │  오늘 하루는  │    ││
│  │ │  어떠셨나요?  │    ││
│  │ │  편하게 말씀  │    ││
│  │ │  해주세요😊   │    ││
│  │ └──────────────┘    ││
│  │ 14:32               ││
│  │                      ││
│  │ [사용자 메시지]      ││
│  │    ┌──────────────┐ ││
│  │    │오늘은 회사에 │ ││
│  │    │서 실수를...  │ ││
│  │    │계속 마음에   │ ││
│  │    │걸려요 😢    │ ││
│  │    └──────────────┘ ││
│  │              14:33  ││
│  │                      ││
│  │ [AI 메시지]          ││
│  │ ┌──────────────┐    ││
│  │ │🤖 실수는      │    ││
│  │ │  누구나 하는  │    ││
│  │ │  것이에요...  │    ││
│  │ └──────────────┘    ││
│  │ ┌──────────────┐    ││
│  │ │💡 제안:       │    ││
│  │ │  호흡 명상 5분│    ││
│  │ │[시작하기 →]   │    ││
│  │ └──────────────┘    ││
│  │                      ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │[📎][입력...][전송]  ││
│  └──────────────────────┘│
│                           │
│  💡 추천:                 │
│  • "스트레스 관리법?"     │
│  • "불안할 때 어떻게?"    │
│                           │
├──────────────────────────┤
│ [홈][기록][채팅][MY]     │
└──────────────────────────┘
```

---

## Component Breakdown

### 1. **Conversation List Sidebar** (Desktop only, Drawer on tablet/mobile)
- **Header**:
  - Title: "💬 대화 목록"
  - New chat button: "[+ 새 대화]"
- **Styling**:
  - Width: 320px (desktop), full-width (mobile drawer)
  - Background: bg-neutral-50
  - Border-right: border-r border-neutral-200
- **List items**: Conversation preview cards

### 2. **Conversation Preview Card** (Sidebar item)
- **Layout**:
  - Status indicator: 🟢 (active/진행중) or ⚪ (closed)
  - Title: Truncated to 2 lines
  - Timestamp: Relative time ("15분 전", "1일 전")
- **Styling**:
  - Padding: p-4
  - Border-radius: rounded-lg
  - Active state: bg-primary-50, border-l-4 border-primary-500
  - Hover: bg-white, shadow-sm
  - Text: text-sm, font-medium, text-neutral-800
  - Timestamp: text-xs, text-neutral-500

### 3. **Chat Header**
- **Left section**: "🤖 AI 코치와의 대화"
- **Center section**: Session title (editable on click)
- **Right section**: Menu button ([⋮]) for options
- **Styling**:
  - Height: 64px, px-6, py-4
  - Border-bottom: border-b border-neutral-200
  - Background: bg-white

### 4. **Menu Options Dropdown** (From [⋮])
- **Options**:
  - "세션 제목 수정"
  - "대화 요약 보기"
  - "대화 기록 저장"
  - "대화 삭제" (text-red-600)
- **Styling**:
  - Position: absolute, right-4, top-16
  - Background: bg-white, shadow-lg, rounded-lg
  - Each item: p-3, hover:bg-neutral-50

### 5. **Message Container** (Chat area)
- **Layout**: Vertical scroll, flex-col, space-y-4
- **Padding**: p-6
- **Background**: bg-neutral-50
- **Height**: Flexible (calc(100vh - header - input))
- **Scroll behavior**: Auto-scroll to bottom on new message

### 6. **AI Message Bubble** (Left-aligned)
- **Icon**: 🤖 Avatar (32x32px, rounded-full, bg-primary-100)
- **Bubble**:
  - Background: bg-white
  - Border: border border-neutral-200
  - Border-radius: rounded-2xl (top-left: rounded-sm)
  - Padding: p-4
  - Max-width: 70% (desktop), 85% (mobile)
  - Shadow: shadow-sm
- **Text**:
  - Font: text-base, text-neutral-800, leading-relaxed
  - Line-height: 1.6
  - Markdown support: **bold**, *italic*, `code`, links
- **Timestamp**:
  - text-xs, text-neutral-500, mt-1
  - Position: Below bubble, left-aligned

### 7. **User Message Bubble** (Right-aligned)
- **Layout**: flex justify-end
- **Bubble**:
  - Background: bg-primary-500
  - Text color: text-white
  - Border-radius: rounded-2xl (top-right: rounded-sm)
  - Padding: p-4
  - Max-width: 70% (desktop), 85% (mobile)
  - Shadow: shadow-sm
- **Timestamp**:
  - text-xs, text-primary-200, mt-1
  - Position: Below bubble, right-aligned

### 8. **Action Suggestion Card** (From AI)
- **Layout**: Separate card below AI message
- **Icon**: 💡
- **Title**: "제안: {action_title}"
- **Button**: Primary button "[지금 시작하기 →]"
- **Styling**:
  - Background: bg-gradient-to-r from-primary-50 to-lavender-50
  - Border: border-2 border-primary-200
  - Border-radius: rounded-xl
  - Padding: p-4
  - Max-width: 70%
  - Hover: shadow-md, scale-102

### 9. **Typing Indicator** (When AI is responding)
- **Layout**: Same as AI message bubble
- **Animation**: Three dots bouncing
- **Styling**:
  - Background: bg-white
  - Dots: w-2, h-2, rounded-full, bg-neutral-400
  - Animation: bounce, 0.6s infinite, staggered delay

### 10. **Message Input Area**
- **Layout**: Fixed at bottom, flex items-center, space-x-3
- **Background**: bg-white
- **Border-top**: border-t border-neutral-200
- **Padding**: p-4
- **Children**:
  - Attachment button
  - Text input
  - Send button

### 11. **Attachment Button** (📎)
- **Icon**: 📎 (text-xl)
- **Functionality**: Click to upload files (images, PDFs - future feature)
- **Styling**:
  - w-10, h-10, rounded-lg
  - bg-neutral-100, hover:bg-neutral-200
  - text-neutral-600

### 12. **Text Input Field**
- **Placeholder**: "메시지를 입력하세요..."
- **Type**: Textarea with auto-expand (max 5 lines)
- **Styling**:
  - flex-1, p-3
  - border-neutral-300, rounded-xl
  - focus:border-primary-500, focus:ring-2, focus:ring-primary-200
  - resize-none
- **Max length**: 2000 characters
- **Enter key**: Send message (Shift+Enter for new line)

### 13. **Send Button**
- **Text**: "전송" or Arrow icon (→)
- **Styling**:
  - w-10, h-10, rounded-lg
  - bg-primary-500, text-white
  - hover:bg-primary-600
  - disabled: opacity-50 (when input empty)
  - Active (sending): Loading spinner

### 14. **Suggested Questions Section**
- **Title**: "💡 추천 질문:"
- **Layout**: Horizontal scroll (mobile), 2-column grid (desktop)
- **Items**: Clickable question chips
- **Styling**:
  - Background: bg-white, rounded-xl, p-4, mt-4
  - Each chip: px-4, py-2, border, rounded-full, text-sm
  - Hover: bg-primary-50, border-primary-500, text-primary-700

### 15. **Question Chip** (Clickable suggestion)
- **Text**: "오늘 스트레스 관리 방법 알려줘"
- **Icon**: Bullet point (•)
- **Action**: Click to populate input field
- **Styling**:
  - display: inline-block, mr-2, mb-2
  - px-4, py-2, border-2, border-neutral-200, rounded-full
  - text-sm, text-neutral-700
  - hover: bg-primary-50, border-primary-500, cursor-pointer

---

## State Variations

### 1. **Empty State** (No conversations yet)
```
┌────────────────────────────────────────┐
│  💬 대화 목록                          │
│  ────────────────────                  │
│                                        │
│  [+ 새 대화]                           │
│                                        │
│       🌱                                │
│  아직 대화가 없어요                    │
│  AI 코치와 첫 대화를 시작해보세요!     │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  🤖 AI 코치와의 대화                   │
│  ──────────────────────────────────    │
│                                        │
│           🤖                           │
│  안녕하세요! 저는 마음쉼표의           │
│  AI 코치입니다.                        │
│  편하게 오늘의 감정이나 고민을         │
│  이야기해주세요 😊                     │
│                                        │
│  💡 이렇게 시작해보세요:               │
│  • "오늘 기분이 안 좋아"               │
│  • "스트레스 받는 일이 있어"           │
│  • "불안한 마음을 어떻게 다스려야 해?" │
│                                        │
└────────────────────────────────────────┘
```

### 2. **Loading State** (Fetching conversations)
- Show skeleton loaders in sidebar (3-4 conversation cards)
- Chat area shows empty state message

### 3. **AI Typing State**
- Show typing indicator bubble
- Disable send button
- Input remains editable (can queue messages)

### 4. **Message Sending State**
- User message appears immediately (optimistic UI)
- Show sending indicator (spinner icon) next to timestamp
- If failed, show retry icon and error toast

### 5. **Error State** (AI response failed)
- Show error message in chat:
  ```
  ⚠️ 응답을 받는 중 오류가 발생했습니다.
  [다시 시도] [고객센터 문의]
  ```
- Previous messages remain intact
- User can retry or continue conversation

### 6. **Conversation Closed State**
- Show banner at top: "이 대화는 종료되었습니다. [새 대화 시작]"
- Input area disabled
- Messages remain viewable (read-only)

---

## Interactions & Animations

### Message Sending
- **User types**: Input auto-expands (max 5 lines)
- **Clicks send**:
  - Message bubble fades in from bottom (200ms)
  - Auto-scroll to bottom (smooth scroll, 300ms)
  - Input clears immediately
  - Send button briefly shows checkmark (✓)

### AI Response
- **Typing indicator appears**: Fade in (200ms)
- **Message arrives**:
  - Typing indicator fades out
  - AI message fades in with slight slide-up effect (300ms)
  - If includes action card, card fades in with 100ms delay
- **Text animation**: Typewriter effect (optional, 30ms/char)

### Conversation Selection
- **Click sidebar item**:
  - Active state applies (border, background)
  - Chat area fades out (150ms)
  - New conversation messages fade in (200ms)
  - Scroll to bottom

### Suggested Question Click
- **Click chip**:
  - Chip scales down briefly (scale-95, 100ms)
  - Text populates input field with typing animation
  - Input focuses automatically
  - Chip highlight briefly (border-primary-500, 200ms)

### Attachment Button (Future)
- **Click**: File picker opens
- **File selected**: Preview thumbnail appears in input area
- **Remove**: X button on thumbnail

### Menu Dropdown
- **Click [⋮]**: Dropdown slides down (200ms ease-out)
- **Click outside**: Dropdown fades out and slides up (150ms)
- **Hover item**: Background highlight (bg-neutral-50)

### Scroll Behavior
- **New message**: Auto-scroll to bottom (smooth)
- **User scrolls up**: Disable auto-scroll until manually scrolled to bottom
- **Scroll-to-bottom button**: Appears when scrolled >200px from bottom

---

## API Integration

### 1. **GET /api/chat/conversations**
**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "session_id": "session_123",
        "title": "오늘의 감정 상담",
        "status": "active",
        "last_message": "실수는 누구나 하는 것이에요...",
        "last_message_at": "2024-01-15T14:33:00Z",
        "created_at": "2024-01-15T14:30:00Z"
      }
    ],
    "total": 15,
    "has_more": false
  }
}
```

### 2. **POST /api/chat/conversations**
**Request:**
```json
{
  "title": "새로운 대화"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "session_id": "session_456",
    "title": "새로운 대화",
    "status": "active",
    "created_at": "2024-01-15T15:00:00Z"
  }
}
```

### 3. **GET /api/chat/conversations/{id}/messages?limit=50&offset=0**
**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "role": "assistant",
        "content": "안녕하세요! 오늘 하루는 어떠셨나요?",
        "metadata": {
          "emotion_detected": "neutral",
          "suggestions": []
        },
        "created_at": "2024-01-15T14:32:00Z"
      },
      {
        "id": "uuid",
        "role": "user",
        "content": "오늘은 회사에서 실수를 해서 계속 마음에 걸려요",
        "created_at": "2024-01-15T14:33:00Z"
      },
      {
        "id": "uuid",
        "role": "assistant",
        "content": "실수는 누구나 하는 것이에요. 자책하기보다는...",
        "metadata": {
          "emotion_detected": "stress",
          "suggestions": [
            {
              "title": "호흡 명상 5분",
              "action_type": "meditation",
              "action_id": "meditation_001"
            }
          ]
        },
        "created_at": "2024-01-15T14:33:30Z"
      }
    ],
    "total": 25,
    "has_more": true
  }
}
```

### 4. **POST /api/chat/conversations/{id}/messages**
**Request:**
```json
{
  "content": "오늘은 회사에서 실수를 해서 계속 마음에 걸려요",
  "metadata": {
    "emotion_score": -2,
    "context_from_emotion_log": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_message": {
      "id": "uuid",
      "role": "user",
      "content": "오늘은 회사에서 실수를...",
      "created_at": "2024-01-15T14:33:00Z"
    },
    "ai_response": {
      "id": "uuid",
      "role": "assistant",
      "content": "실수는 누구나 하는 것이에요...",
      "metadata": {
        "emotion_detected": "stress",
        "suggestions": [...]
      },
      "created_at": "2024-01-15T14:33:30Z"
    }
  }
}
```

### 5. **PATCH /api/chat/conversations/{id}**
**Request:**
```json
{
  "title": "스트레스 관리 상담",
  "status": "closed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "스트레스 관리 상담",
    "status": "closed",
    "updated_at": "2024-01-15T15:00:00Z"
  }
}
```

### 6. **DELETE /api/chat/conversations/{id}**
**Response:**
```json
{
  "success": true,
  "message": "대화가 삭제되었습니다."
}
```

### 7. **GET /api/chat/suggested-questions?context={emotion_log|general}**
**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      "오늘 스트레스 관리 방법 알려줘",
      "불안할 때 어떻게 해야 할까?",
      "감정을 표현하는 건강한 방법은?",
      "마음을 편하게 하는 활동은?"
    ]
  }
}
```

---

## Real-time Features (Future Enhancement)

### WebSocket Connection
- **Endpoint**: `wss://api.mindpause.com/chat`
- **Use case**: Real-time streaming AI responses (typewriter effect)
- **Events**:
  - `message.start`: AI starts responding
  - `message.chunk`: Partial message content
  - `message.complete`: AI finishes responding
  - `typing`: User typing indicator (for multi-user sessions)

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Sidebar → New chat button → Chat header menu → Message input → Send button → Suggested questions
- **Shortcuts**:
  - `Ctrl/Cmd + N`: New conversation
  - `Ctrl/Cmd + K`: Focus search (future feature)
  - `Enter`: Send message
  - `Shift + Enter`: New line
  - `Esc`: Close dropdown menus
  - `↑/↓`: Navigate conversation list

### Screen Reader Support
- **Chat area**: `role="log"`, `aria-live="polite"`, `aria-atomic="false"`
- **Messages**: `role="article"`, `aria-label="AI 메시지, 14시 32분"`
- **Input**: `aria-label="메시지 입력"`, `aria-placeholder="메시지를 입력하세요"`
- **Send button**: `aria-label="메시지 전송"`, disabled state announced
- **Typing indicator**: `aria-label="AI가 입력 중입니다"`, `aria-live="polite"`
- **Suggested questions**: `role="button"`, `aria-label="추천 질문: {text}"`

### Visual Accessibility
- **Message contrast**:
  - AI messages (white bg): Text contrast ≥4.5:1
  - User messages (primary bg): White text contrast ≥4.5:1
- **Timestamps**: Sufficient contrast (≥3:1 for secondary text)
- **Focus indicators**:
  - Visible focus ring on all interactive elements
  - ring-2, ring-primary-500, ring-offset-2
- **Color coding**:
  - Never rely on color alone
  - Use icons (🤖 for AI, user avatar for user)
  - Status indicators include text labels

### Touch Targets
- **Minimum size**: 44x44px
- **Message bubbles**: Full bubble clickable (future: long-press menu)
- **Buttons**: 44x44px minimum (send, attachment, menu)
- **Suggested questions**: 44px height, adequate spacing (8px)

---

## Responsive Behavior

### Desktop (1280px+)
- Two-column layout: Sidebar (320px) + Chat (flex-1)
- Message bubbles max-width: 70%
- Suggested questions: 2-column grid
- Show full timestamps ("오늘 14:32")

### Tablet (768px - 1023px)
- Sidebar as drawer (slides from left)
- Chat area full-width
- Message bubbles max-width: 75%
- Suggested questions: Horizontal scroll
- Timestamps: Relative ("15분 전")

### Mobile (320px - 767px)
- Full-screen chat interface
- Sidebar as drawer (slides from left)
- Message bubbles max-width: 85%
- Compact input area
- Suggested questions: Horizontal scroll (1-line chips)
- Timestamps: Ultra-compact ("14:32")
- Bottom navigation bar (fixed)

### Breakpoint Transitions
- Sidebar drawer animation: 300ms ease-out
- Layout shifts: 200ms ease-out
- No content jump or reflow

---

## Performance Considerations

### Initial Load
- Fetch conversation list (limit: 20)
- Lazy load older conversations on scroll
- Cache active conversation messages (last 100)

### Message Rendering
- Virtual scrolling for conversations >100 messages
- Lazy load message history (pagination: 50 per page)
- Render only visible messages + 10 above/below viewport

### Optimizations
- Debounce typing indicator (500ms)
- Throttle scroll events (100ms)
- WebSocket connection pooling
- Message content compression (gzip)
- Image lazy loading for future attachments

### Data Management
- **Local state**: Current conversation, messages, input text
- **Cache**: Conversation list (15 min expiry), recent messages (30 min)
- **Real-time sync**: WebSocket for active conversation
- **Offline support**: Queue messages when offline, sync on reconnect

---

## Security & Privacy

### Data Validation
- **Message content**: Max 2000 characters, sanitize HTML, block scripts
- **Conversation title**: Max 100 characters, trim whitespace
- **Rate limiting**: Max 20 messages per minute per user
- **Spam detection**: Flag repetitive/abusive messages

### Privacy Controls
- **Data retention**: Messages stored for 90 days, then auto-deleted
- **Encryption**: End-to-end encryption for messages (future)
- **Export**: Download conversation history (JSON/PDF)
- **Deletion**: Permanent delete with confirmation ("Are you sure?")
- **Anonymization**: Remove personal identifiers after account deletion

### AI Safety
- **Content filtering**: Block harmful/abusive content
- **Crisis detection**: Identify self-harm language, provide helpline resources
- **Escalation**: Recommend professional help for severe cases
- **Disclaimer**: "AI는 전문 상담을 대체할 수 없습니다"

---

## Error Handling

### Common Errors
- **Network error**: "인터넷 연결을 확인해주세요"
- **AI timeout**: "응답이 지연되고 있습니다. 잠시만 기다려주세요"
- **AI error**: "응답을 받는 중 오류가 발생했습니다. [다시 시도]"
- **Message send failed**: Show retry icon, allow resend
- **Conversation load failed**: Show reload button

### Fallback Strategies
- **Offline mode**: Show offline banner, queue messages
- **AI unavailable**: Suggest alternative actions (emotion log, community)
- **Conversation not found**: Redirect to conversation list
- **Attachment upload failed**: Show error, allow retry (future)

---

## Future Enhancements

### Phase 2 Features
- 📎 File attachments (images, PDFs)
- 🎙️ Voice message input (speech-to-text)
- 🔍 Search within conversations
- 📊 Conversation insights (emotion trends from chat)
- 🏷️ Tag and categorize conversations
- 💾 Export conversation as PDF/TXT
- 🔗 Share conversation snippet (anonymous)

### Phase 3 Features
- 🤝 Multi-user sessions (with therapist/friend)
- 🎨 Custom AI personality selection
- 📅 Scheduled check-ins (AI initiates conversation)
- 🧠 Memory across conversations (AI remembers context)
- 🌐 Multi-language support
- 🎯 Goal tracking within conversations
- 📈 Advanced analytics (word clouds, sentiment over time)

---

## Related Pages
- **Emotion Log**: Link to emotion log from AI suggestions
- **Community**: AI can suggest posting in community
- **Dashboard**: View chat insights in analytics
- **Challenge**: AI proposes challenges based on conversation

---

## Design Assets Needed
- AI avatar icon (🤖 or custom illustration)
- User avatar (default profile icon)
- Typing indicator animation (3 bouncing dots)
- Empty state illustration (🌱 or friendly character)
- Loading spinner for message sending
- Success/error toast icons
- Attachment icon (📎)
- Menu icons (edit, delete, save, etc.)

---

## Notes
- **Tone**: Warm, empathetic, non-judgmental AI personality
- **Response time**: Target <3 seconds for AI responses
- **Context awareness**: AI should reference previous messages and emotion logs
- **Privacy**: Clearly communicate that conversations are private and confidential
- **Crisis support**: Always provide helpline information when detecting distress
- **Accessibility**: Prioritize screen reader support for visually impaired users
- **Mobile-first**: Optimize for thumb-friendly interactions
