import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "~/components/dashboard-improve/DashboardLayout";
import { ChatLayout } from "~/components/chat-improve/ChatLayout";
import { ChatMessage } from "~/components/chat-improve/ChatMessage";
import { ChatInput } from "~/components/chat-improve/ChatInput";
import { ConversationList } from "~/components/chat-improve/ConversationList";
import { AICharacterSelector } from "~/components/chat-improve/AICharacterSelector";
import { AICharacterCreateModal } from "~/components/chat/AICharacterCreateModal";
import { AvatarPreview } from "~/components/chat/AvatarPreview";
import { Spinner } from "~/components/Spinner";
import { useToast } from "~/components/ToastProvider";
import { ConfirmDialog } from "~/components/ConfirmDialog";
import { useAuth } from "~/contexts/AuthContext";
import * as api from "~/lib/api";
import type { Route } from "./+types/chat";
import { Menu, X, Plus, Bot } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI 코치 - 마음쉼표" },
    { name: "description", content: "AI 코치와 대화하며 감정을 탐색하고 조언을 받으세요" },
  ];
}

export default function ChatImprove() {
  const toast = useToast();
  const { user } = useAuth();

  // Data States
  const [conversations, setConversations] = useState<api.Conversation[]>([]);
  const [messages, setMessages] = useState<api.Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<api.AICharacter | null>(null);

  // Loading States
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false); // Create modal
  const [isCharacterSelectorOpen, setIsCharacterSelectorOpen] = useState(false); // Select modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);

  // Streaming State
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load Active Character
  useEffect(() => {
    const checkCharacter = async () => {
      if (!user) return;
      try {
        const character = await api.getActiveAICharacter();
        setActiveCharacter(character);
      } catch (error) {
        if (error instanceof api.UnauthorizedError) return;
        setIsCharacterModalOpen(true); // Prompt to create if none exists
      } finally {
        setIsLoadingCharacter(false);
      }
    };
    checkCharacter();
  }, [user]);

  // 2. Load Conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user || !activeCharacter) return;
      try {
        setIsLoadingConversations(true);
        // Pass activeCharacter.id to filter on server side
        const convs = await api.getConversations(0, 20, activeCharacter.id);
        console.log(`[Chat] Loaded conversations for character ${activeCharacter.name} (${activeCharacter.id}):`, convs);
        setConversations(convs);
        
        // If no active conversation or active conversation not in list, select first one
        if (convs.length > 0) {
          if (!activeConversationId || !convs.find(c => c.id === activeConversationId)) {
            setActiveConversationId(convs[0].id);
          }
        } else {
          setActiveConversationId(null);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    loadConversations();
  }, [user, activeCharacter]);

  // 3. Load Messages
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
        console.error("Failed to load messages:", error);
        toast.error("오류", "메시지를 불러오지 못했습니다.");
      } finally {
        setIsLoadingMessages(false);
      }
    };
    loadMessages();
  }, [activeConversationId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Handlers
  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      toast.error("오류", "대화를 선택해주세요");
      return;
    }

    const userMessage: api.Message = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversationId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setStreamingMessage("");

    let accumulatedResponse = "";

    try {
      api.streamChatMessage(
        activeConversationId,
        content,
        (chunk) => {
          accumulatedResponse += chunk;
          setStreamingMessage(accumulatedResponse);
        },
        (messageId) => {
          const aiMessage: api.Message = {
            id: messageId,
            conversation_id: activeConversationId,
            role: "assistant",
            content: accumulatedResponse,
            created_at: new Date().toISOString(),
          };
          setMessages(prev => {
            const filtered = prev.filter(m => !m.id.startsWith("temp-"));
            return [...filtered, userMessage, aiMessage];
          });
          setStreamingMessage("");
          setIsTyping(false);
          setTypingMessageId(messageId);
          
          // Refresh conversations to update title/preview
          if (activeCharacter) {
            api.getConversations(0, 20, activeCharacter.id).then(convs => {
              console.log(`[Chat] Streaming complete. Updated conversations for ${activeCharacter.name}:`, convs);
              setConversations(convs);
            });
          }
        },
        (error) => {
          console.error("Streaming error:", error);
          toast.error("오류", "메시지 전송 중 오류가 발생했습니다");
          setIsTyping(false);
          setStreamingMessage("");
          setMessages(prev => prev.filter(m => !m.id.startsWith("temp-")));
        }
      );
    } catch (error) {
      console.error("Send error:", error);
      setIsTyping(false);
      setMessages(prev => prev.filter(m => !m.id.startsWith("temp-")));
    }
  };

  const handleNewConversation = async () => {
    if (!activeCharacter) return;
    try {
      const newConv = await api.createConversation({ character_id: activeCharacter.id });
      const convs = await api.getConversations(0, 20, activeCharacter.id);
      console.log(`[Chat] New conversation created. Updated list for ${activeCharacter.name}:`, convs);
      setConversations(convs);
      setActiveConversationId(newConv.id);
      setMessages([]);
      toast.success("새 대화", "새로운 대화가 시작되었습니다.");
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    } catch (error) {
      toast.error("오류", "대화를 생성하지 못했습니다.");
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConversationId) return;
    setIsDeletingConversation(true);
    try {
      await api.deleteConversation(activeConversationId);
      setConversations(prev => prev.filter(c => c.id !== activeConversationId));
      setActiveConversationId(null);
      setMessages([]);
      toast.success("삭제 완료", "대화가 삭제되었습니다.");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("오류", "삭제 중 문제가 발생했습니다.");
    } finally {
      setIsDeletingConversation(false);
    }
  };

  const handleCharacterSelect = async (character: api.AICharacter) => {
    try {
      // Update active character logic if needed, for now just set state and create new conv
      setActiveCharacter(character);
      setIsCharacterSelectorOpen(false);
      
      // Create new conversation with this character
      const newConv = await api.createConversation({ character_id: character.id });
      const convs = await api.getConversations(0, 20, character.id);
      console.log(`[Chat] Character selected (${character.name}). Loaded conversations:`, convs);
      setConversations(convs);
      setActiveConversationId(newConv.id);
      setMessages([]);
      toast.success("캐릭터 변경", `${character.name}와(과)의 대화가 시작되었습니다.`);
    } catch (error) {
      toast.error("오류", "캐릭터 변경 중 문제가 발생했습니다.");
    }
  };

  // Format timestamp helper
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (isLoadingCharacter) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Spinner size="xl" variant="breathing" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 flex relative overflow-hidden bg-neutral-50">
        
        {/* Sidebar (Desktop: Static, Mobile: Overlay) */}
        <div className={`
          fixed inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={(id) => {
              setActiveConversationId(id);
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            onDelete={(id) => {
              setActiveConversationId(id);
              setIsDeleteDialogOpen(true);
            }}
            onEditTitle={() => {}} // TODO: Implement
            onViewSummary={() => {}} // TODO: Implement
          />
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <ChatLayout>
            {/* Chat Header */}
            <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-white/20 shrink-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 overflow-hidden border border-primary-200">
                      {activeCharacter?.avatar_options ? (
                        <div className="w-full h-full">
                          <AvatarPreview options={activeCharacter.avatar_options} size={40} />
                        </div>
                      ) : (
                        <Bot className="w-6 h-6" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h2 className="font-bold text-neutral-900 flex items-center gap-2 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => setIsCharacterSelectorOpen(true)}>
                      {activeCharacter?.name || "AI 코치"}
                      <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full border border-primary-100">
                        변경
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-500">항상 당신의 편이에요</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNewConversation}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                title="새 대화 시작"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                  <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-bounce-subtle">
                    <span className="text-4xl">👋</span>
                  </div>
                  <h3 className="text-h3 font-bold text-neutral-900 mb-2">
                    안녕하세요, {user?.nickname}님!
                  </h3>
                  <p className="text-body text-neutral-600 max-w-md mb-8">
                    오늘 하루는 어떠셨나요? 힘든 일이 있었다면 저에게 털어놓으세요.
                    제가 들어드릴게요.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {["오늘 너무 피곤해...", "회사에서 실수를 했어", "그냥 위로가 필요해", "잠이 안 와"].map((text) => (
                      <button
                        key={text}
                        onClick={() => handleSendMessage(text)}
                        className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all text-left text-sm text-neutral-700"
                      >
                        "{text}"
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6 pb-4">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      role={msg.role === "assistant" ? "ai" : "user"}
                      content={msg.content}
                      timestamp={formatTime(msg.created_at)}
                      avatarOptions={msg.role === "assistant" ? activeCharacter?.avatar_options : undefined}
                      aiName={msg.role === "assistant" ? activeCharacter?.name : undefined}
                      userProfileImage={user?.profile_image_url}
                      shouldTypeEffect={msg.id === typingMessageId}
                      onTypingComplete={() => setTypingMessageId(null)}
                    />
                  ))}
                  
                  {isTyping && (
                    <ChatMessage
                      role="ai"
                      content={streamingMessage}
                      timestamp="작성 중..."
                      avatarOptions={activeCharacter?.avatar_options}
                      aiName={activeCharacter?.name}
                      userProfileImage={user?.profile_image_url}
                      isStreaming={true}
                    />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="shrink-0 z-20">
              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            </div>
          </ChatLayout>
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="대화 삭제"
        description="이 대화를 삭제하시겠습니까? 삭제된 내용은 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
        onConfirm={handleDeleteConversation}
        loading={isDeletingConversation}
      />

      {isCharacterSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-h3 font-bold text-neutral-900">AI 친구 선택</h3>
              <button 
                onClick={() => setIsCharacterSelectorOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-neutral-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
              <AICharacterSelector
                activeCharacterId={activeCharacter?.id}
                onSelect={handleCharacterSelect}
                onCreateNew={() => {
                  setIsCharacterSelectorOpen(false);
                  setIsCharacterModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <AICharacterCreateModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onSuccess={(character) => {
          handleCharacterSelect(character);
          setIsCharacterModalOpen(false);
        }}
      />
    </DashboardLayout>
  );
}
