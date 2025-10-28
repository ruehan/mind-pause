import { Button } from "../Button";
import { Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface RecommendedChallengeCardProps {
  icon: LucideIcon;
  title: string;
  duration: string;
  participants: number;
  onStart: () => void;
}

export function RecommendedChallengeCard({
  icon: Icon,
  title,
  duration,
  participants,
  onStart,
}: RecommendedChallengeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center hover:shadow-md hover:scale-102 transition-all duration-200">
      {/* Icon */}
      <div className="mb-2 flex justify-center">
        <Icon className="w-10 h-10 text-primary-600" />
      </div>

      {/* Title */}
      <h4 className="text-base font-semibold text-neutral-800 mb-1">{title}</h4>

      {/* Duration */}
      <p className="text-sm text-neutral-600 mb-2">{duration}</p>

      {/* Participants */}
      <p className="text-xs text-primary-600 font-medium mb-3 flex items-center justify-center gap-1">
        <Flame className="w-3 h-3" />
        {participants}명 진행
      </p>

      {/* Start Button */}
      <Button variant="primary" size="sm" onClick={onStart} className="w-full">
        시작하기 →
      </Button>
    </div>
  );
}
