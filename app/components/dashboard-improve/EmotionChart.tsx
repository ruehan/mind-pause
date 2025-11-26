import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getEmotionTrend, type WeeklyEmotionTrend } from "~/lib/api";
import { Spinner } from "~/components/Spinner";

// 감정별 색상 매핑
const EMOTION_COLORS: Record<string, string> = {
  "기쁨": "#10B981",     // green
  "슬픔": "#3B82F6",     // blue
  "분노": "#EF4444",     // red
  "불안": "#F59E0B",     // amber
  "평온": "#8B5CF6",     // purple
  "우울": "#6B7280",     // gray
  "피곤": "#EC4899",     // pink
};

export function EmotionChart({ initialData }: { initialData?: WeeklyEmotionTrend }) {
  const [data, setData] = useState<WeeklyEmotionTrend | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [days, setDays] = useState(7);

  useEffect(() => {
    // 초기 데이터가 있고, 날짜 변경이 없는 경우 (기본값 7일) 패치 스킵
    if (initialData && days === 7 && !data) {
        setData(initialData);
        setLoading(false);
        return;
    }

    // 이미 데이터가 있고 날짜가 7일이면 스킵 (초기 로딩)
    if (initialData && days === 7 && data === initialData) {
        return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const trendData = await getEmotionTrend(days);
        setData(trendData);
      } catch (error) {
        console.error("Failed to load emotion trend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days, initialData]);

  // 차트용 데이터 변환 (날짜별로 그룹화)
  const chartData = data ? transformDataForChart(data) : [];

  // 차트에 표시될 감정 타입 목록
  const emotionTypes = data
    ? Array.from(new Set(data.data_points.map(d => d.emotion_type)))
    : [];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full">
        <div className="flex items-center justify-center h-64">
          <Spinner size="md" variant="breathing" />
        </div>
      </div>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-900">주간 감정 흐름</h3>
        </div>
        <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          <div className="text-center text-neutral-400">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">아직 감정 기록이 없습니다</p>
            <p className="text-xs mt-1">첫 감정 기록을 작성해보세요!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-neutral-900">주간 감정 흐름</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setDays(7)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              days === 7
                ? "bg-primary-100 text-primary-700 font-medium"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            7일
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              days === 30
                ? "bg-primary-100 text-primary-700 font-medium"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            30일
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#666", fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fill: "#666", fontSize: 12 }}
            domain={[0, 100]}
            label={{ value: "강도", angle: -90, position: "insideLeft", style: { fill: "#666" } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              });
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
          />
          {emotionTypes.map((emotion) => (
            <Line
              key={emotion}
              type="monotone"
              dataKey={emotion}
              stroke={EMOTION_COLORS[emotion] || "#6B7280"}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={emotion}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 차트용 데이터 변환 함수
function transformDataForChart(trendData: WeeklyEmotionTrend) {
  const dateMap: Record<string, any> = {};

  // 날짜별로 그룹화
  trendData.data_points.forEach((point) => {
    if (!dateMap[point.date]) {
      dateMap[point.date] = { date: point.date };
    }
    dateMap[point.date][point.emotion_type] = point.avg_intensity;
  });

  // 배열로 변환 및 날짜순 정렬
  return Object.values(dateMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}
