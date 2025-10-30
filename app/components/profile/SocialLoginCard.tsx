interface SocialLoginCardProps {
  provider: "google" | "kakao" | "naver";
  connected: boolean;
  email?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const providerConfig = {
  google: {
    icon: "G",
    name: "Google",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  kakao: {
    icon: "K",
    name: "Kakao",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  naver: {
    icon: "N",
    name: "Naver",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
};

export function SocialLoginCard({
  provider,
  connected,
  email,
  onConnect,
  onDisconnect,
}: SocialLoginCardProps) {
  const config = providerConfig[provider];

  return (
    <div
      className={`
        flex items-center justify-between p-4 border rounded-lg transition-all duration-300 transform hover:-translate-y-1
        ${
          connected
            ? `${config.bgColor} ${config.borderColor} shadow-soft hover:shadow-elevation-2`
            : "glass border-white/20 shadow-soft hover:shadow-primary"
        }
      `}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl
            ${config.color} ${connected ? "bg-white" : "bg-neutral-100"}
          `}
        >
          {config.icon}
        </div>
        <div>
          <p className="text-body font-medium text-neutral-900">
            {config.name} 계정
          </p>
          {connected && email && (
            <p className="text-body-sm text-neutral-600">{email}</p>
          )}
          <p
            className={`text-body-sm ${
              connected ? "text-green-600" : "text-neutral-500"
            }`}
          >
            {connected ? "연동됨" : "연동 안 됨"}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <button
        onClick={connected ? onDisconnect : onConnect}
        className={`
          px-4 py-2 rounded-lg text-body-sm font-medium transition-colors
          ${
            connected
              ? "text-error-600 hover:bg-error-50"
              : "text-primary-600 hover:bg-primary-50"
          }
        `}
      >
        {connected ? "연결 해제" : "연동하기"}
      </button>
    </div>
  );
}
