import { useState, useEffect } from "react";
import { DashboardLayout } from "~/components/dashboard-improve/DashboardLayout";
import { EmotionLogForm } from "~/components/emotion-improve/EmotionLogForm";
import { TodayRecordComplete } from "~/components/emotion-improve/TodayRecordComplete";
import { EmotionHistory } from "~/components/emotion-improve/EmotionHistory";
import { WeeklyCalendar } from "~/components/emotion-improve/WeeklyCalendar";
import { AccordionSection } from "~/components/Accordion";
import { Spinner } from "~/components/Spinner";
import { useToast } from "~/components/ToastProvider";
import * as api from "~/lib/api";
import type { Route } from "./+types/emotion_improve";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "감정 기록 - 마음쉼표" },
    { name: "description", content: "오늘의 감정을 기록하고 나의 마음을 들여다보세요" },
  ];
}

export default function EmotionImprove() {
  const toast = useToast();
  const [emotionLogs, setEmotionLogs] = useState<api.EmotionLog[]>([]);
  const [stats, setStats] = useState<api.EmotionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [logsResponse, statsResponse] = await Promise.all([
        api.getEmotionLogs(1, 20), // Fetch a bit more for history
        api.getEmotionStats(30),
      ]);

      setEmotionLogs(logsResponse.emotion_logs);
      setStats(statsResponse);
    } catch (error) {
      if (error instanceof api.UnauthorizedError) return;
      console.error("데이터 로드 오류:", error);
      toast.error("오류", "데이터를 불러오는 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading && emotionLogs.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner size="xl" variant="breathing" />
        </div>
    </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative min-h-full">
        {/* Background Elements - Fixed to viewport but behind content */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-lavender-200/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-mint-100/40 rounded-full blur-[80px] animate-pulse-slow" />
        </div>

        <div className="relative z-10 space-y-10 animate-fade-in">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              나의 감정 정원 🌿
            </h1>
            <p className="text-body-lg text-neutral-600">
              오늘 하루, 당신의 마음은 어떤 색깔이었나요?
              <br />
              솔직한 감정을 기록하고 더 단단한 나를 만들어보세요.
            </p>
          </div>

          {/* Section 1: Weekly Flow */}
          <section>
            <WeeklyCalendar
              weekData={weekData}
              averageValue={thisWeekAverage}
              lastWeekAverage={lastWeekAverage}
            />
          </section>

          {/* Section 2: Today's Record */}
          <section className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-lavender-100/30 rounded-full blur-3xl pointer-events-none"></div>

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
          </section>

          {/* Section 3: History */}
          <section className="pt-8">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-h2 font-bold text-neutral-900">지난 기록들</h2>
              <div className="h-px flex-grow bg-neutral-200"></div>
            </div>
            
            <EmotionHistory 
              logs={emotionLogs} 
              onLoadMore={loadData} 
              isLoading={isLoading} 
            />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
