import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { EmotionLogForm } from "../components/emotion/EmotionLogForm";
import { TodayRecordComplete } from "../components/emotion/TodayRecordComplete";
import { EmotionHistoryCard } from "../components/emotion/EmotionHistoryCard";
import { WeeklyEmotionCalendar } from "../components/emotion/WeeklyEmotionCalendar";
import { MonthlyEmotionChart } from "../components/emotion/MonthlyEmotionChart";
import { AccordionSection } from "../components/Accordion";
import { useToast } from "../components/ToastProvider";
import * as api from "../lib/api";

export function meta() {
  return [
    { title: "감정 기록 - 마음쉼표" },
    {
      name: "description",
      content: "오늘의 감정을 기록하고 나의 마음을 들여다보세요",
    },
  ];
}

export default function EmotionLog() {
  const toast = useToast();
  const [emotionLogs, setEmotionLogs] = useState<api.EmotionLog[]>([]);
  const [stats, setStats] = useState<api.EmotionStats | null>(null);
  const [chartData, setChartData] = useState<api.ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [logsResponse, statsResponse, chartResponse] = await Promise.all([
        api.getEmotionLogs(1, 10),
        api.getEmotionStats(30),
        api.getEmotionChart(30)
      ]);

      setEmotionLogs(logsResponse.emotion_logs);
      setStats(statsResponse);
      setChartData(chartResponse.data);
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      console.error("데이터 로드 오류:", error);
      toast.error("오류", "데이터를 불러오는 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return {
      date: date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
      day: weekday
    };
  };

  // Check if there's a record for today
  const getTodayRecord = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return emotionLogs.find(log => {
      const logDate = new Date(log.created_at);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
  };

  const todayRecord = getTodayRecord();

  // Group emotion logs by date
  const groupLogsByDate = (logs: api.EmotionLog[]) => {
    const groups: { [key: string]: api.EmotionLog[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    logs.forEach((log) => {
      const logDate = new Date(log.created_at);
      logDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - logDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let groupKey = "";
      if (diffDays === 0) {
        groupKey = "오늘";
      } else if (diffDays === 1) {
        groupKey = "어제";
      } else if (diffDays < 7) {
        groupKey = "이번 주";
      } else if (diffDays < 14) {
        groupKey = "지난주";
      } else if (diffDays < 30) {
        groupKey = "이번 달";
      } else {
        const month = logDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
        groupKey = month;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(log);
    });

    return groups;
  };

  const groupedLogs = groupLogsByDate(emotionLogs);

  // Generate weekly data from emotion logs
  const getWeeklyData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current week's Monday
    const currentMonday = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentMonday.setDate(today.getDate() + daysToMonday);

    // Create week data structure
    const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
    const weekData = weekDays.map((day, index) => {
      const date = new Date(currentMonday);
      date.setDate(currentMonday.getDate() + index);

      // Find log for this date
      const dayLog = emotionLogs.find(log => {
        const logDate = new Date(log.created_at);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });

      if (dayLog) {
        return {
          day,
          emoji: dayLog.emotion_emoji,
          value: dayLog.emotion_value,
          hasRecord: true,
          date: `${date.getMonth() + 1}월 ${date.getDate()}일`,
          note: dayLog.note || undefined,
        };
      } else {
        return {
          day,
          emoji: "😐",
          value: 0,
          hasRecord: false,
        };
      }
    });

    // Calculate this week's average
    const thisWeekLogs = weekData.filter(d => d.hasRecord);
    const thisWeekAverage = thisWeekLogs.length > 0
      ? thisWeekLogs.reduce((sum, d) => sum + d.value, 0) / thisWeekLogs.length
      : 0;

    // Calculate last week's average
    const lastWeekStart = new Date(currentMonday);
    lastWeekStart.setDate(currentMonday.getDate() - 7);
    const lastWeekEnd = new Date(currentMonday);
    lastWeekEnd.setDate(currentMonday.getDate() - 1);

    const lastWeekLogs = emotionLogs.filter(log => {
      const logDate = new Date(log.created_at);
      logDate.setHours(0, 0, 0, 0);
      return logDate >= lastWeekStart && logDate <= lastWeekEnd;
    });

    const lastWeekAverage = lastWeekLogs.length > 0
      ? lastWeekLogs.reduce((sum, log) => sum + log.emotion_value, 0) / lastWeekLogs.length
      : 0;

    return {
      weekData,
      thisWeekAverage,
      lastWeekAverage,
    };
  };

  const { weekData, thisWeekAverage, lastWeekAverage } = getWeeklyData();

  return (
    <AppLayout>
      <div className="bg-gradient-to-br from-primary-50 via-white to-lavender-50 relative -mx-4 sm:-mx-6 lg:-mx-8 -my-6 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 gradient-mesh opacity-20 animate-gradient bg-[length:200%_200%] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Section 1: 이번 주 감정 - Default Open */}
        <AccordionSection
          title="이번 주 감정"
          icon="📈"
          badge={`${weekData.filter(d => d.hasRecord).length}/7일`}
          defaultOpen={true}
        >
          <WeeklyEmotionCalendar
            weekData={weekData}
            averageValue={thisWeekAverage}
            lastWeekAverage={lastWeekAverage}
            showComparison={true}
          />
        </AccordionSection>

        {/* Section 2: 감정 기록하기 - Default Open */}
        <AccordionSection
          title={todayRecord ? "오늘의 감정 기록" : "감정 기록하기"}
          icon={todayRecord ? "✅" : "✍️"}
          defaultOpen={true}
        >
          {todayRecord ? (
            <TodayRecordComplete
              emotionValue={todayRecord.emotion_value}
              emotionLabel={todayRecord.emotion_label}
              emotionEmoji={todayRecord.emotion_emoji}
              note={todayRecord.note}
              aiFeedback={todayRecord.ai_feedback}
              createdAt={todayRecord.created_at}
            />
          ) : (
            <EmotionLogForm onSuccess={loadData} />
          )}
        </AccordionSection>

        {/* Section 3: 월간 분석 - Default Closed */}
        <AccordionSection
          title="월간 분석"
          icon="📊"
          badge={stats ? `${stats.total_records}개 기록` : undefined}
          defaultOpen={false}
        >
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-body text-neutral-600">데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Chart */}
            <div>
              <MonthlyEmotionChart data={chartData} title="월간 감정 추이" />
            </div>

            {/* Quick Stats - Infographic Style */}
            <div className="glass-strong rounded-3xl shadow-elevation-2 p-8 border border-white/40">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">📊</span>
                <h3 className="text-h3 text-neutral-900 font-bold">감정 통계</h3>
              </div>
              <div className="space-y-6">
                {/* Average Score - Circular Progress */}
                <div className="relative p-6 bg-gradient-to-br from-mint-50 via-mint-100 to-emerald-50 rounded-2xl shadow-sm border border-mint-200/50 hover:shadow-lg transition-all group overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-mint-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-3xl">📈</span>
                        <p className="text-body-lg font-semibold text-mint-800">이번 달 평균</p>
                      </div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <p className="text-5xl font-bold text-mint-600">
                          {stats ? (stats.average_emotion > 0 ? `+${stats.average_emotion.toFixed(1)}` : stats.average_emotion.toFixed(1)) : "0"}
                        </p>
                        <span className="text-body text-mint-600/80">/ 3.0</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="relative h-3 bg-mint-200/50 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-mint-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${((stats?.average_emotion ?? 0) + 3) / 6 * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-caption text-mint-700 mt-2">
                        {(stats?.average_emotion ?? 0) >= 1 ? "긍정적인 한 달이었어요! 🌟" :
                         (stats?.average_emotion ?? 0) >= 0 ? "평온한 한 달이었네요 😌" :
                         "힘든 시간이었네요. 응원할게요 💪"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Streak Days - Flame Visual */}
                <div className="relative p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl shadow-sm border border-orange-200/50 hover:shadow-lg transition-all group overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl animate-pulse">🔥</span>
                        <p className="text-body-lg font-semibold text-orange-800">연속 기록 스트릭</p>
                      </div>
                      <div className="px-3 py-1 bg-orange-200/60 rounded-full">
                        <span className="text-body-sm font-bold text-orange-700">
                          {stats?.streak_days || 0}일 연속
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 flex items-center gap-1">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-12 rounded-lg transition-all ${
                              i < (stats?.streak_days || 0) % 7
                                ? "bg-gradient-to-t from-orange-400 to-amber-300 shadow-md"
                                : "bg-orange-100"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <p className="text-body-sm text-orange-700 font-medium">
                      {(stats?.streak_days || 0) >= 7 ? "🎉 일주일 달성! 정말 대단해요!" :
                       (stats?.streak_days || 0) >= 3 ? "💪 좋아요! 계속 이어가세요!" :
                       "📝 꾸준히 기록해보세요!"}
                    </p>
                  </div>
                </div>

                {/* Total Records - Milestone Visual */}
                <div className="relative p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-sm border border-indigo-200/50 hover:shadow-lg transition-all group overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-1/2 right-0 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-3xl">✨</span>
                      <p className="text-body-lg font-semibold text-indigo-800">총 감정 기록</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-5xl font-bold text-indigo-600">{stats?.total_records || 0}</p>
                        <p className="text-caption text-indigo-600/70 mt-1">개의 순간들</p>
                      </div>

                      {/* Milestone badges */}
                      <div className="flex flex-col gap-2">
                        <div className={`px-3 py-1.5 rounded-lg text-center transition-all ${
                          (stats?.total_records || 0) >= 30
                            ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                            : "bg-indigo-100 text-indigo-400"
                        }`}>
                          <p className="text-caption font-bold">🏆 30일</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-center transition-all ${
                          (stats?.total_records || 0) >= 60
                            ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                            : "bg-indigo-100 text-indigo-400"
                        }`}>
                          <p className="text-caption font-bold">🎖️ 60일</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-center transition-all ${
                          (stats?.total_records || 0) >= 100
                            ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                            : "bg-indigo-100 text-indigo-400"
                        }`}>
                          <p className="text-caption font-bold">👑 100일</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-2 bg-indigo-200/50 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((stats?.total_records || 0) / 100 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-caption text-indigo-700 mt-2 text-right">
                      다음 목표: {(stats?.total_records || 0) < 30 ? "30일" : (stats?.total_records || 0) < 60 ? "60일" : "100일"}
                      ({Math.max(30 - (stats?.total_records || 0), 0) || Math.max(60 - (stats?.total_records || 0), 0) || Math.max(100 - (stats?.total_records || 0), 0)}일 남음)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </AccordionSection>

        {/* Section 4: 히스토리 - Default Closed */}
        <AccordionSection
          title="감정 기록 히스토리"
          icon="📅"
          badge={emotionLogs.length > 0 ? `${emotionLogs.length}개` : undefined}
          defaultOpen={false}
        >

          {emotionLogs.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-neutral-300">
              <span className="text-6xl mb-4 block">📝</span>
              <p className="text-h4 text-neutral-700 mb-2">
                아직 감정 기록이 없습니다
              </p>
              <p className="text-body text-neutral-500">
                첫 기록을 작성해보세요!
              </p>
            </div>
          ) : (
            <>
              {/* Grouped History View */}
              <div className="space-y-10">
                {Object.entries(groupedLogs).map(([groupName, logs]) => (
                  <div key={groupName} className="relative">
                    {/* Group Header */}
                    <div className="sticky top-0 z-10 mb-6 pb-3 border-b-2 border-primary-200/50 bg-gradient-to-r from-white/95 via-white/90 to-transparent backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-primary-400 to-lavender-400 rounded-full"></div>
                        <h3 className="text-h3 font-bold text-neutral-800">{groupName}</h3>
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-body-sm font-semibold">
                          {logs.length}개
                        </span>
                      </div>
                    </div>

                    {/* Cards in this group */}
                    <div className="space-y-4 ml-5">
                      {logs.map((log, index) => {
                        const { date, day } = formatDate(log.created_at);
                        return (
                          <div
                            key={log.id}
                            className="relative"
                            style={{
                              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                            }}
                          >
                            {/* Timeline dot */}
                            <div className="absolute -left-5 top-8 w-3 h-3 bg-primary-400 rounded-full border-2 border-white shadow-md"></div>

                            <EmotionHistoryCard
                              date={date}
                              day={day}
                              emotionValue={log.emotion_value}
                              emotionLabel={log.emotion_label}
                              emotionEmoji={log.emotion_emoji}
                              note={log.note || ""}
                              aiFeedback={log.ai_feedback || ""}
                              onEdit={() => console.log("Edit", log.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <button
                  onClick={loadData}
                  className="px-10 py-4 bg-white hover:bg-primary-50 text-primary-600 hover:text-primary-700 font-semibold rounded-2xl border-2 border-primary-200 hover:border-primary-300 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <span>더 많은 기록 보기</span>
                    <span className="text-xl">→</span>
                  </span>
                </button>
              </div>

              {/* Add fadeInUp animation */}
              <style>{`
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </>
          )}
        </AccordionSection>
      </div>
    </div>
    </AppLayout>
  );
}
