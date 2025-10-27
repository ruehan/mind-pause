# 05. Community Page (커뮤니티 페이지)

## Page Overview
사용자가 고민/공감 글을 작성하고, 댓글·공감·공유를 통해 서로 지지하고 연대감을 형성하는 커뮤니티 페이지입니다.

**URL**: `/community`
**Access Level**: 회원(로그인, 익명권장)
**Primary Goal**: 안전하고 따뜻한 공간에서 감정을 나누고 공감과 위로를 주고받기

---

## Desktop Layout (1280px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header (로고, 네비게이션, 프로필)                                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  💬 커뮤니티                                          [✏️ 글쓰기]│    │
│  │  함께 나누고 공감하는 따뜻한 공간                                 │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  [🔥 인기] [📝 최신] [💝 공감많은] [💬 댓글많은]     [🔍 검색]   │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  ┌────────────────────────────────────────────────────────────┐ │     │
│  │  │  👤 익명123          🔒 익명        3시간 전          [⋮]  │ │     │
│  │  │  ────────────────────────────────────────────────────────  │ │     │
│  │  │                                                            │ │     │
│  │  │  오늘 회사에서 실수를 해서 너무 자책하고 있어요           │ │     │
│  │  │                                                            │ │     │
│  │  │  팀 프로젝트에서 중요한 데이터를 잘못 보내서 팀장님께    │ │     │
│  │  │  지적을 받았어요. 다들 바쁜데 제 실수 때문에 일이       │ │     │
│  │  │  늦어졌고... 너무 미안하고 스스로가 한심하게 느껴져요.   │ │     │
│  │  │  이런 실수를 계속 반복하는 제가 싫어요 😢               │ │     │
│  │  │                                                            │ │     │
│  │  │  #직장스트레스 #자책 #실수                                │ │     │
│  │  │                                                            │ │     │
│  │  │  ❤️ 125   💬 18   🔗 공유                               │ │     │
│  │  └────────────────────────────────────────────────────────────┘ │     │
│  │                                                                 │     │
│  │  ┌────────────────────────────────────────────────────────────┐ │     │
│  │  │  👤 마음쉼          🌐 공개        1일 전            [⋮]  │ │     │
│  │  │  ────────────────────────────────────────────────────────  │ │     │
│  │  │                                                            │ │     │
│  │  │  불안감이 심할 때 도움이 된 방법들 공유해요 💙            │ │     │
│  │  │                                                            │ │     │
│  │  │  1. 깊게 숨쉬기 (4-7-8 호흡법)                            │ │     │
│  │  │  2. 발바닥에 집중하며 천천히 걷기                         │ │     │
│  │  │  3. 좋아하는 음악 듣기                                    │ │     │
│  │  │  4. 따뜻한 차 마시며 5분 멍때리기                         │ │     │
│  │  │                                                            │ │     │
│  │  │  다들 어떤 방법 쓰시나요?                                 │ │     │
│  │  │                                                            │ │     │
│  │  │  #불안 #대처방법 #공유                                    │ │     │
│  │  │                                                            │ │     │
│  │  │  ❤️ 342   💬 67   🔗 공유                               │ │     │
│  │  └────────────────────────────────────────────────────────────┘ │     │
│  │                                                                 │     │
│  │  ┌────────────────────────────────────────────────────────────┐ │     │
│  │  │  👤 희망이          🌐 공개        2일 전            [⋮]  │ │     │
│  │  │  ────────────────────────────────────────────────────────  │ │     │
│  │  │                                                            │ │     │
│  │  │  요즘 아무것도 하기 싫고 무기력해요                       │ │     │
│  │  │                                                            │ │     │
│  │  │  일어나는 것부터 힘들고, 밥도 제대로 못 먹고 있어요.      │ │     │
│  │  │  친구들 만나는 것도 귀찮고... 이렇게 사는 게 맞나        │ │     │
│  │  │  싶어요. 혹시 비슷한 경험 있으신 분 계신가요?            │ │     │
│  │  │                                                            │ │     │
│  │  │  #무기력 #우울 #조언구함                                  │ │     │
│  │  │                                                            │ │     │
│  │  │  ❤️ 89    💬 23   🔗 공유                               │ │     │
│  │  └────────────────────────────────────────────────────────────┘ │     │
│  │                                                                 │     │
│  │                          [더보기 →]                             │     │
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
│  💬 커뮤니티                      [✏️ 글쓰기]│
│  함께 나누고 공감하는 따뜻한 공간            │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  [🔥][📝][💝][💬]    [🔍 검색]      │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  👤 익명123  🔒  3h    [⋮]           │    │
│  │  ──────────────────────────────────  │    │
│  │                                      │    │
│  │  오늘 회사에서 실수를 해서           │    │
│  │  너무 자책하고 있어요                │    │
│  │                                      │    │
│  │  팀 프로젝트에서 중요한 데이터를...  │    │
│  │  (2줄 말줄임)                        │    │
│  │                                      │    │
│  │  #직장스트레스 #자책                 │    │
│  │                                      │    │
│  │  ❤️ 125  💬 18  🔗 공유             │    │
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  👤 마음쉼  🌐  1d     [⋮]           │    │
│  │  ──────────────────────────────────  │    │
│  │                                      │    │
│  │  불안감이 심할 때 도움이 된          │    │
│  │  방법들 공유해요 💙                  │    │
│  │                                      │    │
│  │  1. 깊게 숨쉬기 (4-7-8 호흡법)       │    │
│  │  2. 발바닥에 집중하며...             │    │
│  │  (2줄 말줄임)                        │    │
│  │                                      │    │
│  │  #불안 #대처방법                     │    │
│  │                                      │    │
│  │  ❤️ 342  💬 67  🔗 공유             │    │
│  └──────────────────────────────────────┘    │
│                                               │
│               [더보기 →]                      │
│                                               │
└───────────────────────────────────────────────┘
```

---

## Mobile Layout (320px - 767px)

```
┌──────────────────────────┐
│  [☰] 커뮤니티   [✏️]    │
├──────────────────────────┤
│                           │
│  [🔥][📝][💝][💬][🔍]   │
│                           │
│  ┌──────────────────────┐│
│  │ 👤익명 🔒 3h  [⋮]   ││
│  │ ─────────────────    ││
│  │                      ││
│  │ 오늘 회사에서        ││
│  │ 실수를 해서...       ││
│  │                      ││
│  │ 팀 프로젝트에서...   ││
│  │ (2줄 말줄임)         ││
│  │                      ││
│  │ #직장 #자책          ││
│  │                      ││
│  │ ❤️125 💬18 🔗      ││
│  └──────────────────────┘│
│                           │
│  ┌──────────────────────┐│
│  │ 👤마음쉼 🌐 1d [⋮]   ││
│  │ ─────────────────    ││
│  │                      ││
│  │ 불안감이 심할 때     ││
│  │ 도움이 된 방법들...  ││
│  │                      ││
│  │ 1. 깊게 숨쉬기...    ││
│  │ (2줄 말줄임)         ││
│  │                      ││
│  │ #불안 #대처방법      ││
│  │                      ││
│  │ ❤️342 💬67 🔗      ││
│  └──────────────────────┘│
│                           │
│        [더보기 →]         │
│                           │
├──────────────────────────┤
│  [홈][기록][채팅][MY]    │
└──────────────────────────┘
```

---

## Component Breakdown

### 1. **Page Header Section**
- **Icon**: 💬
- **Title**: "커뮤니티"
- **Subtitle**: "함께 나누고 공감하는 따뜻한 공간"
- **Action button**: "[✏️ 글쓰기]" (Primary button, top-right)
- **Styling**:
  - Title: text-2xl, font-bold, text-neutral-800
  - Subtitle: text-base, text-neutral-600, mt-2
  - Write button: bg-primary-500, text-white, px-6, py-3, rounded-lg

### 2. **Filter/Sort Tabs**
- **Layout**: Horizontal tabs with active indicator
- **Options**:
  - 🔥 **인기** (Popular): Top posts by engagement (likes + comments)
  - 📝 **최신** (Latest): Newest posts first
  - 💝 **공감많은** (Most liked): Sorted by like count
  - 💬 **댓글많은** (Most discussed): Sorted by comment count
- **Search button**: 🔍 (right-aligned)
- **Styling**:
  - Container: bg-white, rounded-lg, shadow-sm, p-4, mb-6
  - Each tab: px-4, py-2, rounded-lg, text-sm, font-medium
  - Active tab: bg-primary-500, text-white
  - Inactive tab: text-neutral-700, hover:bg-neutral-100
  - Search icon: w-10, h-10, rounded-lg, bg-neutral-100, hover:bg-neutral-200

### 3. **Post Card** (Community post component)
- **Background**: bg-white, rounded-xl, shadow-sm, p-6, mb-4
- **Border**: border border-neutral-200
- **Hover**: shadow-md, transition-all duration-200
- **Cursor**: pointer (entire card clickable)

### 4. **Post Header** (Author info)
- **Layout**: flex items-center justify-between
- **Left section**:
  - **Avatar**: 👤 (32x32px, rounded-full, bg-neutral-200)
  - **Username**: "익명123" or "마음쉼" (text-sm, font-medium, text-neutral-800)
  - **Privacy icon**:
    - 🔒 (익명 - Anonymous) - text-neutral-500
    - 🌐 (공개 - Public) - text-primary-500
  - **Timestamp**: "3시간 전" (text-xs, text-neutral-500)
- **Right section**:
  - **Menu button**: [⋮] (w-8, h-8, rounded, hover:bg-neutral-100)

### 5. **Post Content**
- **Title** (optional): text-lg, font-semibold, text-neutral-900, mb-2
- **Body text**:
  - Desktop: Show full content or max 4 lines with "[더보기]"
  - Mobile/Tablet: Max 2-3 lines with "..." truncation
  - text-base, text-neutral-700, leading-relaxed, line-height-1.6
- **Markdown support**: **bold**, *italic*, lists, links
- **Line clamp**: line-clamp-4 (desktop), line-clamp-2 (mobile)
- **Read more**: "더보기" link (text-primary-600, text-sm, hover:underline)

### 6. **Post Tags** (Hashtags)
- **Layout**: flex flex-wrap gap-2, mt-3
- **Each tag**:
  - "#직장스트레스" format
  - px-3, py-1, bg-primary-50, text-primary-700, rounded-full, text-sm
  - Clickable: hover:bg-primary-100, cursor-pointer
- **Max display**: 5 tags, "+N개" for overflow

### 7. **Post Actions** (Engagement buttons)
- **Layout**: flex items-center gap-6, mt-4, pt-4, border-t border-neutral-100
- **Buttons**:
  - **Like button**:
    - Icon + count: "❤️ 125"
    - Active state: text-red-500, font-semibold
    - Inactive state: text-neutral-600
    - Hover: scale-110, transition-transform
  - **Comment button**:
    - Icon + count: "💬 18"
    - text-neutral-600, hover:text-primary-600
  - **Share button**:
    - Icon: "🔗 공유"
    - text-neutral-600, hover:text-primary-600
- **Styling**:
  - Each button: flex items-center gap-2, px-3, py-2, rounded-lg
  - Hover: bg-neutral-50
  - Active (liked): bg-red-50, text-red-600

### 8. **Post Menu Dropdown** (From [⋮])
- **Options**:
  - "수정" (Edit) - if author
  - "삭제" (Delete) - if author, text-red-600
  - "신고" (Report) - if not author, text-orange-600
  - "숨기기" (Hide) - text-neutral-700
  - "공유" (Share) - text-neutral-700
- **Styling**:
  - Position: absolute, right-0, top-10
  - Background: bg-white, shadow-lg, rounded-lg, border
  - Each item: p-3, hover:bg-neutral-50, text-sm

### 9. **Write Post Modal** (Clicking [✏️ 글쓰기])
- **Overlay**: bg-black/50, fixed inset-0, z-50
- **Modal**:
  - Width: max-w-2xl (desktop), full-width - 32px (mobile)
  - Background: bg-white, rounded-2xl, shadow-2xl
  - Padding: p-6
  - Max-height: 90vh, overflow-y-auto

### 10. **Write Post Form** (Inside modal)
- **Header**:
  - Title: "✏️ 글쓰기"
  - Close button: [×] (top-right)
- **Privacy toggle**:
  - Label: "공개 범위"
  - Options: 🌐 공개 / 🔒 익명
  - Toggle switch: bg-neutral-200, active:bg-primary-500
- **Title input** (optional):
  - Placeholder: "제목 (선택)"
  - Max-length: 100 characters
  - Styling: w-full, p-3, border-b, text-lg, font-semibold
- **Content textarea**:
  - Placeholder: "무엇이든 편하게 나눠주세요. 이곳은 안전한 공간입니다 💙"
  - Min-height: 200px
  - Max-length: 2000 characters
  - Character counter: "0/2000자" (bottom-right)
  - Styling: w-full, p-4, border-none, text-base, resize-none
- **Tags input**:
  - Label: "태그 추가 (최대 5개)"
  - Input: "#" auto-prefix, space/enter to add
  - Display: Chips with remove (×) button
  - Styling: flex flex-wrap gap-2
- **Action buttons**:
  - Cancel: Ghost button, "취소"
  - Submit: Primary button, "게시하기"

### 11. **Empty State** (No posts yet)
```
┌────────────────────────────────────┐
│           🌱                        │
│  아직 게시글이 없어요               │
│  첫 번째 이야기를 나눠주세요!       │
│                                    │
│     [첫 글 작성하기 →]             │
└────────────────────────────────────┘
```

### 12. **Load More Button**
- **Text**: "더보기 →"
- **Styling**:
  - w-full, py-3, mt-6
  - border-2, border-neutral-300, rounded-lg
  - text-neutral-700, hover:bg-neutral-50
  - Loading state: Spinner icon

### 13. **Search Modal** (Clicking 🔍)
- **Layout**: Full-screen overlay (mobile), modal (desktop)
- **Search input**:
  - Placeholder: "키워드, 태그, 사용자 검색"
  - Icon: 🔍 (left)
  - Clear button: ×  (right, when text present)
  - Auto-focus on open
- **Recent searches** (if no query):
  - "최근 검색" label
  - List of recent search terms (max 5)
  - Clear all button
- **Search results**:
  - Same post card format as main feed
  - Empty state: "검색 결과가 없습니다"
- **Filters** (optional):
  - 태그로 검색
  - 작성자로 검색
  - 날짜 범위

---

## State Variations

### 1. **Empty State** (No posts yet)
- Show empty state illustration (🌱)
- Message: "아직 게시글이 없어요"
- CTA: "[첫 글 작성하기 →]"

### 2. **Loading State** (Fetching posts)
- Show 3-5 skeleton loaders (post card shape)
- Tabs remain interactive
- Write button active

### 3. **Post Submission Success**
- Toast notification: "게시글이 작성되었습니다 ✓"
- Modal closes
- New post appears at top of feed (if sorted by "최신")
- Smooth scroll to new post

### 4. **Post Submission Error**
- Toast notification: "게시 중 오류가 발생했습니다. 다시 시도해주세요."
- Form data preserved
- Retry button available

### 5. **Like Animation**
- Heart icon scales up briefly (scale-125, 200ms)
- Color changes to red
- Count increments with slide-up animation
- Haptic feedback (mobile)

### 6. **Post Deleted**
- Toast notification: "게시글이 삭제되었습니다"
- Post card fades out (300ms)
- Gap closes smoothly

### 7. **Report Submitted**
- Toast notification: "신고가 접수되었습니다. 검토 후 조치하겠습니다."
- Post remains visible but marked internally
- User can "숨기기" immediately if desired

---

## Interactions & Animations

### Post Card
- **Hover**: Shadow increases (shadow-md), slight scale (scale-101)
- **Click**: Navigate to post detail page with comments
- **Long press (mobile)**: Show context menu (like, save, share, report)

### Like Button
- **Click**:
  - Heart icon animates (scale + color change, 300ms)
  - Count increments with slide-up effect
  - Haptic feedback (mobile)
- **Double-click post**: Fast like (Instagram-style)
  - Show floating heart animation at click position
  - Fade out and float up (1s)

### Comment Button
- **Click**: Scroll to comment section on detail page
- **Hover**: Text color change (neutral → primary)

### Share Button
- **Click**: Show share modal
  - Copy link
  - Share to social media (future)
  - Share to community (cross-post)

### Write Modal
- **Open**:
  - Overlay fades in (200ms)
  - Modal slides up from bottom (300ms ease-out)
- **Close**:
  - If text entered: Show confirmation ("작성 중인 내용이 있습니다. 나가시겠어요?")
  - Modal slides down, overlay fades out (250ms)
- **Submit**:
  - Button shows loading spinner
  - On success: Modal closes, toast shows, new post appears

### Tags
- **Click tag**: Navigate to tag search results
- **Hover**: Background darkens (bg-primary-100)
- **Add tag**: Chip fades in with slide effect (200ms)
- **Remove tag**: Chip fades out and shrinks (150ms)

### Infinite Scroll
- **Scroll to bottom**: Auto-load next page (10 posts)
- **Loading**: Show skeleton loader at bottom
- **No more**: Show "모든 게시글을 확인했습니다 ✓" message

---

## API Integration

### 1. **GET /api/community/posts?sort={popular|latest|most_liked|most_discussed}&limit=10&offset=0**
**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "author_name": "익명123",
        "is_anonymous": true,
        "title": null,
        "content": "오늘 회사에서 실수를 해서...",
        "tags": ["직장스트레스", "자책", "실수"],
        "like_count": 125,
        "comment_count": 18,
        "is_liked_by_me": false,
        "created_at": "2024-01-15T11:00:00Z",
        "updated_at": "2024-01-15T11:00:00Z"
      }
    ],
    "total": 234,
    "has_more": true
  }
}
```

### 2. **POST /api/community/posts**
**Request:**
```json
{
  "title": "불안감이 심할 때 도움이 된 방법들",
  "content": "1. 깊게 숨쉬기 (4-7-8 호흡법)\n2. 발바닥에 집중하며...",
  "tags": ["불안", "대처방법", "공유"],
  "is_anonymous": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "불안감이 심할 때...",
    "content": "1. 깊게 숨쉬기...",
    "tags": ["불안", "대처방법", "공유"],
    "author_name": "마음쉼",
    "is_anonymous": false,
    "like_count": 0,
    "comment_count": 0,
    "created_at": "2024-01-15T14:00:00Z"
  }
}
```

### 3. **GET /api/community/posts/{id}**
**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "uuid",
      "author_name": "익명123",
      "is_anonymous": true,
      "title": null,
      "content": "오늘 회사에서 실수를...",
      "tags": ["직장스트레스", "자책"],
      "like_count": 125,
      "comment_count": 18,
      "is_liked_by_me": true,
      "created_at": "2024-01-15T11:00:00Z"
    },
    "comments": [
      {
        "id": "uuid",
        "author_name": "응원단",
        "is_anonymous": false,
        "content": "실수는 누구나 해요. 너무 자책하지 마세요 💙",
        "like_count": 5,
        "created_at": "2024-01-15T11:15:00Z"
      }
    ]
  }
}
```

### 4. **POST /api/community/posts/{id}/like**
**Response:**
```json
{
  "success": true,
  "data": {
    "post_id": "uuid",
    "is_liked": true,
    "like_count": 126
  }
}
```

### 5. **DELETE /api/community/posts/{id}/like**
**Response:**
```json
{
  "success": true,
  "data": {
    "post_id": "uuid",
    "is_liked": false,
    "like_count": 125
  }
}
```

### 6. **PATCH /api/community/posts/{id}**
**Request:**
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "tags": ["수정", "태그"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "수정된 제목",
    "content": "수정된 내용",
    "updated_at": "2024-01-15T15:00:00Z"
  }
}
```

### 7. **DELETE /api/community/posts/{id}**
**Response:**
```json
{
  "success": true,
  "message": "게시글이 삭제되었습니다."
}
```

### 8. **POST /api/community/posts/{id}/report**
**Request:**
```json
{
  "reason": "inappropriate_content",
  "details": "부적절한 내용이 포함되어 있습니다."
}
```

**Response:**
```json
{
  "success": true,
  "message": "신고가 접수되었습니다."
}
```

### 9. **GET /api/community/search?query={keyword}&type={all|tag|author}&limit=10&offset=0**
**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "total": 45,
    "has_more": true
  }
}
```

---

## Accessibility Considerations

### Keyboard Navigation
- **Tab order**: Tabs → Write button → Post cards → Load more
- **Shortcuts**:
  - `N`: New post (open write modal)
  - `S`: Focus search
  - `L`: Like focused post
  - `C`: Comment on focused post
  - `Esc`: Close modals
  - `Enter`: Open post detail (on post focus)

### Screen Reader Support
- **Post card**: `role="article"`, `aria-label="익명123의 게시글, 3시간 전"`
- **Like button**: `aria-label="공감하기"`, `aria-pressed="true/false"`
- **Comment button**: `aria-label="댓글 18개 보기"`
- **Share button**: `aria-label="공유하기"`
- **Menu button**: `aria-label="더보기 메뉴"`, `aria-expanded="true/false"`
- **Modal**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
- **Form inputs**: Clear `aria-label` and `aria-describedby` for validation errors

### Visual Accessibility
- **Text contrast**: All text ≥4.5:1 against background
- **Like button states**:
  - Not liked: Gray heart with outline
  - Liked: Filled red heart (not relying on color alone)
- **Focus indicators**: Visible ring-2 ring-primary-500
- **Touch targets**: Minimum 44x44px for all interactive elements

---

## Responsive Behavior

### Desktop (1280px+)
- Single-column feed, max-width: 800px, centered
- Tabs horizontal layout
- Post cards show full content (4 lines max)
- Write modal: 640px width

### Tablet (768px - 1023px)
- Single-column feed, full-width with padding
- Tabs horizontal scroll
- Post cards show 2-3 lines
- Write modal: Full-width - 32px margin

### Mobile (320px - 767px)
- Single-column feed, full-width
- Tabs as icon buttons (compact)
- Post cards show 2 lines max
- Write modal: Full-screen
- Bottom navigation bar (fixed)

---

## Performance Considerations

### Initial Load
- Fetch first 10 posts
- Lazy load images (if added in future)
- Cache post data (15 min expiry)

### Optimizations
- Virtual scrolling for >50 posts
- Debounce search input (300ms)
- Optimize like/unlike (optimistic UI)
- Image lazy loading (future)
- Infinite scroll with intersection observer

### Data Management
- **Local state**: Post feed, filters, sort order
- **Cache**: Recent posts (15 min), liked posts (session)
- **Real-time sync**: WebSocket for like counts (future)
- **Offline support**: Show cached posts, queue actions

---

## Security & Privacy

### Content Moderation
- **Auto-filtering**: Block profanity, hate speech, spam
- **Manual review**: Flagged posts reviewed by moderators
- **Reporting**: Allow users to report inappropriate content
- **Penalties**: Warnings → temporary ban → permanent ban

### Privacy Controls
- **Anonymous mode**: Hide user identity, show "익명" + random number
- **Edit/Delete**: Allow within 24 hours (or unlimited if no replies)
- **Data retention**: Posts kept for 1 year, then archived
- **Account deletion**: Anonymize or delete all posts (user choice)

### Rate Limiting
- **Post creation**: Max 10 posts per day
- **Like/Unlike**: Max 100 actions per hour
- **Comments**: Max 50 comments per day
- **Reports**: Max 10 reports per day

---

## Future Enhancements

### Phase 2 Features
- 📸 Image attachments to posts
- 🔔 Notifications for replies/likes
- 💾 Save/bookmark posts
- 🔗 Share to external social media
- 📊 Post analytics (views, reach)
- 🏷️ Follow specific tags
- 👥 Follow users

### Phase 3 Features
- 🎙️ Voice note posts
- 📹 Video posts (short clips)
- 🌐 Multi-language support
- 🤖 AI content suggestions
- 🏆 Gamification (badges for helpful contributions)
- 📈 Trending topics
- 🗂️ User collections/folders

---

## Related Pages
- **Post Detail**: Full post with comments section
- **User Profile**: View user's posts (if not anonymous)
- **Tag Search**: All posts with specific tag
- **Dashboard**: Community engagement stats

---

## Design Assets Needed
- Avatar placeholders (anonymous, public users)
- Empty state illustration (🌱 or welcoming character)
- Like animation (heart burst effect)
- Loading skeleton (post card shape)
- Success/error toast icons
- Report/flag icons
- Share icons

---

## Notes
- **Tone**: Warm, supportive, non-judgmental community space
- **Moderation**: Active moderation to maintain safe environment
- **Anonymous safety**: Ensure true anonymity (no IP tracking, unique IDs per post)
- **Mental health crisis**: Auto-detect crisis language, provide helpline resources
- **Positive reinforcement**: Highlight supportive/helpful posts
- **Community guidelines**: Clear rules displayed prominently, linked in footer
