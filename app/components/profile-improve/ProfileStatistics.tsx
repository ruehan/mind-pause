import { BarChart3, Heart, MessageCircle, Trophy, Flame } from "lucide-react";

interface ProfileStatisticsProps {
  totalEmotionLogs: number;
  averageEmotionScore: number;
  challengeCompletionRate: number;
  communityLikes: number;
  communityComments: number;
  currentStreak: number;
}

export function ProfileStatistics({
  totalEmotionLogs,
  averageEmotionScore,
  challengeCompletionRate,
  communityLikes,
  communityComments,
  currentStreak,
}: ProfileStatisticsProps) {
  const stats = [
    {
      label: "감정 기록",
      value: totalEmotionLogs,
      suffix: "회",
      icon: BarChart3,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "연속 기록",
      value: currentStreak,
      suffix: "일",
      icon: Flame,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "챌린지 달성",
      value: challengeCompletionRate,
      suffix: "%",
      icon: Trophy,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "받은 공감",
      value: communityLikes,
      suffix: "개",
      icon: Heart,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-5 hover:shadow-md transition-all duration-200">
          <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <p className="text-caption text-neutral-500 mb-1">{stat.label}</p>
          <p className="text-h3 font-bold text-neutral-900">
            {stat.value}
            <span className="text-sm font-normal text-neutral-400 ml-1">{stat.suffix}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
