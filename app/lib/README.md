# API 클라이언트 사용 가이드

## 토큰 만료 처리

JWT 토큰은 **30분** 후 자동으로 만료됩니다.

### 자동 처리

- 페이지 로드 시 토큰 만료 여부를 자동으로 체크합니다
- API 요청 시 401 에러 발생하면 자동으로 로그인 페이지로 리다이렉트됩니다
- `AuthContext`가 모든 인증 상태를 관리합니다

### 컴포넌트에서 401 에러 처리

API 호출 시 `UnauthorizedError`를 catch하여 처리할 수 있습니다:

```tsx
import { useAuth } from "../contexts/AuthContext";
import { UnauthorizedError } from "../lib/api";
import * as api from "../lib/api";

function MyComponent() {
  const { handleUnauthorized } = useAuth();
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const data = await api.someApiCall();
      // 데이터 처리
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        showToast("로그인이 만료되었습니다. 다시 로그인해주세요.", "error");
        handleUnauthorized(); // 자동 로그아웃 및 로그인 페이지로 이동
      } else {
        showToast("오류가 발생했습니다.", "error");
      }
    }
  };

  // ...
}
```

## API 함수

### 인증 관련

- `login(data)` - 로그인
- `signup(data)` - 회원가입
- `getCurrentUser()` - 현재 사용자 정보 조회
- `logout()` - 로그아웃 (토큰 삭제)

### 토큰 관리

- `saveToken(token)` - 토큰 저장 (만료 시간 포함)
- `hasToken()` - 토큰 존재 여부 확인
- `isTokenExpired()` - 토큰 만료 여부 확인
- `isTokenValid()` - 토큰 유효성 확인 (존재 + 만료되지 않음)

## 환경 변수

`.env` 파일에 다음 환경 변수를 설정하세요:

```env
VITE_API_URL=http://localhost:8000/api/v1
```
