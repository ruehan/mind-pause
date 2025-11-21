import { Camera, Edit2 } from "lucide-react";

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
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-8 mb-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-white overflow-hidden relative">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-300">
                  <span className="text-4xl font-bold">{nickname[0]}</span>
                </div>
              )}
              
              {/* Upload Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-neutral-100 text-neutral-600 hover:text-primary-600 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-h2 font-bold text-neutral-900 mb-1">{nickname}</h1>
          <p className="text-body text-neutral-500 mb-4">{email}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-neutral-500">
            <span className="px-3 py-1 bg-neutral-100 rounded-full">
              가입일: {joinDate}
            </span>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
              프로필 완성도 {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
