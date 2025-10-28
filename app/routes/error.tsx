import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";

export function meta() {
  return [
    { title: "오류 - 마음쉼표" },
    {
      name: "description",
      content: "페이지를 찾을 수 없습니다",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

interface ErrorPageProps {
  type?: "404" | "500" | "403" | "network" | "maintenance" | "session" | "ratelimit";
}

export default function ErrorPage({ type = "404" }: ErrorPageProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleContactSupport = () => {
    navigate("/help");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // Error configurations
  const errorConfig = {
    "404": {
      icon: "🔍",
      title: "페이지를 찾을 수 없습니다",
      description:
        "요청하신 페이지가 존재하지 않거나 이동/삭제되었을 수 있습니다. 잘못 입력된 주소인지 확인해주세요.",
      primaryAction: { label: "🏠 홈으로", onClick: handleGoHome },
      secondaryAction: { label: "← 이전 페이지", onClick: handleGoBack },
      showSuggestions: true,
    },
    "500": {
      icon: "⚠️",
      title: "서버 오류가 발생했습니다",
      description:
        "일시적인 오류로 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요.",
      primaryAction: { label: "🔄 다시시도", onClick: handleRetry },
      secondaryAction: { label: "🏠 홈으로", onClick: handleGoHome },
      showErrorCode: true,
      errorCode: `ERR_500_${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}`,
    },
    "403": {
      icon: "🔒",
      title: "접근 권한이 없습니다",
      description:
        "이 페이지에 접근할 수 있는 권한이 없습니다. 로그인이 필요하거나 관리자 권한이 필요한 페이지일 수 있습니다.",
      primaryAction: { label: "🔑 로그인", onClick: handleLogin },
      secondaryAction: { label: "🏠 홈으로", onClick: handleGoHome },
    },
    "network": {
      icon: "📡",
      title: "인터넷 연결을 확인해주세요",
      description:
        "네트워크 연결이 끊어졌거나 불안정합니다. Wi-Fi 또는 모바일 데이터 연결을 확인해주세요.",
      primaryAction: { label: "🔄 다시시도", onClick: handleRetry },
      secondaryAction: { label: "오프라인모드", onClick: () => console.log("Offline mode") },
    },
    "maintenance": {
      icon: "🛠️",
      title: "서비스 점검 중입니다",
      description:
        "더 나은 서비스를 위해 시스템 점검을 진행하고 있습니다. 점검 시간: 2024년 1월 15일 02:00 - 04:00 (약 1시간 30분 남음)",
      primaryAction: { label: "🔔 점검 완료 시 알림받기", onClick: () => console.log("Notify") },
      showMaintenanceInfo: true,
    },
    "session": {
      icon: "⏰",
      title: "세션이 만료되었습니다",
      description:
        "보안을 위해 일정 시간 활동이 없으면 자동으로 로그아웃됩니다. 다시 로그인해주세요.",
      primaryAction: { label: "🔑 다시 로그인하기", onClick: handleLogin },
    },
    "ratelimit": {
      icon: "⏱️",
      title: "요청 횟수 제한 초과",
      description:
        "짧은 시간에 너무 많은 요청을 보내셨습니다. 잠시 후 다시 시도해주세요. (약 5분 후 이용 가능)",
      primaryAction: { label: "🏠 홈으로", onClick: handleGoHome },
      secondaryAction: { label: "⏰ 5분 대기", onClick: () => console.log("Wait") },
    },
  };

  const config = errorConfig[type];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Error Icon */}
          <div className="text-8xl mb-6 text-neutral-400">{config.icon}</div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            {config.title}
          </h1>

          {/* Error Description */}
          <p className="text-base text-neutral-600 leading-relaxed max-w-md mx-auto mb-8">
            {config.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              variant="primary"
              size="lg"
              onClick={config.primaryAction.onClick}
            >
              {config.primaryAction.label}
            </Button>
            {"secondaryAction" in config && config.secondaryAction && (
              <Button
                variant="ghost"
                size="lg"
                onClick={config.secondaryAction.onClick}
                className="border-2 border-neutral-300"
              >
                {config.secondaryAction.label}
              </Button>
            )}
          </div>

          {/* Additional Info */}
          {"showErrorCode" in config && config.showErrorCode && (
            <div className="bg-neutral-100 rounded-lg p-4 mt-6 inline-block">
              <p className="text-sm text-neutral-600">
                오류 코드: <span className="font-mono">{"errorCode" in config ? config.errorCode : ""}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                (문의 시 이 코드를 알려주세요)
              </p>
              <button
                onClick={handleContactSupport}
                className="text-sm text-primary-600 hover:underline mt-2"
              >
                📧 고객센터 문의
              </button>
            </div>
          )}

          {"showSuggestions" in config && config.showSuggestions && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mt-6 text-left">
              <h3 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
                💡 이런 페이지를 찾으시나요?
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/emotion"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    • 감정 기록하기
                  </a>
                </li>
                <li>
                  <a
                    href="/chat"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    • AI 코치와 대화
                  </a>
                </li>
                <li>
                  <a
                    href="/community"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    • 커뮤니티 둘러보기
                  </a>
                </li>
              </ul>
            </div>
          )}

          {"showMaintenanceInfo" in config && config.showMaintenanceInfo && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mt-6 text-left">
              <h3 className="text-h4 text-neutral-900 mb-3">점검 내용:</h3>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• 서버 안정성 개선</li>
                <li>• 새로운 기능 추가</li>
              </ul>
              <p className="text-sm text-neutral-600 mt-4">
                빠른 시일 내에 찾아뵙겠습니다. 불편을 드려 죄송합니다.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
