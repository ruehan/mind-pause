import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { EmotionLogForm } from "../components/emotion/EmotionLogForm";
import { EmotionHistoryCard } from "../components/emotion/EmotionHistoryCard";
import { WeeklyEmotionCalendar } from "../components/emotion/WeeklyEmotionCalendar";
import { MonthlyEmotionChart } from "../components/emotion/MonthlyEmotionChart";

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

// Mock data for weekly calendar
const mockWeekData = [
  { day: "월", emoji: "😊", value: 2, hasRecord: true },
  { day: "화", emoji: "😄", value: 3, hasRecord: true },
  { day: "수", emoji: "😐", value: 0, hasRecord: true },
  { day: "목", emoji: "😕", value: -2, hasRecord: true },
  { day: "금", emoji: "🙂", value: 1, hasRecord: true },
  { day: "토", emoji: "😊", value: 2, hasRecord: true },
  { day: "일", emoji: "😐", value: 0, hasRecord: false },
];

// Mock data for monthly chart
const mockMonthData = [
  { date: "1/1", value: 1 },
  { date: "1/2", value: 2 },
  { date: "1/3", value: 0 },
  { date: "1/4", value: -1 },
  { date: "1/5", value: -2 },
  { date: "1/6", value: 0 },
  { date: "1/7", value: 1 },
  { date: "1/8", value: 3 },
  { date: "1/9", value: 2 },
  { date: "1/10", value: 1 },
  { date: "1/11", value: 0 },
  { date: "1/12", value: -1 },
  { date: "1/13", value: -2 },
  { date: "1/14", value: 0 },
  { date: "1/15", value: 3 },
  { date: "1/16", value: 2 },
  { date: "1/17", value: 1 },
  { date: "1/18", value: 2 },
  { date: "1/19", value: 3 },
  { date: "1/20", value: 2 },
  { date: "1/21", value: 1 },
  { date: "1/22", value: 0 },
  { date: "1/23", value: -1 },
  { date: "1/24", value: 1 },
  { date: "1/25", value: 2 },
  { date: "1/26", value: 3 },
  { date: "1/27", value: 2 },
  { date: "1/28", value: 1 },
  { date: "1/29", value: 0 },
  { date: "1/30", value: 2 },
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

        {/* Weekly Calendar - Compact View */}
        <div className="max-w-4xl mx-auto mb-8">
          <WeeklyEmotionCalendar
            weekData={mockWeekData}
            averageValue={1.0}
          />
        </div>

        {/* Emotion Log Form - Centered */}
        <div className="max-w-4xl mx-auto mb-12">
          <EmotionLogForm />
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Monthly Chart */}
          <div>
            <MonthlyEmotionChart data={mockMonthData} title="월간 감정 추이" />
          </div>

          {/* Quick Stats Placeholder */}
          <div className="glass-strong rounded-2xl shadow-soft p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h3 className="text-h4 text-neutral-900">감정 통계</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-mint-50 to-mint-100 rounded-lg">
                <p className="text-body-sm text-neutral-600 mb-1">이번 달 평균</p>
                <p className="text-h3 font-bold text-mint-600">+1.8</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-primary-50 to-lavender-50 rounded-lg">
                <p className="text-body-sm text-neutral-600 mb-1">연속 기록일</p>
                <p className="text-h3 font-bold text-primary-600">7일 🔥</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-lg">
                <p className="text-body-sm text-neutral-600 mb-1">총 기록 수</p>
                <p className="text-h3 font-bold text-neutral-700">24회</p>
              </div>
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
