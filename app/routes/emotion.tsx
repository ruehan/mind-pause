import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { EmotionLogForm } from "../components/emotion/EmotionLogForm";
import { EmotionHistoryCard } from "../components/emotion/EmotionHistoryCard";

export function meta() {
  return [
    { title: "감정 기록 - 마음쉼표" },
    {
      name: "description",
      content: "오늘의 감정을 기록하고 나의 마음을 들여다보세요",
    },
  ];
}

// Mock data for history (TODO: fetch from API)
const mockHistory = [
  {
    id: 1,
    date: "2024년 1월 15일",
    day: "월",
    emotionValue: 3,
    emotionLabel: "꽤 좋음",
    emotionEmoji: "😄",
    note: "오늘은 팀 프로젝트가 성공적으로 마무리되어서 기분이 정말 좋았어요!",
    aiFeedback: "긍정적인 성과를 이루셨네요! 이런 순간들이 앞으로의 동기부여가 됩니다.",
  },
  {
    id: 2,
    date: "2024년 1월 14일",
    day: "일",
    emotionValue: 0,
    emotionLabel: "보통",
    emotionEmoji: "😐",
    note: "특별한 일은 없었지만 편안한 하루였어요.",
    aiFeedback: "평온한 하루를 보내셨군요. 때로는 이런 고요함도 소중합니다.",
  },
  {
    id: 3,
    date: "2024년 1월 13일",
    day: "토",
    emotionValue: -2,
    emotionLabel: "약간 안좋음",
    emotionEmoji: "😕",
    note: "가족과의 갈등이 있어서 마음이 힘들었어요.",
    aiFeedback: "관계에서 오는 어려움은 누구나 겪게 됩니다. 시간을 두고 대화해보는 것은 어떨까요?",
  },
];

export default function EmotionLog() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-lavender-50 relative">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 gradient-mesh opacity-20 animate-gradient bg-[length:200%_200%] pointer-events-none"></div>
      <div className="relative z-10">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">📊</span>
            <h1 className="text-h2 text-neutral-900">감정 기록</h1>
          </div>
          <p className="text-body text-neutral-600">
            오늘의 감정을 기록하고 나의 마음을 들여다보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Emotion Log Form */}
          <div className="lg:col-span-2">
            <EmotionLogForm />
          </div>

          {/* Right: History Summary (Desktop) */}
          <div className="hidden lg:block">
            <div className="glass-strong rounded-2xl shadow-soft hover:shadow-primary transition-all duration-300 p-6 sticky top-24 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📈</span>
                <h3 className="text-h4 text-neutral-900">최근 기록</h3>
              </div>

              {/* Weekly Calendar Mini */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => (
                  <div
                    key={day}
                    className="text-center p-2 rounded-lg bg-neutral-100"
                  >
                    <div className="text-caption text-neutral-500 mb-1">
                      {day}
                    </div>
                    <div className="text-2xl">{index % 2 === 0 ? "😊" : "😐"}</div>
                  </div>
                ))}
              </div>

              <p className="text-body-sm text-neutral-600 text-center">
                이번 주 평균 감정: <span className="font-bold text-mint-600">+1.5</span>
              </p>
            </div>
          </div>
        </div>

        {/* Emotion History */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">📅</span>
            <h2 className="text-h3 text-neutral-900">감정 기록 히스토리</h2>
          </div>

          <div className="space-y-4">
            {mockHistory.map((item) => (
              <EmotionHistoryCard
                key={item.id}
                date={item.date}
                day={item.day}
                emotionValue={item.emotionValue}
                emotionLabel={item.emotionLabel}
                emotionEmoji={item.emotionEmoji}
                note={item.note}
                aiFeedback={item.aiFeedback}
                onEdit={() => console.log("Edit", item.id)}
              />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button className="text-body text-primary-600 hover:text-primary-700 font-medium transition-colors">
              더보기 →
            </button>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
