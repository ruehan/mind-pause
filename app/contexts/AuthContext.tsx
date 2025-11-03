import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import * as api from "../lib/api";
import type { User } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    nickname: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const loadUser = async () => {
      if (api.hasToken()) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // 토큰이 유효하지 않으면 제거
          api.logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    api.saveToken(response.access_token);

    // 로그인 후 사용자 정보 가져오기
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
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        api.logout();
        setUser(null);
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
        signup,
        logout,
        refreshUser,
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
