import { useState, useEffect, useRef } from "react";
import { AppLayout } from "../components/AppLayout";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ActionSuggestionCard } from "../components/chat/ActionSuggestionCard";
import { ConversationListItem } from "../components/chat/ConversationListItem";
import { ChatInput } from "../components/chat/ChatInput";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { EmotionQuickSelect } from "../components/chat/EmotionQuickSelect";
import { AICharacterCreateModal } from "../components/chat/AICharacterCreateModal";
import { AvatarPreview } from "../components/chat/AvatarPreview";
import { Button } from "../components/Button";
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

  // AI 캐릭터 상태
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<api.AICharacter | null>(null);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);

  // 스트리밍 메시지 상태
  const [streamingMessage, setStreamingMessage] = useState<string>("");
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
    } catch (error) {
      toast.error("오류", "캐릭터를 불러오는 중 오류가 발생했습니다");
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

  // 메시지 로드
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
      } catch (error) {
        if (error instanceof api.UnauthorizedError) return;
        console.error("메시지 로드 오류:", error);
        toast.error("오류", "메시지를 불러오는 중 오류가 발생했습니다");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  // 메시지 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // 새 대화 생성
  const handleNewConversation = async () => {
    if (!activeCharacter) {
      toast.error("오류", "AI 캐릭터가 없습니다");
      return;
    }

    try {
      const newConv = await api.createConversation({
        character_id: activeCharacter.id,
      });

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessages([]);
      setIsConversationListOpen(false);
      toast.success("새 대화", "새 대화가 시작되었습니다");
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      toast.error("오류", "새 대화를 만드는 중 오류가 발생했습니다");
    }
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

  // 캐릭터 로딩 중이면 로딩 표시
  if (isLoadingCharacter) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
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
        <div className="flex-1 flex flex-col min-h-screen bg-neutral-50">
          {/* Chat Header */}
          <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
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
                    <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-body text-neutral-700 transition-colors">
                      세션 제목 수정
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-body text-neutral-700 transition-colors">
                      대화 요약 보기
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 text-body text-neutral-700 transition-colors">
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

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6">
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
              />
            ))}

            {/* 스트리밍 메시지 */}
            {streamingMessage && (
              <ChatMessage
                role="ai"
                content={streamingMessage}
                timestamp="지금"
              />
            )}

            {/* Typing Indicator */}
            {isTyping && !streamingMessage && <TypingIndicator />}

            {/* 메시지 자동 스크롤 위치 */}
            <div ref={messagesEndRef} />

            {/* Action Suggestion */}
            {messages.length > 0 && (
              <ActionSuggestionCard
                title="호흡 명상 5분"
                onClick={handleActionSuggestion}
              />
            )}

            {/* Suggested Questions */}
            <div className="mt-8 p-4 glass rounded-xl border border-primary-100">
              <p className="text-body font-medium text-neutral-800 mb-3 flex items-center gap-2">
                💡 이런 이야기를 해보시겠어요?
              </p>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleSendMessage("오늘 스트레스 관리 방법 알려줘")
                  }
                  className="w-full text-left px-4 py-2 rounded-lg bg-white/50 hover:bg-white transition-all text-body-sm text-neutral-700"
                >
                  • "오늘 스트레스 관리 방법 알려줘"
                </button>
                <button
                  onClick={() =>
                    handleSendMessage("불안할 때 어떻게 해야 할까?")
                  }
                  className="w-full text-left px-4 py-2 rounded-lg bg-white/50 hover:bg-white transition-all text-body-sm text-neutral-700"
                >
                  • "불안할 때 어떻게 해야 할까?"
                </button>
                <button
                  onClick={() =>
                    handleSendMessage("긍정적인 마음가짐 유지하는 방법")
                  }
                  className="w-full text-left px-4 py-2 rounded-lg bg-white/50 hover:bg-white transition-all text-body-sm text-neutral-700"
                >
                  • "긍정적인 마음가짐 유지하는 방법"
                </button>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <ChatInput
            onSend={handleSendMessage}
            onVoiceInput={handleVoiceInput}
          />
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
    </AppLayout>
  );
}
