import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import * as api from "../lib/api";
import { UnauthorizedError } from "../lib/api";
import type { User } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  signup: (
    email: string,
    nickname: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  handleUnauthorized: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 토큰 만료 시 자동 로그아웃 처리
  const handleUnauthorized = useCallback(() => {
    api.logout();
    setUser(null);
    navigate("/login");
    // Toast는 각 컴포넌트에서 처리하도록 함
  }, [navigate]);

  // 초기 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const loadUser = async () => {
      // 토큰 유효성 먼저 체크
      if (api.hasToken()) {
        if (api.isTokenExpired()) {
          // 토큰이 만료된 경우 자동 로그아웃
          api.logout();
          setIsLoading(false);
          return;
        }

        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // 토큰이 유효하지 않으면 제거
          if (error instanceof UnauthorizedError) {
            handleUnauthorized();
          } else {
            api.logout();
          }
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [handleUnauthorized]);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    api.saveToken(response.access_token);

    // 로그인 후 사용자 정보 가져오기
    const userData = await api.getCurrentUser();
    setUser(userData);
  };

  const guestLogin = async () => {
    const response = await api.guestLogin();
    api.saveToken(response.access_token);

    // 게스트 로그인 후 사용자 정보 가져오기
    const userData = await api.getCurrentUser();
    setUser(userData);
  };

  const signup = async (email: string, nickname: string, password: string) => {
    const userData = await api.signup({ email, nickname, password });
    setUser(userData);

    // 회원가입 후 자동 로그인
    const loginResponse = await api.login({ email, password });
    api.saveToken(loginResponse.access_token);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (api.hasToken()) {
      // 토큰 만료 체크
      if (api.isTokenExpired()) {
        handleUnauthorized();
        return;
      }

      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          handleUnauthorized();
        } else {
          api.logout();
          setUser(null);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        guestLogin,
        signup,
        logout,
        refreshUser,
        handleUnauthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
