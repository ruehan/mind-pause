import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ActionSuggestionCard } from "../components/chat/ActionSuggestionCard";
import { ConversationListItem } from "../components/chat/ConversationListItem";
import { ChatInput } from "../components/chat/ChatInput";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { EmotionQuickSelect } from "../components/chat/EmotionQuickSelect";
import { Button } from "../components/Button";

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
  const [activeConversation, setActiveConversation] = useState("1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmotionSelect, setShowEmotionSelect] = useState(true);

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

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 bg-neutral-50 border-r border-neutral-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
                💬 대화 목록
              </h2>
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
                  onClick={() => setActiveConversation(conv.id)}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
                    💬 대화 목록
                  </h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    ✕
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
                        setIsSidebarOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-neutral-600 hover:text-neutral-900"
              >
                ☰
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
                    <button className="w-full text-left px-4 py-3 hover:bg-error-50 text-body text-error-500 transition-colors">
                      대화 삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

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
      </main>

      <Footer />
    </div>
  );
}
