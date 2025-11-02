import { useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ActionSuggestionCard } from "../components/chat/ActionSuggestionCard";
import { ConversationListItem } from "../components/chat/ConversationListItem";
import { ChatInput } from "../components/chat/ChatInput";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { EmotionQuickSelect } from "../components/chat/EmotionQuickSelect";
import { Button } from "../components/Button";
import { useToast } from "../components/ToastProvider";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function meta() {
  return [
    { title: "AI 코치 - 마음쉼표" },
    {
      name: "description",
      content: "AI 코치와 대화하며 감정을 탐색하고 조언을 받으세요",
    },
  ];
}

// Mock data
const mockConversations = [
  {
    id: "1",
    title: "오늘의 감정 상담",
    timestamp: "15분 전",
    isOngoing: true,
  },
  {
    id: "2",
    title: "어제의 고민",
    timestamp: "1일 전",
    isOngoing: false,
  },
  {
    id: "3",
    title: "불안감 대화",
    timestamp: "3일 전",
    isOngoing: false,
  },
  {
    id: "4",
    title: "스트레스 관리",
    timestamp: "1주 전",
    isOngoing: false,
  },
];

const mockMessages = [
  {
    id: "1",
    role: "ai" as const,
    content: "안녕하세요! 오늘 하루는 어떠셨나요?\n편하게 이야기해주세요 😊",
    timestamp: "14:32",
  },
  {
    id: "2",
    role: "user" as const,
    content: "오늘은 회사에서 실수를 했어요. 계속 마음에 걸려요 😢",
    timestamp: "14:33",
  },
  {
    id: "3",
    role: "ai" as const,
    content:
      "실수는 누구나 하는 것이에요. 자책하기보다는 그 경험에서 배울 점을 찾아보는 건 어떨까요? 실수를 통해 성장할 수 있답니다.",
    timestamp: "14:33",
  },
];

const mockSuggestion = {
  title: "호흡 명상 5분",
};

export default function Chat() {
  const toast = useToast();
  const [activeConversation, setActiveConversation] = useState("1");
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmotionSelect, setShowEmotionSelect] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    setIsTyping(true);
    // Simulate AI typing
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    // TODO: API call to send message
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
    setIsDeletingConversation(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Deleting conversation:", activeConversation);
      toast.success("대화가 삭제되었습니다", "대화 내역이 영구적으로 삭제되었습니다");
      setIsDeleteDialogOpen(false);
      setIsMenuOpen(false);
      // TODO: Update conversation list and navigate
    } catch (error) {
      toast.error("삭제 실패", "대화 삭제 중 오류가 발생했습니다");
    } finally {
      setIsDeletingConversation(false);
    }
  };

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
              <h1 className="text-h4 text-neutral-900 flex items-center gap-2">
                🤖 AI 코치와의 대화
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
            {/* Emotion Quick Select */}
            {showEmotionSelect && (
              <EmotionQuickSelect onSelect={handleEmotionSelect} />
            )}

            {mockMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}

            {/* Action Suggestion */}
            <ActionSuggestionCard
              title={mockSuggestion.title}
              onClick={handleActionSuggestion}
            />

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
                  onClick={() => console.log("New conversation")}
                >
                  + 새 대화
                </Button>

                <div className="space-y-2">
                  {mockConversations.map((conv) => (
                    <ConversationListItem
                      key={conv.id}
                      id={conv.id}
                      title={conv.title}
                      timestamp={conv.timestamp}
                      isOngoing={conv.isOngoing}
                      isActive={activeConversation === conv.id}
                      onClick={() => {
                        setActiveConversation(conv.id);
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
    </AppLayout>
  );
}
