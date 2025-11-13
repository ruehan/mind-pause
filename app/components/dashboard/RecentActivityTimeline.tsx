import type { RecentActivities } from "../../lib/api";
import { FileText, MessageCircle, Trophy, Heart } from "lucide-react";
import { Link } from "react-router";

interface RecentActivityTimelineProps {
  activities: RecentActivities;
}

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  // 모든 활동을 하나의 배열로 합치고 시간순 정렬
  const allActivities = [
    ...activities.emotion_logs.map((log) => ({
      type: "emotion" as const,
      id: log.id,
      title: `${getEmotionEmoji(log.emotion_type)} 감정 기록`,
      content: log.content || `${log.emotion_type} (강도: ${log.intensity})`,
      timestamp: new Date(log.created_at),
      link: `/emotion`,
    })),
    ...activities.posts.map((post) => ({
      type: "post" as const,
      id: post.id,
      title: "게시글 작성",
      content: post.title,
      timestamp: new Date(post.created_at),
      link: `/community/${post.id}`,
      meta: `❤️ ${post.num_likes} · 💬 ${post.num_comments}`,
    })),
    ...activities.comments.map((comment) => ({
      type: "comment" as const,
      id: comment.id,
      title: "댓글 작성",
      content: comment.post_title,
      timestamp: new Date(comment.created_at),
      link: `/community/${comment.post_id}`,
    })),
    ...activities.challenge_activities.map((challenge) => ({
      type: "challenge" as const,
      id: challenge.id,
      title: challenge.is_completed ? "챌린지 완료" : "챌린지 진행 중",
      content: `${challenge.challenge_icon} ${challenge.challenge_title}`,
      timestamp: new Date(), // UserChallenge에 timestamp가 없으므로 현재 시간 사용
      link: `/challenge`,
      meta: challenge.is_completed ? "🎉 완료!" : `${challenge.progress_percentage.toFixed(0)}% 진행 중`,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  function getEmotionEmoji(emotionType: string): string {
    const emojiMap: Record<string, string> = {
      "VERY_HAPPY": "😄",
      "HAPPY": "😊",
      "NEUTRAL": "😐",
      "SAD": "😢",
      "VERY_SAD": "😭",
      "ANGRY": "😠",
      "ANXIOUS": "😰",
      "CALM": "😌",
    };
    return emojiMap[emotionType] || "😊";
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case "emotion":
        return Heart;
      case "post":
        return FileText;
      case "comment":
        return MessageCircle;
      case "challenge":
        return Trophy;
      default:
        return FileText;
    }
  }

  function getActivityColor(type: string): string {
    switch (type) {
      case "emotion":
        return "text-pink-600 bg-pink-50";
      case "post":
        return "text-blue-600 bg-blue-50";
      case "comment":
        return "text-green-600 bg-green-50";
      case "challenge":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-neutral-600 bg-neutral-50";
    }
  }

  function getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return timestamp.toLocaleDateString("ko-KR");
  }

  return (
    <div className="glass rounded-xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-6 border border-white/20">
      <h2 className="text-h4 text-neutral-900 mb-6 flex items-center gap-2">
        🕐 최근 활동
      </h2>

      {allActivities.length === 0 ? (
        <div className="text-center py-8 text-body text-neutral-600">
          아직 활동 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {allActivities.slice(0, 10).map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <Link
                key={`${activity.type}-${activity.id}`}
                to={activity.link}
                className="block group"
              >
                <div className="flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-body font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {activity.title}
                      </h3>
                      <span className="text-body-sm text-neutral-500 flex-shrink-0">
                        {getRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-body-sm text-neutral-600 truncate">
                      {activity.content}
                    </p>
                    {activity.meta && (
                      <p className="text-body-sm text-neutral-500 mt-1">
                        {activity.meta}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {allActivities.length > 10 && (
        <button className="mt-4 w-full text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors py-2">
          더 보기 →
        </button>
      )}
    </div>
  );
}
