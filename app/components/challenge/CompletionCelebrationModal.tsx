import { useEffect } from "react";
import { X, CheckCircle, Sparkles, Trophy, Flame } from "lucide-react";
import { Button } from "../Button";

interface CompletionCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeTitle: string;
  streakCount?: number;
  newBadge?: {
    name: string;
    description: string;
  };
}

export function CompletionCelebrationModal({
  isOpen,
  onClose,
  challengeTitle,
  streakCount,
  newBadge,
}: CompletionCelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Confetti animation (simple CSS-based)
      const timer = setTimeout(() => {
        // Auto-close after celebration
      }, 3000);

      return () => {
        document.body.style.overflow = "unset";
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-strong rounded-2xl shadow-elevation-3 p-6 sm:p-8 max-w-md w-full animate-scale-in border border-white/20 relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-mint-50 via-primary-50 to-lavender-50 opacity-50 animate-gradient bg-[length:200%_200%]"></div>

          <div className="relative z-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon with Animation */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-mint-400 to-mint-600 flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                </div>
                <Sparkles className="w-8 h-8 text-accent-500 absolute -top-2 -right-2 animate-pulse" />
                <Sparkles className="w-6 h-6 text-primary-500 absolute -bottom-1 -left-1 animate-pulse" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-h2 text-center text-neutral-900 mb-2 font-bold">
              완료! 🎉
            </h3>

            {/* Challenge Name */}
            <p className="text-body text-center text-neutral-700 mb-4">
              <span className="font-semibold text-primary-600">{challengeTitle}</span>을(를) 완료했어요!
            </p>

            {/* Streak Info */}
            {streakCount && streakCount > 0 && (
              <div className="bg-gradient-to-r from-accent-50 to-error-50 rounded-xl p-4 mb-4 border-l-4 border-accent-500">
                <div className="flex items-center justify-center gap-2">
                  <Flame className="w-6 h-6 text-accent-500 animate-pulse" />
                  <p className="text-body font-bold text-neutral-800">
                    {streakCount}일 연속 달성!
                  </p>
                </div>
                <p className="text-body-sm text-neutral-600 text-center mt-1">
                  {streakCount < 7 && "멋진 시작이에요! 계속 진행해보세요 💪"}
                  {streakCount >= 7 && streakCount < 14 && "일주일 연속! 정말 대단해요! 🌟"}
                  {streakCount >= 14 && streakCount < 30 && "2주 연속! 습관이 되어가고 있어요! 🔥"}
                  {streakCount >= 30 && "한 달 연속! 챌린지 마스터! 👑"}
                </p>
              </div>
            )}

            {/* New Badge */}
            {newBadge && (
              <div className="bg-gradient-to-br from-primary-50 to-lavender-50 rounded-xl p-4 mb-4 border border-primary-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center animate-bounce">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-primary-700">
                      새로운 배지 획득!
                    </p>
                    <p className="text-body font-bold text-neutral-800">{newBadge.name}</p>
                    <p className="text-caption text-neutral-600">{newBadge.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Encouragement */}
            <div className="text-center mb-6">
              <p className="text-body text-neutral-700 leading-relaxed">
                작은 실천이 모여 큰 변화를 만들어요.
                <br />
                오늘도 잘 하셨어요! 👏
              </p>
            </div>

            {/* Action Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={onClose}
              className="w-full"
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
