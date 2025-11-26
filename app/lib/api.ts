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

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
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
  user?: User; // 로그인 시 함께 반환되는 사용자 정보
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
  options: RequestInit = {},
  explicitToken?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = explicitToken || localStorage.getItem("access_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log(`API Request to ${endpoint}: Using token`, token.substring(0, 20) + "...");
  } else {
    console.log(`API Request to ${endpoint}: No token found`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
    credentials: "omit", // 쿠키 간섭 방지
  });

  if (!response.ok) {
    const error: ApiError = await response.json();

    // 401 에러는 UnauthorizedError로 throw
    if (response.status === 401) {
      throw new UnauthorizedError(error.detail || "인증이 만료되었습니다");
    }

    // 403 에러는 ForbiddenError로 throw
    if (response.status === 403) {
      throw new ForbiddenError(error.detail || "접근 권한이 없습니다");
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
 * 게스트 로그인
 */
export async function guestLogin(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/guest-login", {
    method: "POST",
  });
}

/**
 * 게스트 → 정회원 전환
 */
export async function convertGuest(data: SignupRequest): Promise<User> {
  return apiRequest<User>("/auth/convert-guest", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ... (skip other functions)

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(token?: string): Promise<User> {
  return apiRequest<User>("/auth/me", {
    method: "GET",
  }, token);
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

// ========================================
// Image Upload
// ========================================

export interface UploadResponse {
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  size: number;
}

/**
 * 이미지 업로드
 */
export async function uploadImage(
  file: File,
  folder: string = "mind-pause"
): Promise<UploadResponse> {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append("file", file);
  
  const url = `${API_BASE_URL}/upload/image?folder=${encodeURIComponent(folder)}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    
    if (response.status === 401) {
      throw new UnauthorizedError(error.detail || "인증이 만료되었습니다");
    }
    
    throw new Error(error.detail || "이미지 업로드 실패");
  }
  
  return response.json();
}

/**
 * 이미지 삭제
 */
export async function deleteImage(publicId: string): Promise<void> {
  const token = localStorage.getItem("access_token");
  const url = `${API_BASE_URL}/upload/image/${encodeURIComponent(publicId)}`;
  
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    
    if (response.status === 401) {
      throw new UnauthorizedError(error.detail || "인증이 만료되었습니다");
    }
    
    throw new Error(error.detail || "이미지 삭제 실패");
  }
}

// ========================================
// User Profile
// ========================================

export interface UserProfileUpdate {
  nickname?: string;
  profile_image_url?: string;
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(data: UserProfileUpdate): Promise<User> {
  return apiRequest<User>("/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * AI 캐릭터 관련 인터페이스
 */
export interface AvatarOptions {
  sex?: string;
  faceColor?: string;
  earSize?: string;
  hairStyle?: string;
  hairColor?: string;
  hatStyle?: string;
  hatColor?: string;
  eyeStyle?: string;
  glassesStyle?: string;
  noseStyle?: string;
  mouthStyle?: string;
  shirtStyle?: string;
  shirtColor?: string;
  bgColor?: string;
}

export interface AICharacter {
  id: string;
  user_id: string;
  name: string;
  personality: string;
  description?: string;
  avatar_options?: AvatarOptions;
  system_prompt?: string;
  traits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AICharacterCreate {
  name: string;
  personality: string;
  description?: string;
  avatar_options?: AvatarOptions;
  system_prompt?: string;
}

export interface AICharacterUpdate {
  name?: string;
  personality?: string;
  description?: string;
  avatar_options?: AvatarOptions;
  system_prompt?: string;
  is_active?: boolean;
}

/**
 * AI 캐릭터 생성
 */
export async function createAICharacter(data: AICharacterCreate): Promise<AICharacter> {
  return apiRequest<AICharacter>("/ai-characters", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * AI 캐릭터 목록 조회
 */
export async function getAICharacters(): Promise<AICharacter[]> {
  return apiRequest<AICharacter[]>("/ai-characters", {
    method: "GET",
  });
}

/**
 * 활성 AI 캐릭터 조회
 */
export async function getActiveAICharacter(): Promise<AICharacter> {
  return apiRequest<AICharacter>("/ai-characters/active", {
    method: "GET",
  });
}

/**
 * AI 캐릭터 상세 조회
 */
export async function getAICharacter(characterId: string): Promise<AICharacter> {
  return apiRequest<AICharacter>(`/ai-characters/${characterId}`, {
    method: "GET",
  });
}

/**
 * AI 캐릭터 수정
 */
export async function updateAICharacter(
  characterId: string,
  data: AICharacterUpdate
): Promise<AICharacter> {
  return apiRequest<AICharacter>(`/ai-characters/${characterId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * AI 캐릭터 삭제
 */
export async function deleteAICharacter(characterId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/ai-characters/${characterId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
}

/**
 * 대화 관련 인터페이스
 */
export interface Conversation {
  id: string;
  user_id: string;
  character_id: string;
  character?: {
    id: string;
    name: string;
    avatar_options?: Record<string, string>;
  };
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationCreate {
  character_id: string;
  title?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface MessageCreate {
  content: string;
}

/**
 * 대화 목록 조회
 */
export async function getConversations(
  skip = 0, 
  limit = 20, 
  characterId?: string
): Promise<Conversation[]> {
  let url = `/chat/conversations?skip=${skip}&limit=${limit}`;
  if (characterId) {
    url += `&character_id=${characterId}`;
  }
  return apiRequest<Conversation[]>(url, {
    method: "GET",
  });
}

/**
 * 특정 대화 조회
 */
export async function getConversation(conversationId: string): Promise<Conversation> {
  return apiRequest<Conversation>(`/chat/conversations/${conversationId}`, {
    method: "GET",
  });
}

/**
 * 새 대화 생성
 */
export async function createConversation(data: ConversationCreate): Promise<Conversation> {
  return apiRequest<Conversation>("/chat/conversations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 대화 정보 업데이트
 */
export async function updateConversation(
  conversationId: string,
  data: { title?: string }
): Promise<Conversation> {
  return apiRequest<Conversation>(`/chat/conversations/${conversationId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * 대화 삭제
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  await apiRequest<void>(`/chat/conversations/${conversationId}`, {
    method: "DELETE",
  });
}

/**
 * 대화의 메시지 목록 조회
 */
export async function getMessages(conversationId: string, skip = 0, limit = 50): Promise<Message[]> {
  return apiRequest<Message[]>(`/chat/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`, {
    method: "GET",
  });
}

/**
 * 대화 요약 목록 조회
 */
export async function getConversationSummaries(conversationId: string): Promise<{
  summaries: Array<{
    id: string;
    summary: string;
    message_count: number;
    created_at: string;
  }>;
  total_count: number;
}> {
  return apiRequest(`/chat/conversations/${conversationId}/summaries`, {
    method: "GET",
  });
}

/**
 * 스트리밍 채팅 메시지 전송
 * EventSource를 사용하여 SSE로 실시간 응답 받기
 */
export function streamChatMessage(
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onDone: (messageId: string) => void,
  onError: (error: string) => void
): EventSource {
  const token = localStorage.getItem("access_token");
  const url = `${API_BASE_URL}/chat/conversations/${conversationId}/messages/stream`;

  // POST 요청으로 메시지 전송
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("메시지 전송 실패");
      }

      // SSE 스트림 읽기
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      function read() {
        reader?.read().then(({ done, value }) => {
          if (done) {
            console.log("스트림 종료");
            return;
          }

          const text = decoder.decode(value);
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);

                if (parsed.type === "chunk") {
                  onChunk(parsed.content);
                } else if (parsed.type === "done") {
                  onDone(parsed.message_id);
                  return; // 스트림 종료
                } else if (parsed.type === "error") {
                  onError(parsed.error);
                  return; // 스트림 종료
                }
              } catch (e) {
                console.error("JSON 파싱 오류:", e, "원본:", line);
              }
            }
          }

          read();
        }).catch((error) => {
          console.error("스트림 읽기 오류:", error);
          onError(error.message);
        });
      }

      read();
    })
    .catch((error) => {
      onError(error.message);
    });

  // EventSource 객체 반환 (호환성을 위해)
  return {} as EventSource;
}

// ========================================
// Community Types
// ========================================

export interface Post {
  id: string;
  user_id: string | null;
  title: string;
  content: string;
  is_anonymous: boolean;
  num_likes: number;
  num_comments: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string | null;
    nickname: string;
    profile_image_url: string | null;
  } | null;
  is_liked?: boolean;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  page_size: number;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  is_anonymous?: boolean;
}

export interface PostUpdateRequest {
  title?: string;
  content?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  user: {
    id: string | null;
    nickname: string;
    profile_image_url: string | null;
  } | null;
  num_likes?: number;
  is_liked?: boolean;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
}

export interface CommentCreateRequest {
  post_id: string;
  content: string;
  is_anonymous?: boolean;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface LikeCreateRequest {
  post_id?: string;
  comment_id?: string;
}

// ========================================
// Community API Functions
// ========================================

/**
 * 게시글 목록 조회
 */
export async function getPosts(
  page: number = 1,
  pageSize: number = 20,
  sort: "latest" | "popular" = "latest",
  search?: string
): Promise<PostListResponse> {
  let url = `/community/posts?page=${page}&page_size=${pageSize}&sort=${sort}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return apiRequest<PostListResponse>(url);
}

/**
 * 게시글 상세 조회
 */
export async function getPost(postId: string): Promise<Post> {
  return apiRequest<Post>(`/community/posts/${postId}`);
}

/**
 * 게시글 작성
 */
export async function createPost(data: PostCreateRequest): Promise<Post> {
  return apiRequest<Post>("/community/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 게시글 수정
 */
export async function updatePost(
  postId: string,
  data: PostUpdateRequest
): Promise<Post> {
  return apiRequest<Post>(`/community/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * 게시글 삭제
 */
export async function deletePost(postId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/community/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
}

/**
 * 댓글 목록 조회
 */
export async function getComments(postId: string): Promise<CommentListResponse> {
  return apiRequest<CommentListResponse>(`/community/posts/${postId}/comments`);
}

/**
 * 댓글 작성
 */
export async function createComment(data: CommentCreateRequest): Promise<Comment> {
  return apiRequest<Comment>("/community/comments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: string,
  data: CommentUpdateRequest
): Promise<Comment> {
  return apiRequest<Comment>(`/community/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/community/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
}

/**
 * 좋아요 추가
 */
export async function createLike(data: LikeCreateRequest): Promise<void> {
  await apiRequest("/community/likes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 좋아요 취소
 */
export async function deleteLike(postId?: string, commentId?: string): Promise<void> {
  const params = new URLSearchParams();
  if (postId) params.append("post_id", postId);
  if (commentId) params.append("comment_id", commentId);

  await fetch(`${API_BASE_URL}/community/likes?${params.toString()}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
}

// ========================================
// Emotion Log API
// ========================================

export interface EmotionLog {
  id: string;
  user_id: string;
  emotion_value: number;
  emotion_label: string;
  emotion_emoji: string;
  note?: string;
  ai_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface EmotionLogCreateRequest {
  emotion_value: number;
  emotion_label: string;
  emotion_emoji: string;
  note?: string;
  ai_feedback?: string;
}

export interface EmotionLogUpdateRequest {
  emotion_value?: number;
  emotion_label?: string;
  emotion_emoji?: string;
  note?: string;
}

export interface EmotionLogListResponse {
  emotion_logs: EmotionLog[];
  total: number;
  page: number;
  page_size: number;
}

export interface EmotionStats {
  average_emotion: number;
  total_records: number;
  streak_days: number;
  emotion_distribution: Record<string, number>;
}

export interface ChartData {
  date: string;
  value: number;
}

/**
 * 감정 기록 생성
 */
export async function createEmotionLog(data: EmotionLogCreateRequest): Promise<EmotionLog> {
  return apiRequest("/emotion/logs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 감정 기록 목록 조회
 */
export async function getEmotionLogs(
  page: number = 1,
  pageSize: number = 20,
  startDate?: string,
  endDate?: string
): Promise<EmotionLogListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  return apiRequest(`/emotion/logs?${params.toString()}`);
}

/**
 * 감정 기록 상세 조회
 */
export async function getEmotionLog(logId: string): Promise<EmotionLog> {
  return apiRequest(`/emotion/logs/${logId}`);
}

/**
 * 감정 기록 수정
 */
export async function updateEmotionLog(
  logId: string,
  data: EmotionLogUpdateRequest
): Promise<EmotionLog> {
  return apiRequest(`/emotion/logs/${logId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * 감정 기록 삭제
 */
export async function deleteEmotionLog(logId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/emotion/logs/${logId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
}

/**
 * 감정 통계 조회
 */
export async function getEmotionStats(days: number = 30): Promise<EmotionStats> {
  return apiRequest(`/emotion/stats?days=${days}`);
}

/**
 * 감정 차트 데이터 조회
 */
export async function getEmotionChart(days: number = 30): Promise<{ data: ChartData[] }> {
  return apiRequest(`/emotion/chart?days=${days}`);
}

// ============================================
// Challenge API
// ============================================

export type ChallengeType = "streak" | "community";
export type ChallengeStatus = "pending" | "approved" | "rejected";

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  challenge_type: ChallengeType;
  default_duration_days: number;
  default_target_count: number;
  icon: string | null;
  reward_badge: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  template_id: string | null;
  created_by: string;
  title: string;
  description: string;
  challenge_type: ChallengeType;
  duration_days: number;
  target_count: number;
  icon: string | null;
  reward_badge: string | null;
  status: ChallengeStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  participants_count: number;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  challenge: Challenge;
  joined_at: string;
  current_streak: number;
  best_streak: number;
  completed_count: number;
  is_completed: boolean;
  completed_at: string | null;
  last_activity_date: string | null;
  progress_percentage: number;
}

export interface ChallengeListResponse {
  challenges: Challenge[];
  total: number;
}

export interface UserChallengeListResponse {
  user_challenges: UserChallenge[];
  total: number;
}

export interface ChallengeTemplateListResponse {
  templates: ChallengeTemplate[];
  total: number;
}

export interface ChallengeCreateRequest {
  template_id: string;
  start_date: string;
  end_date: string;
}

export interface ChallengeRejectRequest {
  reason: string;
}

/**
 * 챌린지 템플릿 목록 조회
 */
export async function getChallengeTemplates(): Promise<ChallengeTemplateListResponse> {
  return apiRequest("/challenges/templates");
}

/**
 * 챌린지 목록 조회 (승인된 챌린지만)
 */
export async function getChallenges(): Promise<ChallengeListResponse> {
  return apiRequest("/challenges");
}

/**
 * 챌린지 생성
 */
export async function createChallenge(data: ChallengeCreateRequest): Promise<Challenge> {
  return apiRequest("/challenges", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 챌린지 상세 조회
 */
export async function getChallenge(challengeId: string): Promise<Challenge> {
  return apiRequest(`/challenges/${challengeId}`);
}

/**
 * 챌린지 참여
 */
export async function joinChallenge(challengeId: string): Promise<UserChallenge> {
  return apiRequest(`/challenges/${challengeId}/join`, {
    method: "POST",
  });
}

/**
 * 내 챌린지 목록 조회 (참여 중인 챌린지)
 */
export async function getMyChallenges(): Promise<UserChallengeListResponse> {
  return apiRequest("/challenges/my/list");
}

/**
 * 내가 생성한 챌린지 목록 조회 (승인 대기 포함)
 */
export async function getMyCreatedChallenges(): Promise<ChallengeListResponse> {
  return apiRequest("/challenges/my/created");
}

// ============================================
// Admin API
// ============================================

export interface DashboardStats {
  total_users: number;
  new_users_today: number;
  new_users_week: number;
  total_emotion_logs: number;
  emotion_logs_today: number;
  emotion_logs_week: number;
  total_posts: number;
  posts_today: number;
  total_comments: number;
  total_challenges: number;
  active_challenges: number;
  pending_challenges: number;
  total_conversations: number;
  conversations_today: number;
}

export interface UserManagementItem {
  id: string;
  email: string | null;
  nickname: string;
  role: "USER" | "ADMIN" | "EXPERT";
  is_deleted: boolean;
  created_at: string;
  last_login_at: string | null;
  emotion_log_count: number;
  post_count: number;
  comment_count: number;
}

export interface UserManagementListResponse {
  users: UserManagementItem[];
  total: number;
}

export interface UserRoleUpdateRequest {
  role: "USER" | "ADMIN" | "EXPERT";
}

export interface UserDeleteRequest {
  permanent: boolean;
}

export interface ReportItem {
  id: string;
  reporter_id: string;
  reporter_nickname: string;
  report_type: "post" | "comment";
  report_reason: string;
  description: string | null;
  post_id: string | null;
  comment_id: string | null;
  target_content: string | null;
  status: "pending" | "reviewing" | "resolved" | "rejected";
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface ReportListResponse {
  reports: ReportItem[];
  total: number;
}

export interface ReportReviewRequest {
  status: "reviewing" | "resolved" | "rejected";
  admin_note?: string;
  delete_content: boolean;
}

/**
 * 관리자 대시보드 통계 조회
 */
export async function getAdminDashboardStats(): Promise<DashboardStats> {
  return apiRequest("/admin/dashboard/stats");
}

/**
 * 사용자 목록 조회 (관리자)
 */
export async function getAdminUsers(skip: number = 0, limit: number = 50): Promise<UserManagementListResponse> {
  return apiRequest(`/admin/users?skip=${skip}&limit=${limit}`);
}

/**
 * 사용자 역할 변경 (관리자)
 */
export async function updateUserRole(userId: string, data: UserRoleUpdateRequest): Promise<UserManagementItem> {
  return apiRequest(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * 사용자 삭제 (관리자)
 */
export async function deleteAdminUser(userId: string, data: UserDeleteRequest): Promise<{ message: string; user_id: string }> {
  return apiRequest(`/admin/users/${userId}`, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
}

/**
 * 신고 목록 조회 (관리자)
 */
export async function getAdminReports(status?: string, skip: number = 0, limit: number = 50): Promise<ReportListResponse> {
  const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
  if (status) params.append("status", status);
  return apiRequest(`/admin/reports?${params.toString()}`);
}

/**
 * 신고 처리 (관리자)
 */
export async function reviewReport(reportId: string, data: ReportReviewRequest): Promise<ReportItem> {
  return apiRequest(`/admin/reports/${reportId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * 승인 대기 챌린지 목록 조회 (관리자)
 */
export async function getPendingChallenges(): Promise<ChallengeListResponse> {
  return apiRequest("/challenges/admin/pending");
}

/**
 * 챌린지 승인 (관리자)
 */
export async function approveChallenge(challengeId: string): Promise<Challenge> {
  return apiRequest(`/challenges/${challengeId}/approve`, {
    method: "POST",
  });
}

/**
 * 챌린지 거부 (관리자)
 */
export async function rejectChallenge(challengeId: string, data: ChallengeRejectRequest): Promise<Challenge> {
  return apiRequest(`/challenges/${challengeId}/reject`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================
// 대시보드 API
// ============================================

export interface ActivitySummary {
  total_emotion_logs: number;
  emotion_logs_this_week: number;
  emotion_logs_this_month: number;
  total_posts: number;
  total_comments: number;
  total_likes_received: number;
  posts_this_week: number;
  comments_this_week: number;
  active_challenges: number;
  completed_challenges: number;
  current_best_streak: number; // AI 채팅 통계
  total_conversations: number;
  conversations_this_week: number;
  
  // 변화율 통계 (전주 대비 %)
  emotion_logs_trend?: number | null;
  conversations_trend?: number | null;
  challenges_trend?: number | null;
}

export interface RecentEmotionLog {
  id: string;
  emotion_type: string;
  intensity: number;
  content: string | null;
  created_at: string;
}

export interface RecentPost {
  id: string;
  title: string;
  content: string;
  num_likes: number;
  num_comments: number;
  created_at: string;
}

export interface RecentComment {
  id: string;
  post_id: string;
  post_title: string;
  content: string;
  created_at: string;
}

export interface ChallengeActivity {
  id: string;
  challenge_id: string;
  challenge_title: string;
  challenge_icon: string | null;
  current_streak: number;
  best_streak: number;
  progress_percentage: number;
  is_completed: boolean;
}

export interface RecentActivities {
  emotion_logs: RecentEmotionLog[];
  posts: RecentPost[];
  comments: RecentComment[];
  challenge_activities: ChallengeActivity[];
}

export interface UserDashboard {
  summary: ActivitySummary;
  recent_activities: RecentActivities;
  emotion_trend?: WeeklyEmotionTrend;
  feedback_stats?: FeedbackStats;
  token_usage?: TokenUsageSummary;
}

export interface EmotionTrendPoint {
  date: string;
  emotion_type: string;
  avg_intensity: number;
  count: number;
}

export interface WeeklyEmotionTrend {
  start_date: string;
  end_date: string;
  data_points: EmotionTrendPoint[];
}

/**
 * 사용자 대시보드 조회
 */
export async function getUserDashboard(): Promise<UserDashboard> {
  return apiRequest<UserDashboard>("/dashboard");
}

/**
 * 주간 감정 흐름 데이터 조회
 */
export async function getEmotionTrend(days: number = 7): Promise<WeeklyEmotionTrend> {
  return apiRequest<WeeklyEmotionTrend>(`/dashboard/emotion-trend?days=${days}`);
}

// ============================================
// Feedback API
// ============================================

export interface MessageFeedback {
  id: string;
  message_id: string;
  is_helpful: boolean;
  feedback_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationRating {
  id: string;
  conversation_id: string;
  rating: number;
  feedback_text: string | null;
  created_at: string;
}

export interface MessageFeedbackRequest {
  message_id: string;
  is_helpful: boolean;
  feedback_text?: string;
}

export interface ConversationRatingRequest {
  conversation_id: string;
  rating: number;
  feedback_text?: string;
}

/**
 * 메시지 피드백 등록/수정
 */
export async function submitMessageFeedback(data: MessageFeedbackRequest): Promise<MessageFeedback> {
  return apiRequest("/feedback/message", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 메시지 피드백 조회
 */
export async function getMessageFeedback(messageId: string): Promise<MessageFeedback | null> {
  try {
    return await apiRequest(`/feedback/message/${messageId}`);
  } catch (error) {
    return null;
  }
}

/**
 * 대화 만족도 평가 등록/수정
 */
export async function submitConversationRating(data: ConversationRatingRequest): Promise<ConversationRating> {
  return apiRequest("/feedback/conversation", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 대화 만족도 평가 조회
 */
export async function getConversationRating(conversationId: string): Promise<ConversationRating | null> {
  try {
    return await apiRequest(`/feedback/conversation/${conversationId}`);
  } catch (error) {
    return null;
  }
}

/**
 * 피드백 통계 인터페이스
 */
export interface FeedbackStats {
  total_feedbacks: number;
  positive_feedbacks: number;
  negative_feedbacks: number;
  positive_ratio: number;
  total_conversations_rated: number;
  average_rating: number | null;
  recent_feedbacks: MessageFeedback[];
}

/**
 * 피드백 통계 조회
 */
export async function getFeedbackStats(days: number = 30): Promise<FeedbackStats> {
  return apiRequest(`/feedback/stats?days=${days}`);
}

// ============================================
// User Preferences API
// ============================================

/**
 * 사용자 AI 응답 선호도 인터페이스
 */
export interface UserAIPreference {
  tone: string;
  length: string;
  empathy_level: string;
}

export interface UserAIPreferenceUpdate {
  tone: string;
  length: string;
  empathy_level: string;
}

/**
 * 사용자 AI 응답 선호도 조회
 */
export async function getUserAIPreferences(): Promise<UserAIPreference> {
  return apiRequest(`/user/prompt-preference`);
}

// ==================== 토큰 사용량 API ====================

export interface TokenQuota {
  monthly_limit: number;
  monthly_used: number;
  monthly_remaining: number;
  daily_limit: number;
  daily_used: number;
  daily_remaining: number;
  bonus_tokens: number;
  last_reset_at: string;
}

export interface TokenUsageSummary {
  current_month_total: number;
  current_week_total: number;
  today_total: number;
  quota: TokenQuota;
  tier: string;
  tier_name: string;
}

export async function getTokenUsageSummary(): Promise<TokenUsageSummary> {
  return apiRequest("/token-usage/summary");
}

export async function getTokenQuota(): Promise<TokenQuota> {
  return apiRequest("/token-usage/quota");
}

// ==================== 구독 관리 API ====================

export async function upgradeSubscription(tier: "FREE" | "PREMIUM"): Promise<void> {
  return apiRequest("/subscription/upgrade", {
    method: "POST",
    body: JSON.stringify({ tier }),
  });
}


/**
 * 사용자 AI 응답 선호도 저장
 */
export async function saveUserAIPreferences(preferences: UserAIPreferenceUpdate): Promise<UserAIPreference> {
  return apiRequest("/user/preferences", {
    method: "POST",
    body: JSON.stringify(preferences),
  });
}

// ============================================
// Metrics API
// ============================================

export interface MetricsOverview {
  total_conversations: number;
  total_messages: number;
  avg_messages_per_conversation: number;
  avg_response_time_ms: number | null;
  min_response_time_ms: number | null;
  max_response_time_ms: number | null;
  avg_input_tokens: number | null;
  avg_output_tokens: number | null;
  total_tokens_used: number;
  total_feedbacks: number;
  positive_feedbacks: number;
  negative_feedbacks: number;
  feedback_ratio: number;
  total_ratings: number;
  average_rating: number | null;
}

export interface DailyMetric {
  date: string;
  conversations: number;
  messages: number;
  avg_response_time_ms: number | null;
  positive_feedbacks: number;
  negative_feedbacks: number;
  avg_rating: number | null;
}

/**
 * 전체 메트릭 개요 조회
 */
export async function getMetricsOverview(): Promise<MetricsOverview> {
  return apiRequest("/metrics/overview");
}

/**
 * 일일 메트릭 조회
 */
export async function getDailyMetrics(days: number = 7): Promise<DailyMetric[]> {
  return apiRequest(`/metrics/daily?days=${days}`);
}
