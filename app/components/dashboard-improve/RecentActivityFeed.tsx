import { Link } from "react-router";
import { FileText, MessageCircle, Trophy, Heart, ChevronRight } from "lucide-react";
import type { RecentActivities } from "~/lib/api";

interface RecentActivityFeedProps {
  activities: RecentActivities;
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  // Combine and sort activities (reuse logic or simplify)
  // For improved version, we might want to show a simplified list
  
  const allActivities = [
    ...activities.emotion_logs.map(log => ({
      type: 'emotion',
      title: '감정 기록',
      desc: log.content || '감정을 기록했습니다.',
      time: new Date(log.created_at),
      icon: FileText,
      color: 'bg-primary-100 text-primary-600'
    })),
    ...activities.posts.map(post => ({
      type: 'post',
      title: '게시글 작성',
      desc: post.title,
      time: new Date(post.created_at),
      icon: MessageCircle,
      color: 'bg-lavender-100 text-lavender-600'
    })),
    // ... add others if needed
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-neutral-900">최근 활동</h3>
        <Link to="/profile" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
          전체보기 <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-6">
        {allActivities.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">아직 활동 내역이 없습니다.</p>
        ) : (
          allActivities.map((activity, idx) => (
            <div key={idx} className="flex gap-4 relative">
              {/* Connector Line */}
              {idx !== allActivities.length - 1 && (
                <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-neutral-100"></div>
              )}
              
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-neutral-900">{activity.title}</h4>
                  <span className="text-xs text-neutral-400">
                    {activity.time.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-1">
                  {activity.desc}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
