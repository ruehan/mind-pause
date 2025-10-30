import { useEffect } from "react";
import { X, Sparkles, Heart } from "lucide-react";
import { Button } from "../Button";

interface ImmediateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  emotionValue: number;
  feedback: string;
}

export function ImmediateFeedbackModal({
  isOpen,
  onClose,
  emotionValue,
  feedback,
}: ImmediateFeedbackModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
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
        <div className="glass-strong rounded-2xl shadow-elevation-3 p-6 sm:p-8 max-w-md w-full animate-scale-in border border-white/20">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-mint-500 flex items-center justify-center animate-bounce">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <Heart className="w-6 h-6 text-error-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-h3 text-center text-neutral-900 mb-2 font-bold">
            감정 기록 완료!
          </h3>

          {/* Emotion value */}
          <div className="text-center mb-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                emotionValue > 0
                  ? "bg-mint-500"
                  : emotionValue < 0
                  ? "bg-error-500"
                  : "bg-neutral-500"
              }`}
            >
              오늘의 감정: {emotionValue > 0 ? "+" : ""}
              {emotionValue}
            </span>
          </div>

          {/* AI Feedback */}
          <div className="bg-primary-50 rounded-xl p-4 mb-6 border-l-4 border-primary-500">
            <p className="text-label font-medium text-primary-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI 피드백
            </p>
            <p className="text-body text-neutral-700 leading-relaxed">
              {feedback}
            </p>
          </div>

          {/* Encouragement */}
          <div className="text-center mb-6">
            <p className="text-body-sm text-neutral-600">
              자신의 감정을 인식하는 것은 정신건강의 첫걸음입니다.
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
    </>
  );
}
