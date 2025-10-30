import { User, Calendar, CheckCircle } from "lucide-react";

interface ProfileHeaderProps {
  nickname: string;
  email: string;
  joinDate: string;
  profileImage?: string;
  completionPercentage: number;
}

export function ProfileHeader({
  nickname,
  email,
  joinDate,
  profileImage,
  completionPercentage,
}: ProfileHeaderProps) {
  const getCompletionMessage = (percentage: number): string => {
    if (percentage >= 100) return "프로필이 완벽해요! 🎉";
    if (percentage >= 80) return "거의 다 왔어요!";
    if (percentage >= 60) return "좋은 진척이에요!";
    if (percentage >= 40) return "조금 더 채워볼까요?";
    return "프로필을 완성해보세요!";
  };

  const getCompletionColor = (percentage: number): string => {
    if (percentage >= 80) return "from-mint-500 to-mint-600";
    if (percentage >= 60) return "from-primary-500 to-primary-600";
    if (percentage >= 40) return "from-accent-500 to-accent-600";
    return "from-neutral-400 to-neutral-500";
  };

  return (
    <div className="glass-strong rounded-2xl shadow-soft p-6 lg:p-8 border border-white/20 bg-gradient-to-br from-primary-50 via-white to-lavender-50">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={nickname}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-lavender-500 flex items-center justify-center border-4 border-white shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-h2 text-neutral-900 mb-2">{nickname}</h2>
          <p className="text-body text-neutral-600 mb-3">{email}</p>

          {/* Join Date */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-body-sm text-neutral-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>가입일: {joinDate}</span>
          </div>

          {/* Profile Completion */}
          <div className="bg-white/70 rounded-xl p-4 border border-primary-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-600" />
                <span className="text-body font-medium text-neutral-800">
                  프로필 완성도
                </span>
              </div>
              <span className="text-h4 font-bold text-primary-600">
                {completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full bg-gradient-to-r ${getCompletionColor(completionPercentage)} transition-all duration-500 rounded-full`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <p className="text-body-sm text-neutral-600">
              {getCompletionMessage(completionPercentage)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
