# System Footprint & URL Map Worksheet

## 소개
- 본격적인 코딩에 들어가기 전에, 애플리케이션의 전체 구조, 페이지 구성, 사용자 흐름 등을 한눈에 파악하는 것이 이 과제의 목표입니다.
- 단순한 기능 단위의 나열이 아니라, 사용자가 실제 어떤 흐름으로 서비스를 경험하게 되는지를 중심으로 적어보세요.
- 페이지 구성, URL 경로, 사용자 행동, 역할별 권한 등을 사전에 정리하는 작업은, 설계의 누락이나 중복을 방지하고 개발 효율을 높이는 데 도움이 됩니다.
- 실제로 개발할 때 발생할 수 있는 여러 엣지 케이스나 오류 상황도 미리 생각해봄으로써, 더 나은 사용자 경험과 안정성을 갖출 수 있을 것입니다.

---

## 1. 주요 흐름 (Key Flows)
*애플리케이션 내에서 사용자가 수행하게 될 3~5가지 핵심 여정을 나열해보세요. 어떤 주요 작업을 하게 될까요?*

- 감정 상태 기록 및 AI 프롬프트 대화(코칭, 상담)
- 커뮤니티 내 고민 글 작성 및 공감/피드백 주고받기
- 감정 변화 데이터 시각화 및 리마인더/피드백 확인
- 사용자 로그인/프로필 관리(익명/식별 선택)
- 회복 행동/챌린지 진행 및 성취 확인

---

## 2. 사용자가 방문할 URL/페이지

| Page Name         | URL Path        | Purpose (페이지 목적)                           | Access Level (접근 권한) |
|-------------------|-----------------|-----------------------------------------------|--------------------------|
| Home              | `/`             | 마음쉼표 소개, 기능 안내, 주요 링크             | 누구나(비회원 가능)      |
| SignUp/Login      | `/login`        | 회원가입, 로그인 및 익명 진입                  | 누구나                   |
| Emotion Log       | `/emotion`      | 감정 상태 입력, 프롬프트 선택·기록             | 회원(로그인)              |
| Chat/AI Coach     | `/chat`         | AI 챗봇과의 1:1 대화, 코칭, 행동 제안           | 회원(로그인)              |
| Community         | `/community`    | 고민/공감 글 작성, 댓글·공감·공유               | 회원(로그인, 익명권장)    |
| Data Analytics    | `/dashboard`    | 감정 변화 차트, 행동 기록, 성과 피드백          | 회원(로그인)              |
| Profile/Settings  | `/profile`      | 닉네임·프로필 변경, 개인정보·알림 설정          | 회원(로그인)              |
| Recovery Mission  | `/challenge`    | 일일/주간 챌린지/회복 미션 진행, 수락, 기록      | 회원(로그인)              |
| Help/FAQ          | `/help`         | 사용법, 문의, 에러 대응 FAQ 제공                | 누구나                   |
| Admin             | `/admin`        | 사용자 관리, 컨텐츠/로그 모니터링, 통계         | 관리자(특수 권한)         |
| Error             | `/error`        | 오류 발생 시 안내 및 복귀 경로 제시             | 누구나                   |

---

## 3. 페이지별 API 엔드포인트 매핑

| Page Name         | Primary APIs Used                                                  |
|-------------------|-------------------------------------------------------------------|
| Home              | (없음 - 정적 페이지)                                               |
| SignUp/Login      | `POST /auth/register`, `POST /auth/login`, `GET /auth/google`, `GET /auth/kakao` |
| Emotion Log       | `POST /emotions`, `GET /emotions`, `PATCH /emotions/{id}`, `DELETE /emotions/{id}` |
| Chat/AI Coach     | `POST /chat/conversations`, `GET /chat/conversations`, `POST /chat/conversations/{id}/messages` |
| Community         | `GET /community/posts`, `POST /community/posts`, `GET /community/posts/{id}`, `POST /community/posts/{id}/like` |
| Data Analytics    | `GET /emotions/stats`, `GET /emotions?startDate=...&endDate=...`, `GET /challenges` |
| Profile/Settings  | `GET /users/me`, `PATCH /users/me`, `PATCH /users/me/password`, `DELETE /users/me` |
| Recovery Mission  | `GET /challenges`, `POST /challenges`, `PATCH /challenges/{id}` |
| Help/FAQ          | (없음 - 정적 페이지 또는 CMS)                                      |
| Admin             | `GET /admin/users`, `GET /admin/stats`, `DELETE /admin/posts/{id}`, `DELETE /admin/comments/{id}` |
| Error             | (없음 - 정적 페이지)                                               |

---

## 4. 각 페이지에서 가능한 사용자 행동

### Home (`/`)
- 서비스 소개/가이드 읽기
- 로그인 또는 회원가입 페이지 이동
- 커뮤니티/감정 기록/챌린지 페이지 바로가기

### SignUp/Login (`/login`)
- 신규 회원가입(이메일/익명)
- 기존 회원 로그인
- 소셜 로그인/익명 로그인
- PW/아이디 찾기

### Emotion Log (`/emotion`)
- 오늘의 감정 입력(슬라이더/텍스트)
- 프롬프트 선택 및 기록
- 지난 기록 확인/수정

### Chat/AI Coach (`/chat`)
- AI와 실시간 감정/행동 대화
- 프롬프트 제안/상담 세션 시작
- 상담 대화 저장/불러오기

### Community (`/community`)
- 고민/공감 글 작성
- 댓글/공감/응원 남기기
- 인기글, 최신글 탐색 및 공유

### Data Analytics (`/dashboard`)
- 감정 변화 차트 확인
- AI·커뮤니티 피드백 이력 열람
- 행동 실천률/챌린지 성과 분석

### Profile/Settings (`/profile`)
- 닉네임, 프로필 이미지 변경
- 비밀번호/알림/개인정보 관리
- 계정 탈퇴/해지

### Recovery Mission (`/challenge`)
- 챌린지 수락/진행/기록
- 성취 내역 확인
- 리마인더/동기부여 컨텐츠 수신

### Help/FAQ (`/help`)
- FAQ·가이드 열람
- 문의/피드백 제출
- 장애·오류 신고

### Admin (`/admin`)
- 회원·컨텐츠 관리(글/댓글/챌린지)
- 통계 대시보드 확인
- 버그/에러 로그 모니터링

### Error (`/error`)
- 오류 안내 메시지 확인
- 홈/이전 페이지 복귀 버튼 클릭
- 고객센터/문의 연결

---

## 5. 사용자 역할 및 권한
- 비회원: 기본소개, FAQ, 회원가입·로그인만 가능
- 일반회원: 감정 입력, AI 대화, 커뮤니티, 데이터 시각화, 챌린지 등 모든 일반 기능 사용
- 익명회원: 최소 감정 입력, 커뮤니티 글/댓글 제한적 작성, 일부 기능 제한
- 관리자: 회원·컨텐츠 관리, 통계/로그 확인, 시스템 설정
- 상담/전문 파트너: 전문 콘텐츠 작성, 상담 챗봇 검수/기여권한
- 개발/운영팀: 시스템 모니터링, 기능 배포·수정 권한

---

## 6. 엣지 케이스 및 오류 처리
- 네트워크 오류: 저장 실패 시 재시도 안내, 임시 로컬 보관
- 감정 입력 없이 진행 시: 경고/가이드 메시지 표시
- AI 대화 오류: 대체 프롬프트, FAQ 안내 연결
- 커뮤니티 악성글: 신고/차단, 자동 필터링
- 데이터 유실/중복: 백엔드 로그, 복구 프로세스 적용
- 권한 없는 접근: 에러페이지, 로그인 안내
- 회원탈퇴/삭제 시 데이터 처리: 익명화/완전삭제 옵션 선택
- 시스템 장애/다운: 안내 메시지, 복구 ETA 공지, 사용자 문의 연결
