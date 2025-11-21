import { CheckCircle, Quote } from "lucide-react";

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
  const date = new Date(createdAt);
  const timeString = date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="glass-strong rounded-3xl p-8 sm:p-10 shadow-xl border border-white/60 relative overflow-hidden">
      {/* Success Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-success-50/50 to-transparent opacity-50"></div>
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-success-100/40 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-bounce-subtle">
          <CheckCircle className="w-10 h-10 text-success-500" />
        </div>

        <h2 className="text-h2 font-bold text-neutral-900 mb-2">
          오늘의 감정 기록 완료!
        </h2>
        <p className="text-body text-neutral-500 mb-8">
          {timeString}에 기록되었습니다.
        </p>

        {/* Emotion Card */}
        <div className="w-full max-w-md bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm mb-8 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl filter drop-shadow-sm">{emotionEmoji}</span>
            <div className="text-left">
              <p className="text-caption text-neutral-500 font-medium mb-1">오늘의 기분</p>
              <div className="flex items-center gap-2">
                <span className={`text-h3 font-bold ${
                  emotionValue > 0 ? "text-success-600" : emotionValue < 0 ? "text-error-500" : "text-neutral-600"
                }`}>
                  {emotionLabel}
                </span>
                <span className="px-2 py-0.5 bg-neutral-100 rounded-md text-caption font-bold text-neutral-600">
                  {emotionValue > 0 ? "+" : ""}{emotionValue}
                </span>
              </div>
            </div>
          </div>

          {note && (
            <div className="bg-neutral-50 rounded-xl p-4 text-left relative">
              <Quote className="w-4 h-4 text-neutral-400 absolute top-3 left-3" />
              <p className="text-body text-neutral-700 pl-6 italic">
                "{note}"
              </p>
            </div>
          )}
        </div>

        {/* AI Feedback */}
        {aiFeedback && (
          <div className="w-full max-w-2xl bg-gradient-to-br from-primary-50 via-white to-lavender-50 rounded-2xl p-6 sm:p-8 border border-primary-100 shadow-md relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-lavender-400 rounded-t-2xl"></div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="text-left">
                <h3 className="text-h4 font-bold text-primary-800 mb-2">AI 마음 코치의 한마디</h3>
                <p className="text-body text-neutral-700 leading-relaxed">
                  {aiFeedback}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
