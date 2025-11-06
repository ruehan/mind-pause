import { CheckCircle, Calendar, MessageCircle } from "lucide-react";

interface TodayRecordCompleteProps {
  emotionValue: number;
  emotionLabel: string;
  emotionEmoji: string;
  note?: string;
  aiFeedback?: string;
  createdAt: string;
}

export function TodayRecordComplete({
  emotionValue,
  emotionLabel,
  emotionEmoji,
  note,
  aiFeedback,
  createdAt,
}: TodayRecordCompleteProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="glass-strong rounded-3xl shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 p-8 sm:p-10 border border-white/40">
      {/* Success Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
        <h2 className="text-h2 text-gradient-primary font-bold">오늘의 감정 기록 완료</h2>
      </div>

      {/* Completion Message */}
      <div className="text-center mb-8 p-6 bg-gradient-to-r from-emerald-50 via-mint-50 to-emerald-50 rounded-2xl border-2 border-emerald-200">
        <p className="text-h4 text-emerald-700 font-semibold mb-2">
          🎉 오늘의 기록을 완료했어요!
        </p>
        <p className="text-body text-emerald-600">
          내일 또 만나요. 오늘도 수고하셨어요!
        </p>
      </div>

      {/* Today's Record Summary */}
      <div className="space-y-6">
        {/* Time Badge */}
        <div className="flex items-center justify-center gap-2 text-body-sm text-neutral-600">
          <Calendar className="w-4 h-4" />
          <span>기록 시간: {formatTime(createdAt)}</span>
        </div>

        {/* Emotion Display */}
        <div className="flex items-center justify-center gap-6 p-8 bg-white/60 rounded-2xl border border-neutral-200">
          <span className="text-7xl">{emotionEmoji}</span>
          <div className="text-left">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-neutral-900">
                {emotionValue > 0 ? "+" : ""}
                {emotionValue}
              </span>
              <span className="text-h4 text-neutral-600">{emotionLabel}</span>
            </div>
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-body-sm rounded-full font-medium">
              {emotionValue >= 2 ? "긍정적인 하루" : emotionValue >= 0 ? "평온한 하루" : "힘든 하루"}
            </span>
          </div>
        </div>

        {/* User Note */}
        {note && (
          <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-neutral-600" />
              <p className="text-body font-semibold text-neutral-700">나의 기록</p>
            </div>
            <p className="text-body text-neutral-700 leading-relaxed italic">
              "{note}"
            </p>
          </div>
        )}

        {/* AI Feedback */}
        {aiFeedback && (
          <div className="bg-gradient-to-r from-primary-50 to-lavender-50 rounded-xl p-6 border-l-4 border-primary-500 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">✨</span>
              </div>
              <div className="flex-1">
                <p className="text-body font-semibold text-primary-700 mb-2">
                  AI 피드백
                </p>
                <p className="text-body text-neutral-700 leading-relaxed">
                  {aiFeedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="text-center p-6 bg-gradient-to-r from-lavender-50 to-mint-50 rounded-2xl border border-lavender-200">
          <p className="text-body text-neutral-700 leading-relaxed">
            💪 꾸준한 기록이 마음의 건강을 만듭니다<br />
            <span className="text-body-sm text-neutral-600">내일도 함께해요!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
