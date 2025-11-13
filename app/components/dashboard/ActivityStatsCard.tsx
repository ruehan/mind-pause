import type { ActivitySummary } from "../../lib/api";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ActivityStatsCardProps {
  summary: ActivitySummary;
}

export function ActivityStatsCard({ summary }: ActivityStatsCardProps) {
  const stats = [
    {
      category: "감정 기록",
      items: [
        {
          label: "전체 기록",
          value: summary.total_emotion_logs,
          unit: "회",
        },
        {
          label: "이번 주",
          value: summary.emotion_logs_this_week,
          unit: "회",
          trend: summary.emotion_logs_this_week > 0 ? "up" : null,
        },
        {
          label: "이번 달",
          value: summary.emotion_logs_this_month,
          unit: "회",
        },
      ],
    },
    {
      category: "커뮤니티",
      items: [
        {
          label: "작성한 게시글",
          value: summary.total_posts,
          unit: "개",
        },
        {
          label: "작성한 댓글",
          value: summary.total_comments,
          unit: "개",
        },
        {
          label: "받은 좋아요",
          value: summary.total_likes_received,
          unit: "개",
        },
      ],
    },
    {
      category: "챌린지",
      items: [
        {
          label: "진행 중",
          value: summary.active_challenges,
          unit: "개",
        },
        {
          label: "완료",
          value: summary.completed_challenges,
          unit: "개",
        },
        {
          label: "최고 연속 기록",
          value: summary.current_best_streak,
          unit: "일",
          highlight: summary.current_best_streak >= 7,
        },
      ],
    },
    {
      category: "AI 채팅",
      items: [
        {
          label: "전체 대화",
          value: summary.total_conversations,
          unit: "회",
        },
        {
          label: "이번 주",
          value: summary.conversations_this_week,
          unit: "회",
        },
      ],
    },
  ];

  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20">
      <h2 className="text-h4 text-neutral-900 mb-6 flex items-center gap-2">
        📊 활동 통계
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((category) => (
          <div key={category.category} className="space-y-3">
            <h3 className="text-body-sm font-semibold text-neutral-700 mb-2">
              {category.category}
            </h3>
            {category.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
              >
                <span className="text-body text-neutral-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-body font-semibold ${
                      item.highlight ? "text-primary-600" : "text-neutral-900"
                    }`}
                  >
                    {item.value}
                    {item.unit}
                  </span>
                  {item.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  )}
                  {item.trend === "down" && (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  {item.highlight && <span>🔥</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
