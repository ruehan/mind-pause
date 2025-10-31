import { CheckCircle2, Clock, Bell, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  type: "challenge" | "reminder" | "goal";
  completed: boolean;
  time?: string;
}

interface TodayTasksWidgetProps {
  tasks: Task[];
  onTaskToggle?: (taskId: string) => void;
}

export function TodayTasksWidget({
  tasks,
  onTaskToggle,
}: TodayTasksWidgetProps) {
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevCompletedCount, setPrevCompletedCount] = useState(0);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "challenge":
        return "🎯";
      case "reminder":
        return "🔔";
      case "goal":
        return "⭐";
      default:
        return "📝";
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  useEffect(() => {
    if (completedCount > prevCompletedCount && completedCount === totalCount && totalCount > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setPrevCompletedCount(completedCount);
  }, [completedCount, totalCount]);

  const handleTaskToggle = (taskId: string) => {
    setJustCompleted(taskId);
    setTimeout(() => setJustCompleted(null), 600);
    onTaskToggle?.(taskId);
  };

  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600 animate-float" />
          오늘의 할 일
        </h2>
        <span className="text-body-sm text-neutral-600">
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mb-4">
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-mint-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 transform ${
              task.completed
                ? "bg-neutral-100 scale-100"
                : "bg-white/50 hover:bg-white/80 hover:scale-102"
            } ${
              justCompleted === task.id
                ? "animate-pulse-once scale-105"
                : ""
            } cursor-pointer relative overflow-hidden group`}
            onClick={() => handleTaskToggle(task.id)}
          >
            {/* Completion sparkle effect */}
            {justCompleted === task.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-mint-100 via-primary-100 to-lavender-100 animate-shimmer"></div>
            )}

            <div className="flex-shrink-0 relative z-10">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-mint-600 animate-scale-in" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-neutral-300 group-hover:border-primary-400 group-hover:scale-110 transition-all duration-200" />
              )}
            </div>
            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2">
                <span className={`text-lg transition-transform duration-200 ${
                  task.completed ? "scale-75 opacity-50" : "group-hover:scale-110"
                }`}>
                  {getTaskIcon(task.type)}
                </span>
                <p
                  className={`text-body transition-all duration-300 ${
                    task.completed
                      ? "line-through text-neutral-500"
                      : "text-neutral-900 group-hover:text-primary-700"
                  }`}
                >
                  {task.title}
                </p>
              </div>
              {task.time && !task.completed && (
                <p className="text-body-xs text-neutral-500 mt-1 flex items-center gap-1 group-hover:text-primary-600 transition-colors">
                  <Clock className="w-3 h-3" />
                  {task.time}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-body text-neutral-500">
            오늘 할 일이 없어요
          </p>
          <p className="text-body-sm text-neutral-400 mt-1">
            편안한 하루 보내세요 ☺️
          </p>
        </div>
      )}

      {tasks.length > 0 && completedCount === totalCount && (
        <div className={`mt-4 p-3 bg-mint-50 rounded-lg text-center relative overflow-hidden transition-all duration-500 ${
          showCelebration ? "animate-bounce-subtle" : ""
        }`}>
          {showCelebration && (
            <>
              <Sparkles className="absolute top-2 left-2 w-4 h-4 text-mint-600 animate-spin-slow" />
              <Sparkles className="absolute top-2 right-2 w-4 h-4 text-primary-600 animate-spin-slow" style={{ animationDelay: "0.2s" }} />
              <Sparkles className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-lavender-600 animate-spin-slow" style={{ animationDelay: "0.4s" }} />
            </>
          )}
          <p className="text-body-sm text-mint-700 font-medium relative z-10">
            🎉 오늘의 할 일을 모두 완료했어요!
          </p>
        </div>
      )}
    </div>
  );
}
