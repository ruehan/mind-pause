import { Trophy } from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
  isLocked: boolean;
}

export const defaultBadges: Badge[] = [
  {
    id: "1",
    name: "첫 시작",
    description: "첫 감정 기록을 남겼어요",
    icon: "🌱",
    earnedDate: "2024.01.15",
    isLocked: false,
  },
  {
    id: "2",
    name: "3일 연속",
    description: "3일 연속으로 기록했어요",
    icon: "🔥",
    earnedDate: "2024.01.18",
    isLocked: false,
  },
  {
    id: "3",
    name: "공감 요정",
    description: "커뮤니티에서 10개의 공감을 받았어요",
    icon: "🧚‍♀️",
    earnedDate: "2024.01.20",
    isLocked: false,
  },
  {
    id: "4",
    name: "챌린지 마스터",
    description: "첫 챌린지를 완료했어요",
    icon: "🏆",
    isLocked: true,
  },
  {
    id: "5",
    name: "소통왕",
    description: "댓글 50개를 작성했어요",
    icon: "👑",
    isLocked: true,
  },
];

interface BadgeShowcaseProps {
  badges: Badge[];
}

export function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="text-h4 font-bold text-neutral-900">나의 배지</h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`
              group relative flex flex-col items-center text-center p-3 rounded-xl transition-all duration-200
              ${badge.isLocked ? "opacity-50 grayscale" : "hover:bg-white hover:shadow-md"}
            `}
          >
            <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-200">
              {badge.icon}
            </div>
            <p className="text-xs font-bold text-neutral-900 mb-0.5">{badge.name}</p>
            {!badge.isLocked && (
              <p className="text-[10px] text-neutral-400">{badge.earnedDate}</p>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-neutral-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              {badge.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
