import { Trophy, Plus } from "lucide-react";

interface ChallengeHeaderProps {
  onCreateClick: () => void;
}

export function ChallengeHeader({ onCreateClick }: ChallengeHeaderProps) {
  return (
    <div className="mb-10 animate-fade-in-down">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Title Section */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center shadow-sm border border-white/50">
            <span className="text-4xl">🏆</span>
          </div>
          <div>
            <h1 className="text-h2 font-bold text-neutral-900">챌린지</h1>
            <p className="text-body text-neutral-600 mt-1">
              작은 습관으로 만드는 큰 변화
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onCreateClick}
          className="
            flex items-center justify-center gap-2 px-6 py-3 
            bg-gradient-to-r from-primary-500 to-primary-600 
            text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 
            hover:shadow-primary-500/40 hover:-translate-y-0.5 
            transition-all duration-200
          "
        >
          <Plus className="w-5 h-5" />
          <span>새 챌린지 만들기</span>
        </button>
      </div>
    </div>
  );
}
