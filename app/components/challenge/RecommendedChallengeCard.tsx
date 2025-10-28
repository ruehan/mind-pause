import { Button } from "../Button";

interface RecommendedChallengeCardProps {
  icon: string;
  title: string;
  duration: string;
  participants: number;
  onStart: () => void;
}

export function RecommendedChallengeCard({
  icon,
  title,
  duration,
  participants,
  onStart,
}: RecommendedChallengeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 text-center hover:shadow-md hover:scale-102 transition-all duration-200">
      {/* Icon */}
      <div className="text-4xl mb-2">{icon}</div>

      {/* Title */}
      <h4 className="text-base font-semibold text-neutral-800 mb-1">{title}</h4>

      {/* Duration */}
      <p className="text-sm text-neutral-600 mb-2">{duration}</p>

      {/* Participants */}
      <p className="text-xs text-primary-600 font-medium mb-3">
        🔥 {participants}명 진행
      </p>

      {/* Start Button */}
      <Button variant="primary" size="sm" onClick={onStart} className="w-full">
        시작하기 →
      </Button>
    </div>
  );
}
