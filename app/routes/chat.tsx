import { useState, useEffect, useRef } from "react";
import { AppLayout } from "../components/AppLayout";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ActionSuggestionCard } from "../components/chat/ActionSuggestionCard";
import { ConversationListItem } from "../components/chat/ConversationListItem";
import { ChatInput } from "../components/chat/ChatInput";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { EmotionQuickSelect } from "../components/chat/EmotionQuickSelect";
import { AICharacterCreateModal } from "../components/chat/AICharacterCreateModal";
import { AICharacterSelector } from "../components/chat/AICharacterSelector";
import { AvatarPreview } from "../components/chat/AvatarPreview";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import { useToast } from "../components/ToastProvider";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../lib/api";

export function meta() {
  return [
    { title: "AI 코치 - 마음쉼표" },
    {
      name: "description",
      content: "AI 코치와 대화하며 감정을 탐색하고 조언을 받으세요",
    },
  ];
}

// 시간 포맷 헬퍼 함수
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export default function Chat() {
  const toast = useToast();
  const { user } = useAuth();

  // 대화 및 메시지 상태
  const [conversations, setConversations] = useState<api.Conversation[]>([]);
  const [messages, setMessages] = useState<api.Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // UI 상태
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmotionSelect, setShowEmotionSelect] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);

  // 제목 수정 상태
  const [isEditTitleDialogOpen, setIsEditTitleDialogOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  // 요약 보기 상태
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);

  // AI 캐릭터 상태
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCharacterSelectorOpen, setIsCharacterSelectorOpen] = useState(false);
  const [isCreatingNewConversation, setIsCreatingNewConversation] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<api.AICharacter | null>(null);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);

  // 스트리밍 메시지 상태
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 활성 캐릭터 확인
  useEffect(() => {
    const checkCharacter = async () => {
      if (!user) return;

      try {
        const character = await api.getActiveAICharacter();
        setActiveCharacter(character);
      } catch (error) {
        if (error instanceof api.UnauthorizedError) {
          // 인증 오류는 AuthContext에서 처리
          return;
        }
        // 404 에러 (캐릭터 없음)는 정상적인 상황
        // 캐릭터 생성 모달을 표시
        setIsCharacterModalOpen(true);
      } finally {
        setIsLoadingCharacter(false);
      }
    };

    checkCharacter();
  }, [user]);

  const handleCharacterCreated = async () => {
    // 캐릭터 생성 후 활성 캐릭터 다시 불러오기
    try {
      const character = await api.getActiveAICharacter();
      setActiveCharacter(character);

      // 새 대화 생성 모드인 경우 새 대화 생성
      if (isCreatingNewConversation) {
        setIsCreatingNewConversation(false);
        const newConv = await api.createConversation({
          character_id: character.id,
        });
        const convs = await api.getConversations();
        setConversations(convs);
        setActiveConversationId(newConv.id);
        setMessages([]);
        toast.success("새 대화", `${character.name}와의 새 대화가 시작되었습니다`);
      }
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      toast.error("오류", "캐릭터를 불러오는 중 오류가 발생했습니다");
      setIsCreatingNewConversation(false);
    }
  };

  const handleCharacterSelected = async () => {
    try {
      const character = await api.getActiveAICharacter();
      setActiveCharacter(character);

      // 새 대화 생성 모드인 경우
      if (isCreatingNewConversation) {
        setIsCreatingNewConversation(false);
        // 선택된 캐릭터로 새 대화 생성
        const newConv = await api.createConversation({
          character_id: character.id,
        });
        const convs = await api.getConversations();
        setConversations(convs);
        setActiveConversationId(newConv.id);
        setMessages([]);
        toast.success("새 대화", `${character.name}와의 새 대화가 시작되었습니다`);
      } else {
        // 기존 방식: 캐릭터만 전환
        const convs = await api.getConversations();
        setConversations(convs);
        // 첫 번째 대화로 자동 이동
        if (convs.length > 0) {
          setActiveConversationId(convs[0].id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      toast.error("오류", "캐릭터를 불러오는 중 오류가 발생했습니다");
      setIsCreatingNewConversation(false);
    }
  };

  // 대화 목록 로드
  useEffect(() => {
    const loadConversations = async () => {
      if (!user || !activeCharacter) return;

      try {
        setIsLoadingConversations(true);
        const convs = await api.getConversations();
        setConversations(convs);

        // 첫 번째 대화 자동 선택
        if (convs.length > 0 && !activeConversationId) {
          setActiveConversationId(convs[0].id);
        }
      } catch (error) {
        if (error instanceof api.UnauthorizedError) return;
        console.error("대화 목록 로드 오류:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, [user, activeCharacter]);

  // 메시지 로드 및 캐릭터 자동 전환
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }

      try {
        setIsLoadingMessages(true);
        const msgs = await api.getMessages(activeConversationId);
        setMessages(msgs);

        // 대화의 캐릭터와 현재 활성 캐릭터가 다르면 자동 전환
        const currentConversation = conversations.find((c) => c.id === activeConversationId);
        if (currentConversation && activeCharacter && currentConversation.character_id !== activeCharacter.id) {
          console.log(`캐릭터 자동 전환: ${activeCharacter.name} → ${currentConversation.character?.name}`);
          try {
            await api.updateAICharacter(currentConversation.character_id, { is_active: true });
            const newCharacter = await api.getActiveAICharacter();
            setActiveCharacter(newCharacter);
            toast.success("캐릭터 전환", `${newCharacter.name}와의 대화로 전환되었습니다`);
          } catch (error) {
            console.error("캐릭터 전환 오류:", error);
          }
        }
      } catch (error) {
        if (error instanceof api.UnauthorizedError) return;
        console.error("메시지 로드 오류:", error);
        toast.error("오류", "메시지를 불러오는 중 오류가 발생했습니다");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  // 메시지 자동 스크롤 (throttle 적용)
  useEffect(() => {
    if (!messagesEndRef.current) return;

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // requestAnimationFrame으로 스크롤 최적화
    const rafId = requestAnimationFrame(scrollToBottom);

    return () => cancelAnimationFrame(rafId);
  }, [messages, streamingMessage]);

  // 새 대화 생성 - 캐릭터 선택 모달 표시
  const handleNewConversation = () => {
    setIsConversationListOpen(false);
    setIsCreatingNewConversation(true);
    setIsCharacterSelectorOpen(true);
  };

  // 메시지 전송 (스트리밍)
  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      toast.error("오류", "대화를 선택해주세요");
      return;
    }

    // 사용자 메시지 즉시 표시
    const userMessage: api.Message = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversationId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setStreamingMessage("");

    // 스트리밍 메시지를 누적할 로컬 변수
    let accumulatedResponse = "";

    try {
      api.streamChatMessage(
        activeConversationId,
        content,
        // onChunk: 청크 도착할 때마다
        (chunk) => {
          accumulatedResponse += chunk;
          setStreamingMessage(accumulatedResponse);
        },
        // onDone: 완료되면
        (messageId) => {
          // 스트리밍 메시지를 실제 메시지로 변환
          const aiMessage: api.Message = {
            id: messageId,
            conversation_id: activeConversationId,
            role: "assistant",
            content: accumulatedResponse,
            created_at: new Date().toISOString(),
          };

          setMessages((prev) => {
            // 임시 사용자 메시지 제거하고 실제 메시지들 추가
            const filtered = prev.filter((m) => !m.id.startsWith("temp-"));
            return [...filtered, userMessage, aiMessage];
          });

          setStreamingMessage("");
          setIsTyping(false);

          // 타이핑 효과를 위해 메시지 ID 설정
          setTypingMessageId(messageId);

          // 대화 목록 새로고침 (제목이 업데이트되었을 수 있음)
          api.getConversations().then((convs) => {
            setConversations(convs);
          });
        },
        // onError: 오류 발생 시
        (error) => {
          console.error("스트리밍 오류:", error);
          toast.error("오류", "메시지 전송 중 오류가 발생했습니다");
          setIsTyping(false);
          setStreamingMessage("");

          // 임시 메시지 제거
          setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
        }
      );
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      toast.error("오류", "메시지 전송 중 오류가 발생했습니다");
      setIsTyping(false);
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
    }
  };

  const handleActionSuggestion = () => {
    console.log("Starting action suggestion");
    // TODO: Navigate to activity
  };

  const handleEmotionSelect = (emotion: string) => {
    console.log("Selected emotion:", emotion);
    handleSendMessage(`오늘 기분: ${emotion}`);
    setShowEmotionSelect(false);
  };

  const handleVoiceInput = () => {
    console.log("Voice input started");
    // TODO: Implement voice recognition
  };

  const handleDeleteConversation = async () => {
    if (!activeConversationId) return;

    setIsDeletingConversation(true);
    try {
      await api.deleteConversation(activeConversationId);

      // 대화 목록에서 제거
      setConversations((prev) => prev.filter((c) => c.id !== activeConversationId));

      // 다른 대화 선택
      const remaining = conversations.filter((c) => c.id !== activeConversationId);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        setActiveConversationId(null);
        setMessages([]);
      }

      toast.success("대화 삭제", "대화가 성공적으로 삭제되었습니다");
      setIsDeleteDialogOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      toast.error("오류", "대화 삭제 중 오류가 발생했습니다");
    } finally {
      setIsDeletingConversation(false);
    }
  };

  // 제목 수정
  const handleEditTitle = () => {
    const currentConversation = conversations.find((c) => c.id === activeConversationId);
    if (currentConversation) {
      setEditingTitle(currentConversation.title || "");
      setIsEditTitleDialogOpen(true);
      setIsMenuOpen(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!activeConversationId || !editingTitle.trim()) return;
    setIsSavingTitle(true);
    try {
      console.log("제목 수정 시도:", activeConversationId, editingTitle.trim());
      await api.updateConversation(activeConversationId, { title: editingTitle.trim() });

      // 대화 목록 업데이트
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId ? { ...c, title: editingTitle.trim() } : c
        )
      );

      toast.success("제목 수정", "대화 제목이 수정되었습니다");
      setIsEditTitleDialogOpen(false);
    } catch (error) {
      console.error("제목 수정 오류:", error);
      if (error instanceof api.UnauthorizedError) return;

      // 에러 상세 정보 표시
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      toast.error("오류", `제목 수정 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsSavingTitle(false);
    }
  };

  // 요약 보기
  const handleViewSummary = async () => {
    if (!activeConversationId) return;
    setIsMenuOpen(false);
    setIsSummaryDialogOpen(true);
    setIsLoadingSummaries(true);

    try {
      console.log("요약 조회 시도:", activeConversationId);
      const data = await api.getConversationSummaries(activeConversationId);
      console.log("요약 조회 결과:", data);
      setSummaries(data.summaries || []);
    } catch (error) {
      console.error("요약 조회 오류:", error);
      if (error instanceof api.UnauthorizedError) return;

      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      toast.error("오류", `요약을 불러오는 중 오류가 발생했습니다: ${errorMessage}`);
      setIsSummaryDialogOpen(false);
    } finally {
      setIsLoadingSummaries(false);
    }
  };

  // 대화 기록 저장
  const handleSaveHistory = () => {
    if (!activeConversationId || messages.length === 0) return;
    setIsMenuOpen(false);

    const currentConversation = conversations.find((c) => c.id === activeConversationId);
    const title = currentConversation?.title || "대화 기록";

    // 텍스트 파일 생성
    let content = `${title}\n`;
    content += `저장 날짜: ${new Date().toLocaleString("ko-KR")}\n`;
    content += `총 메시지 수: ${messages.length}\n`;
    content += "=".repeat(50) + "\n\n";

    messages.forEach((msg) => {
      const role = msg.role === "user" ? "사용자" : activeCharacter?.name || "AI";
      const timestamp = new Date(msg.created_at).toLocaleString("ko-KR");
      content += `[${timestamp}] ${role}:\n${msg.content}\n\n`;
    });

    // 다운로드
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9가-힣 ]/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("저장 완료", "대화 기록이 저장되었습니다");
  };

  // 캐릭터 로딩 중이면 로딩 표시
  if (isLoadingCharacter) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" variant="breathing" className="mx-auto mb-4" />
            <p className="text-body text-neutral-600">AI 친구를 불러오는 중...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-full -mx-4 sm:-mx-6 lg:-mx-8 -my-6 relative">
        {/* Chat Area - Full Width */}
        <div className="flex-1 flex flex-col h-screen bg-neutral-50">
          {/* Chat Header - Fixed at top */}
          <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsConversationListOpen(true)}
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="대화 목록 열기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsCharacterSelectorOpen(true)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                aria-label="캐릭터 변경"
              >
                <h1 className="text-h4 text-neutral-900 flex items-center gap-3">
                  {activeCharacter ? (
                    <>
                      {activeCharacter.avatar_options && (
                        <AvatarPreview options={activeCharacter.avatar_options} size={40} />
                      )}
                      <span>{activeCharacter.name}와의 대화</span>
                    </>
                  ) : (
                    <>🤖 AI 코치와의 대화</>
                  )}
                </h1>
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-600 hover:text-neutral-900 p-2"
                aria-label="메뉴"
              >
                ⋮
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-12 w-56 bg-white shadow-lg rounded-lg border border-neutral-200 z-20">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-body text-neutral-700 transition-colors"
                      onClick={handleEditTitle}
                    >
                      세션 제목 수정
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-body text-neutral-700 transition-colors"
                      onClick={handleViewSummary}
                    >
                      대화 요약 보기
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-body text-neutral-700 transition-colors"
                      onClick={handleSaveHistory}
                    >
                      대화 기록 저장
                    </button>
                    <div className="border-t border-neutral-200" />
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-error-50 text-body text-error-500 transition-colors"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      대화 삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="대화를 삭제하시겠습니까?"
            description="삭제된 대화는 복구할 수 없습니다. 정말로 삭제하시겠습니까?"
            confirmText="삭제"
            cancelText="취소"
            variant="danger"
            onConfirm={handleDeleteConversation}
            loading={isDeletingConversation}
          />

          {/* 제목 수정 다이얼로그 */}
          {isEditTitleDialogOpen && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-h4 text-neutral-900 mb-4">대화 제목 수정</h3>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-body focus:outline-none focus:border-primary-500 mb-4"
                  placeholder="대화 제목을 입력하세요"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSavingTitle) {
                      handleSaveTitle();
                    }
                  }}
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setIsEditTitleDialogOpen(false)}
                    disabled={isSavingTitle}
                    className="px-4 py-2 text-body text-neutral-700 hover:text-neutral-900 transition-colors disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveTitle}
                    disabled={isSavingTitle || !editingTitle.trim()}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingTitle ? "저장 중..." : "저장"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 요약 보기 다이얼로그 */}
          {isSummaryDialogOpen && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-h4 text-neutral-900">대화 요약</h3>
                    <button
                      onClick={() => setIsSummaryDialogOpen(false)}
                      className="text-neutral-600 hover:text-neutral-900 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {isLoadingSummaries ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-body text-neutral-600">요약을 불러오는 중...</div>
                    </div>
                  ) : summaries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-body text-neutral-600">
                        아직 생성된 요약이 없습니다.
                      </p>
                      <p className="text-body-sm text-neutral-500 mt-2">
                        요약은 20개 메시지마다 자동으로 생성됩니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {summaries.map((summary, index) => (
                        <div
                          key={summary.id}
                          className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-body-sm font-medium text-primary-600">
                              요약 {index + 1}
                            </span>
                            <span className="text-caption text-neutral-500">
                              {summary.message_count}개 메시지
                            </span>
                          </div>
                          <p className="text-body text-neutral-800 whitespace-pre-wrap">
                            {summary.summary}
                          </p>
                          <div className="mt-2 text-caption text-neutral-500">
                            {new Date(summary.created_at).toLocaleString("ko-KR")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {/* 로딩 상태 */}
            {isLoadingMessages && (
              <div className="flex items-center justify-center py-8">
                <div className="text-body text-neutral-600">메시지를 불러오는 중...</div>
              </div>
            )}

            {/* 메시지가 없을 때 */}
            {!isLoadingMessages && messages.length === 0 && (
              <>
                {/* Emotion Quick Select */}
                {showEmotionSelect && (
                  <EmotionQuickSelect onSelect={handleEmotionSelect} />
                )}

                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-h4 text-neutral-900 mb-2">✨ 새로운 대화를 시작하세요</p>
                  <p className="text-body text-neutral-600">
                    {activeCharacter?.name}와 편하게 대화를 나눠보세요
                  </p>
                </div>
              </>
            )}

            {/* 메시지 목록 */}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role === "assistant" ? "ai" : "user"}
                content={msg.content}
                timestamp={formatMessageTime(msg.created_at)}
                avatarOptions={msg.role === "assistant" ? activeCharacter?.avatar_options : undefined}
                aiName={msg.role === "assistant" ? activeCharacter?.name : undefined}
                isStreaming={false}
                shouldTypeEffect={msg.id === typingMessageId}
                onTypingComplete={() => setTypingMessageId(null)}
                messageId={msg.role === "assistant" ? msg.id : undefined}
              />
            ))}

            {/* 스트리밍 중인 메시지 표시 */}
            {isTyping && streamingMessage && (
              <ChatMessage
                key="streaming"
                role="ai"
                content={streamingMessage}
                timestamp="지금"
                avatarOptions={activeCharacter?.avatar_options}
                aiName={activeCharacter?.name}
                isStreaming={true}
                shouldTypeEffect={false}
              />
            )}

            {/* Typing Indicator - 스트리밍 시작 직후에만 표시 */}
            {isTyping && !streamingMessage && (
              <TypingIndicator
                avatarOptions={activeCharacter?.avatar_options}
                aiName={activeCharacter?.name}
              />
            )}

            {/* 메시지 자동 스크롤 위치 */}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input - Fixed at bottom */}
          <div className="shrink-0">
            <ChatInput
              onSend={handleSendMessage}
              onVoiceInput={handleVoiceInput}
            />
          </div>
        </div>

        {/* Conversation List Sidebar - Toggle Overlay */}
        {isConversationListOpen && (
          <>
            {/* Overlay - 모바일에서만 표시 */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsConversationListOpen(false)}
            />
            <aside className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto shadow-elevation-3 animate-slide-in-right border-l border-neutral-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
                    💬 대화 목록
                  </h2>
                  <button
                    onClick={() => setIsConversationListOpen(false)}
                    className="text-neutral-600 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    aria-label="닫기"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full mb-4"
                  onClick={handleNewConversation}
                >
                  + 새 대화
                </Button>

                {/* 로딩 상태 */}
                {isLoadingConversations && (
                  <div className="text-center py-4 text-body text-neutral-600">
                    대화 목록을 불러오는 중...
                  </div>
                )}

                {/* 대화 목록 */}
                {!isLoadingConversations && conversations.length === 0 && (
                  <div className="text-center py-4 text-body text-neutral-600">
                    아직 대화가 없습니다
                  </div>
                )}

                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <ConversationListItem
                      key={conv.id}
                      id={conv.id}
                      title={conv.title || "새 대화"}
                      timestamp={formatTimestamp(conv.updated_at)}
                      isOngoing={conv.id === activeConversationId}
                      isActive={conv.id === activeConversationId}
                      characterName={conv.character?.name}
                      characterAvatar={conv.character?.avatar_options}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setIsConversationListOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* AI Character Create Modal */}
      <AICharacterCreateModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onSuccess={handleCharacterCreated}
      />

      {/* AI Character Selector */}
      <AICharacterSelector
        isOpen={isCharacterSelectorOpen}
        onClose={() => {
          setIsCharacterSelectorOpen(false);
          setIsCreatingNewConversation(false);
        }}
        currentCharacterId={activeCharacter?.id}
        onCharacterSelected={handleCharacterSelected}
        onCreateNew={() => setIsCharacterModalOpen(true)}
      />
    </AppLayout>
  );
}
