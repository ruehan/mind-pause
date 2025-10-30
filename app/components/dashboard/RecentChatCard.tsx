import { MessageCircle, Calendar } from "lucide-react";

interface ChatSummary {
  id: string;
  title: string;
  summary: string;
  date: string;
  emotionChange?: string;
}

interface RecentChatCardProps {
  chats: ChatSummary[];
  onViewAll?: () => void;
}

export function RecentChatCard({ chats, onViewAll }: RecentChatCardProps) {
  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary-600 animate-float" />
          최근 AI 대화
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            전체보기 →
          </button>
        )}
      </div>

      <div className="space-y-3">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-body font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {chat.title}
              </h3>
              {chat.emotionChange && (
                <span className="text-body-sm text-mint-600 font-medium">
                  {chat.emotionChange}
                </span>
              )}
            </div>
            <p className="text-body-sm text-neutral-600 mb-2 line-clamp-2">
              {chat.summary}
            </p>
            <div className="flex items-center gap-1 text-body-xs text-neutral-500">
              <Calendar className="w-3 h-3" />
              {chat.date}
            </div>
          </div>
        ))}
      </div>

      {chats.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-body text-neutral-500">
            아직 AI와 대화를 나누지 않으셨어요
          </p>
          <button className="mt-3 text-body-sm text-primary-600 hover:text-primary-700 font-medium">
            대화 시작하기 →
          </button>
        </div>
      )}
    </div>
  );
}
