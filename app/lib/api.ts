/**
 * API 클라이언트 유틸리티
 * FastAPI 백엔드와 통신하는 함수들
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export interface ApiError {
  detail: string;
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  profile_image_url?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string | null;
  nickname: string;
  profile_image_url: string | null;
  role: "USER" | "ADMIN" | "EXPERT";
  auth_provider: "LOCAL" | "GOOGLE" | "KAKAO" | "NAVER" | null;
  is_anonymous: boolean;
  created_at: string;
  last_login_at: string | null;
}

/**
 * API 요청 헬퍼 함수
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();

    // 401 에러는 UnauthorizedError로 throw
    if (response.status === 401) {
      throw new UnauthorizedError(error.detail || "인증이 만료되었습니다");
    }

    throw new Error(error.detail || "API 요청 실패");
  }

  return response.json();
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<User> {
  return apiRequest<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me", {
    method: "GET",
  });
}

/**
 * 로그아웃 (클라이언트 사이드)
 */
export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_expires_at");
}

/**
 * 토큰 저장 (만료 시간도 함께 저장)
 */
export function saveToken(token: string): void {
  localStorage.setItem("access_token", token);

  // 토큰 만료 시간 계산 (30분 후)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30);
  localStorage.setItem("token_expires_at", expiresAt.toISOString());
}

/**
 * 토큰 확인
 */
export function hasToken(): boolean {
  return !!localStorage.getItem("access_token");
}

/**
 * 토큰 만료 여부 확인
 */
export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem("token_expires_at");
  if (!expiresAt) return true;

  return new Date() > new Date(expiresAt);
}

/**
 * 토큰 유효성 확인 (존재 + 만료되지 않음)
 */
export function isTokenValid(): boolean {
  return hasToken() && !isTokenExpired();
}
