# 마음쉼표 디자인 시스템

## 소개
마음쉼표(Mind Pause)의 UI/UX 디자인 시스템입니다.
따뜻하고 부드러운 분위기(Calm & Warm)를 바탕으로 감정 케어 서비스에 최적화된 디자인 가이드라인을 제공합니다.

---

## 1. 디자인 원칙 (Design Principles)

### 1.1 따뜻함 (Warmth)
- 사용자에게 안정감과 위로를 주는 색상과 형태
- 부드러운 곡선과 둥근 모서리
- 친근하고 다정한 톤의 메시지

### 1.2 명료함 (Clarity)
- 복잡하지 않은 직관적인 인터페이스
- 명확한 정보 계층 구조
- 간결하고 읽기 쉬운 텍스트

### 1.3 접근성 (Accessibility)
- WCAG 2.1 AA 기준 준수
- 충분한 색상 대비 (최소 4.5:1)
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### 1.4 일관성 (Consistency)
- 통일된 디자인 패턴
- 예측 가능한 인터랙션
- 재사용 가능한 컴포넌트

---

## 2. 컬러 시스템 (Color System)

### 2.1 Primary Colors (주 색상 - 블루/라벤더)

#### Primary Blue
```
Primary 50:  #F0F4FF  (배경, 호버 효과)
Primary 100: #E0EAFF  (밝은 배경)
Primary 200: #C7D9FF  (비활성 상태)
Primary 300: #A5C2FF  (보조 요소)
Primary 400: #7DA3FF  (인터랙티브 요소)
Primary 500: #5B8CFF  (주 액션 버튼)  ⭐ Main
Primary 600: #4A72DB  (호버 상태)
Primary 700: #3A5BB7  (활성 상태)
Primary 800: #2D4693  (강조)
Primary 900: #1E3070  (헤더, 강한 강조)
```

#### Lavender Accent
```
Lavender 50:  #F5F3FF  (부드러운 배경)
Lavender 100: #EDE9FE  (카드 배경)
Lavender 200: #DDD6FE  (비활성 상태)
Lavender 300: #C4B5FD  (보조 요소)
Lavender 400: #A78BFA  (인터랙티브 요소)
Lavender 500: #8B5CF6  (보조 액션)  ⭐ Main
Lavender 600: #7C3AED  (호버)
Lavender 700: #6D28D9  (활성)
Lavender 800: #5B21B6  (강조)
Lavender 900: #4C1D95  (헤더)
```

### 2.2 Secondary Colors (보조 색상)

#### Mint Green (치유, 회복)
```
Mint 50:  #F0FDFA
Mint 100: #CCFBF1
Mint 200: #99F6E4
Mint 300: #5EEAD4
Mint 400: #2DD4BF
Mint 500: #14B8A6  ⭐ Main (챌린지, 성취)
Mint 600: #0D9488
Mint 700: #0F766E
Mint 800: #115E59
Mint 900: #134E4A
```

#### Warm Pink (공감, 커뮤니티)
```
Pink 50:  #FFF1F2
Pink 100: #FFE4E6
Pink 200: #FECDD3
Pink 300: #FDA4AF
Pink 400: #FB7185
Pink 500: #F43F5E  ⭐ Main (좋아요, 하트)
Pink 600: #E11D48
Pink 700: #BE123C
Pink 800: #9F1239
Pink 900: #881337
```

### 2.3 Neutral Colors (중립 색상)

```
Gray 50:  #F9FAFB  (밝은 배경)
Gray 100: #F3F4F6  (카드 배경)
Gray 200: #E5E7EB  (구분선)
Gray 300: #D1D5DB  (비활성 텍스트)
Gray 400: #9CA3AF  (플레이스홀더)
Gray 500: #6B7280  (보조 텍스트)
Gray 600: #4B5563  (본문 텍스트)
Gray 700: #374151  (제목)
Gray 800: #1F2937  (헤딩)
Gray 900: #111827  (강한 텍스트)

White: #FFFFFF
Black: #000000
```

### 2.4 Semantic Colors (의미 색상)

#### Success (성공, 완료)
```
Success 50:  #F0FDF4
Success 500: #22C55E  ⭐ Main
Success 700: #15803D  (Dark mode)
```

#### Warning (경고, 주의)
```
Warning 50:  #FFFBEB
Warning 500: #F59E0B  ⭐ Main
Warning 700: #B45309  (Dark mode)
```

#### Error (오류, 실패)
```
Error 50:  #FEF2F2
Error 500: #EF4444  ⭐ Main
Error 700: #B91C1C  (Dark mode)
```

#### Info (정보, 안내)
```
Info 50:  #EFF6FF
Info 500: #3B82F6  ⭐ Main
Info 700: #1D4ED8  (Dark mode)
```

### 2.5 Emotion Colors (감정 점수 시각화)

```
VeryNegative: #EF4444  (감정 점수 -5 ~ -4)
Negative:     #F97316  (감정 점수 -3 ~ -2)
Neutral:      #6B7280  (감정 점수 -1 ~ 1)
Positive:     #10B981  (감정 점수 2 ~ 3)
VeryPositive: #14B8A6  (감정 점수 4 ~ 5)
```

---

## 3. 타이포그래피 (Typography)

### 3.1 Font Family

#### Primary Font (본문, UI)
```
font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont,
             'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
```

#### Fallback
```
system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue',
'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif
```

### 3.2 Font Sizes & Line Heights

| Name | Size | Line Height | Weight | Use Case |
|------|------|-------------|--------|----------|
| **Display** | 48px (3rem) | 1.2 (57.6px) | 700 | 랜딩 페이지 타이틀 |
| **H1** | 36px (2.25rem) | 1.25 (45px) | 700 | 페이지 제목 |
| **H2** | 30px (1.875rem) | 1.3 (39px) | 600 | 섹션 제목 |
| **H3** | 24px (1.5rem) | 1.35 (32.4px) | 600 | 서브 섹션 제목 |
| **H4** | 20px (1.25rem) | 1.4 (28px) | 600 | 카드 제목 |
| **H5** | 18px (1.125rem) | 1.45 (26.1px) | 600 | 작은 제목 |
| **Body Large** | 18px (1.125rem) | 1.6 (28.8px) | 400 | 강조 본문 |
| **Body** | 16px (1rem) | 1.6 (25.6px) | 400 | 기본 본문 |
| **Body Small** | 14px (0.875rem) | 1.5 (21px) | 400 | 보조 텍스트 |
| **Caption** | 12px (0.75rem) | 1.5 (18px) | 400 | 캡션, 주석 |
| **Label** | 14px (0.875rem) | 1.4 (19.6px) | 500 | 폼 라벨 |
| **Button** | 16px (1rem) | 1.5 (24px) | 500 | 버튼 텍스트 |

### 3.3 Font Weights

```
Light:    300  (거의 사용 안 함)
Regular:  400  (본문)
Medium:   500  (라벨, 버튼)
Semibold: 600  (제목)
Bold:     700  (강조 제목)
```

### 3.4 Letter Spacing

```
Tight:   -0.02em  (H1, Display)
Normal:   0em     (본문, 기본)
Wide:     0.02em  (Button, Label - 대문자 사용 시)
```

---

## 4. 간격 시스템 (Spacing System)

### 4.1 Spacing Scale (4px Grid System)

| Token | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| `0` | 0rem | 0px | 여백 제거 |
| `0.5` | 0.125rem | 2px | 아주 작은 간격 |
| `1` | 0.25rem | 4px | 최소 간격 |
| `1.5` | 0.375rem | 6px | 작은 간격 |
| `2` | 0.5rem | 8px | 기본 작은 간격 |
| `3` | 0.75rem | 12px | 중간 작은 간격 |
| `4` | 1rem | 16px | 기본 간격 ⭐ |
| `5` | 1.25rem | 20px | 중간 간격 |
| `6` | 1.5rem | 24px | 큰 간격 |
| `8` | 2rem | 32px | 매우 큰 간격 |
| `10` | 2.5rem | 40px | 섹션 간격 |
| `12` | 3rem | 48px | 큰 섹션 간격 |
| `16` | 4rem | 64px | 페이지 섹션 간격 |
| `20` | 5rem | 80px | 메인 섹션 간격 |
| `24` | 6rem | 96px | 대형 섹션 간격 |

### 4.2 Container Widths

```
sm:  640px   (모바일 가로)
md:  768px   (태블릿)
lg:  1024px  (작은 노트북)
xl:  1280px  (데스크톱)  ⭐ Main
2xl: 1536px  (큰 데스크톱)

Max Content Width: 1280px (xl)
```

### 4.3 Common Patterns

```
Card Padding:        16px (4) mobile, 24px (6) desktop
Section Padding:     32px (8) mobile, 64px (16) desktop
Page Side Padding:   16px (4) mobile, 24px (6) desktop
Gap Between Cards:   16px (4) mobile, 24px (6) desktop
Form Field Gap:      12px (3)
Button Padding:      12px 24px (py-3 px-6)
```

---

## 5. Border Radius (모서리 둥글기)

```
None:   0px      (sharp corners - 거의 사용 안 함)
xs:     2px      (subtle rounding)
sm:     4px      (inputs, badges)
base:   6px      (buttons, small cards)  ⭐
md:     8px      (cards, modals)  ⭐
lg:     12px     (large cards)
xl:     16px     (hero sections)
2xl:    20px     (특별한 카드)
3xl:    24px     (대형 컨테이너)
full:   9999px   (pills, avatars)
```

### 사용 가이드
- **Buttons**: `rounded-md` (8px)
- **Input Fields**: `rounded-md` (8px)
- **Cards**: `rounded-lg` (12px)
- **Modals**: `rounded-xl` (16px)
- **Avatars**: `rounded-full` (완전한 원)
- **Badges/Pills**: `rounded-full`

---

## 6. Shadows (그림자)

### 6.1 Shadow Scale

```css
/* None */
shadow-none: 0 0 #0000

/* Extra Small - 부드러운 구분 */
shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Small - 카드, 버튼 기본 */
shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
           0 1px 2px -1px rgba(0, 0, 0, 0.1)

/* Medium - 카드 호버, 드롭다운 */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
           0 2px 4px -2px rgba(0, 0, 0, 0.1)  ⭐

/* Large - 모달, 팝오버 */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
           0 4px 6px -4px rgba(0, 0, 0, 0.1)

/* Extra Large - 메인 모달 */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
           0 8px 10px -6px rgba(0, 0, 0, 0.1)

/* 2XL - 특별한 강조 */
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### 6.2 Colored Shadows (Primary)

```css
/* Primary 색상 그림자 (강조용) */
shadow-primary: 0 4px 14px 0 rgba(91, 140, 255, 0.25)
shadow-primary-lg: 0 10px 20px -5px rgba(91, 140, 255, 0.3)
```

### 6.3 사용 가이드
- **Cards (기본)**: `shadow-sm`
- **Cards (호버)**: `shadow-md`
- **Buttons (호버)**: `shadow-md`
- **Dropdowns**: `shadow-lg`
- **Modals**: `shadow-xl`
- **Primary CTA**: `shadow-primary` (호버 시)

---

## 7. Transitions & Animations

### 7.1 Duration

```
fast:     150ms   (아주 빠른 피드백)
base:     200ms   (기본 전환)  ⭐
medium:   300ms   (부드러운 전환)
slow:     500ms   (강조된 전환)
```

### 7.2 Easing Functions

```css
ease-linear:     cubic-bezier(0, 0, 1, 1)
ease-in:         cubic-bezier(0.4, 0, 1, 1)
ease-out:        cubic-bezier(0, 0, 0.2, 1)      ⭐ 가장 많이 사용
ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1)
ease-smooth:     cubic-bezier(0.4, 0.0, 0.2, 1)  (커스텀)
```

### 7.3 Common Transitions

```css
/* 기본 (색상, 배경, 테두리) */
transition: all 200ms ease-out;

/* 호버 효과 */
transition: transform 200ms ease-out, box-shadow 200ms ease-out;

/* 페이드 인/아웃 */
transition: opacity 300ms ease-out;

/* 슬라이드 */
transition: transform 300ms ease-out;
```

### 7.4 Keyframe Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Bounce (Loading)
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

#### Pulse (Attention)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 8. Iconography (아이콘)

### 8.1 Icon Library
**추천**: [Lucide Icons](https://lucide.dev/) or [Heroicons](https://heroicons.com/)
- React 컴포넌트 지원
- SVG 기반 (확장 가능)
- 일관된 스타일

### 8.2 Icon Sizes

| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 12px | 아주 작은 아이콘 |
| `sm` | 16px | 인라인 아이콘 |
| `base` | 20px | 기본 아이콘 ⭐ |
| `md` | 24px | 버튼 아이콘 |
| `lg` | 32px | 큰 아이콘 |
| `xl` | 48px | 피처 아이콘 |
| `2xl` | 64px | 히어로 아이콘 |

### 8.3 Icon Guidelines
- **Stroke Width**: 2px (일관성)
- **Color**: 텍스트 색상과 동일 또는 Primary 색상
- **Alignment**: 텍스트와 수직 중앙 정렬
- **Spacing**: 아이콘과 텍스트 사이 8px (2)

---

## 9. Breakpoints (반응형)

### 9.1 Screen Sizes

```
xs:  375px   (작은 모바일)
sm:  640px   (모바일)
md:  768px   (태블릿)
lg:  1024px  (작은 노트북)
xl:  1280px  (데스크톱)  ⭐ Main
2xl: 1536px  (큰 데스크톱)
```

### 9.2 Design Approach
- **Mobile First**: 기본 스타일은 모바일
- **Progressive Enhancement**: 큰 화면으로 갈수록 추가
- **Simultaneous Design**: 모바일/데스크톱 동시 고려

---

## 10. Accessibility (접근성)

### 10.1 Color Contrast
- **Normal Text**: 최소 4.5:1 (WCAG AA)
- **Large Text (18px+)**: 최소 3:1
- **Interactive Elements**: 최소 4.5:1

### 10.2 Focus States
```css
/* 기본 포커스 */
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2

/* 버튼 포커스 */
focus-visible:ring-2 focus-visible:ring-primary-500
```

### 10.3 Touch Targets
- **최소 크기**: 44x44px (모바일)
- **권장 크기**: 48x48px
- **간격**: 최소 8px

### 10.4 ARIA Labels
- 모든 인터랙티브 요소에 명확한 레이블
- 이미지에 대체 텍스트 (alt)
- 폼 필드에 적절한 label 연결

---

## 11. Z-Index Scale

```
z-0:     0      (기본 레이어)
z-10:    10     (드롭다운, 팝오버)
z-20:    20     (고정 헤더)
z-30:    30     (사이드바)
z-40:    40     (모달 배경)
z-50:    50     (모달 컨텐츠)
z-60:    60     (토스트, 알림)
z-70:    70     (툴팁)
z-max:   9999   (최상위)
```

---

## 12. 프로젝트 특화 가이드

### 12.1 감정 표현
- **감정 점수**: 슬라이더, 이모지, 색상 활용
- **감정 단어**: 부드러운 표현 사용
- **AI 응답 톤**: 따뜻하고 공감적

### 12.2 커뮤니티 느낌
- **익명성 존중**: 프로필 사진 대신 색상 아바타
- **안전한 공간**: 신고/차단 기능 명확히
- **공감 표현**: 하트, 응원 이모지

### 12.3 데이터 시각화
- **차트 색상**: Primary/Lavender 그라데이션
- **부드러운 곡선**: 꺾은선 그래프에 곡선 적용
- **도움말**: 항상 툴팁 제공

---

## 13. 다크 모드 (Future)

현재 MVP에서는 라이트 모드만 지원하지만, 향후 다크 모드 추가 시 고려사항:

```
Background:    Gray 900
Surface:       Gray 800
Primary:       Primary 400 (밝게 조정)
Text Primary:  Gray 100
Text Secondary: Gray 400
```

---

## 결론

이 디자인 시스템은 마음쉼표의 **따뜻하고 부드러운** 브랜드 정체성을 UI로 구현하기 위한 기초입니다.
모든 디자인 결정은 **사용자의 감정적 안정감**과 **직관적 사용성**을 최우선으로 합니다.

Tailwind CSS 설정과 함께 이 가이드를 따라 일관된 사용자 경험을 제공할 수 있습니다.
