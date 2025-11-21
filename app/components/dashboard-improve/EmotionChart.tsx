import { BarChart3 } from "lucide-react";

export function EmotionChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-neutral-900">주간 감정 흐름</h3>
        <button className="text-sm text-neutral-500 hover:text-neutral-900">
          자세히 보기
        </button>
      </div>
      
      {/* Placeholder for Chart */}
      <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
        <div className="text-center text-neutral-400">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">차트 데이터 준비 중...</p>
        </div>
      </div>
    </div>
  );
}
