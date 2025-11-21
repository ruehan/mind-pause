import { FileText, MessageCircle, Trophy, TrendingUp, TrendingDown } from "lucide-react";

interface StatItemProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon: React.ElementType;
  color: "primary" | "lavender" | "mint" | "orange";
}

function StatItem({ title, value, trend, icon: Icon, color }: StatItemProps) {
  const colorStyles = {
    primary: "bg-primary-50 text-primary-600",
    lavender: "bg-lavender-50 text-lavender-600",
    mint: "bg-mint-50 text-mint-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-neutral-900">{value}</h3>
        {trend && (
          <p className="text-xs text-neutral-400 mt-2">
            {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}

interface OverviewStatsProps {
  summary: {
    total_emotion_logs: number;
    emotion_logs_this_week: number;
    total_conversations: number;
    conversations_this_week: number;
    completed_challenges: number;
    active_challenges: number;
  };
}

export function OverviewStats({ summary }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatItem
        title="이번 주 감정 기록"
        value={`${summary.emotion_logs_this_week}회`}
        trend={{ value: 12, label: "지난주 대비 증가", isPositive: true }}
        icon={FileText}
        color="primary"
      />
      <StatItem
        title="AI 대화"
        value={`${summary.total_conversations}회`}
        trend={{ value: 5, label: "지난주 대비 증가", isPositive: true }}
        icon={MessageCircle}
        color="lavender"
      />
      <StatItem
        title="완료한 챌린지"
        value={`${summary.completed_challenges}개`}
        trend={{ value: 2, label: "이번 달 달성", isPositive: true }}
        icon={Trophy}
        color="orange"
      />
    </div>
  );
}
