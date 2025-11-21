import { EmotionHistoryCard } from "../emotion/EmotionHistoryCard"; // Reuse existing card for now, can be improved later
import { Button } from "../Button";

interface EmotionLog {
  id: string;
  created_at: string;
  emotion_value: number;
  emotion_label: string;
  emotion_emoji: string;
  note?: string;
  ai_feedback?: string;
}

interface EmotionHistoryProps {
  logs: EmotionLog[];
  onLoadMore: () => void;
  isLoading?: boolean;
}

export function EmotionHistory({ logs, onLoadMore, isLoading }: EmotionHistoryProps) {
  // Group logs by date
  const groupLogsByDate = (logs: EmotionLog[]) => {
    const groups: { [key: string]: EmotionLog[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    logs.forEach((log) => {
      const logDate = new Date(log.created_at);
      logDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - logDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let groupKey = "";
      if (diffDays === 0) {
        groupKey = "오늘";
      } else if (diffDays === 1) {
        groupKey = "어제";
      } else if (diffDays < 7) {
        groupKey = "이번 주";
      } else if (diffDays < 14) {
        groupKey = "지난주";
      } else if (diffDays < 30) {
        groupKey = "이번 달";
      } else {
        const month = logDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
        groupKey = month;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(log);
    });

    return groups;
  };

  const groupedLogs = groupLogsByDate(logs);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return {
      date: date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
      day: weekday
    };
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-20 glass rounded-3xl border border-dashed border-neutral-300">
        <span className="text-6xl mb-6 block animate-bounce-slow">📝</span>
        <p className="text-h4 text-neutral-800 font-bold mb-2">
          아직 감정 기록이 없습니다
        </p>
        <p className="text-body text-neutral-500">
          오늘의 첫 기록을 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.entries(groupedLogs).map(([groupName, groupLogs]) => (
        <div key={groupName} className="relative">
          {/* Group Header */}
          <div className="sticky top-20 z-10 mb-8 pb-4 border-b border-neutral-200/80 bg-neutral-50/95 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-primary-400 to-lavender-400 rounded-full"></div>
              <h3 className="text-h3 font-bold text-neutral-800">{groupName}</h3>
            </div>
            <span className="px-3 py-1 bg-white text-neutral-500 rounded-full text-caption font-medium border border-neutral-200 shadow-sm">
              {groupLogs.length}개의 기록
            </span>
          </div>

          {/* Timeline */}
          <div className="relative ml-4 sm:ml-8 space-y-8 border-l-2 border-neutral-200 pl-8 sm:pl-10 pb-4">
            {groupLogs.map((log, index) => {
              const { date, day } = formatDate(log.created_at);
              return (
                <div
                  key={log.id}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[45px] sm:-left-[53px] top-6 w-4 h-4 bg-white rounded-full border-4 border-primary-300 shadow-sm z-10"></div>

                  <EmotionHistoryCard
                    date={date}
                    day={day}
                    emotionValue={log.emotion_value}
                    emotionLabel={log.emotion_label}
                    emotionEmoji={log.emotion_emoji}
                    note={log.note || ""}
                    aiFeedback={log.ai_feedback || ""}
                    onEdit={() => console.log("Edit", log.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Load More Button */}
      <div className="text-center pt-8">
        <Button
          variant="secondary"
          size="lg"
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-12 h-14 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-primary-200 text-neutral-600 hover:text-primary-600 transition-all"
        >
          {isLoading ? "불러오는 중..." : "더 많은 기록 보기"}
        </Button>
      </div>
    </div>
  );
}
