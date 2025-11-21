import { MessageSquare, Search, MoreVertical, Trash2, Edit2, FileText } from "lucide-react";
import { useState } from "react";
import type { Conversation } from "~/lib/api";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEditTitle: (id: string) => void;
  onViewSummary: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onEditTitle,
  onViewSummary,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filteredConversations = conversations.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const groupedConversations = filteredConversations.reduce((groups, conversation) => {
    const date = new Date(conversation.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(conversation);
    return groups;
  }, {} as Record<string, Conversation[]>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedConversations).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "오늘";
    if (date.toDateString() === yesterday.toDateString()) return "어제";
    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200 w-80">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100">
        <h2 className="text-h4 font-bold text-neutral-900 mb-4 px-2">대화 목록</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="대화 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {conversations.length === 0 ? (
          <div className="text-center py-10 text-neutral-500">
            <p>대화 내역이 없습니다.</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date}>
              <h3 className="text-caption font-bold text-neutral-400 px-3 mb-2">
                {getDateLabel(date)}
              </h3>
              <div className="space-y-1">
                {groupedConversations[date].map(conv => (
                  <div
                    key={conv.id}
                    className={`
                      group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                      ${activeId === conv.id 
                        ? "bg-primary-50 text-primary-900 shadow-sm" 
                        : "hover:bg-neutral-50 text-neutral-700"
                      }
                    `}
                    onClick={() => onSelect(conv.id)}
                  >
                    <MessageSquare className={`w-5 h-5 flex-shrink-0 ${activeId === conv.id ? "text-primary-600" : "text-neutral-400"}`} />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium truncate">
                        {conv.title || "새로운 대화"}
                      </p>
                      <p className="text-caption text-neutral-500 truncate">
                        {new Date(conv.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {/* Context Menu Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                      }}
                      className={`
                        p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                        ${activeId === conv.id ? "hover:bg-primary-100 text-primary-600" : "hover:bg-neutral-200 text-neutral-500"}
                        ${menuOpenId === conv.id ? "opacity-100 bg-neutral-200" : ""}
                      `}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Context Menu */}
                    {menuOpenId === conv.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(null);
                          }} 
                        />
                        <div className="absolute right-2 top-10 w-40 bg-white rounded-xl shadow-lg border border-neutral-100 z-20 overflow-hidden animate-scale-in">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTitle(conv.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            이름 변경
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewSummary(conv.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            요약 보기
                          </button>
                          <div className="h-px bg-neutral-100 my-1" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(conv.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
