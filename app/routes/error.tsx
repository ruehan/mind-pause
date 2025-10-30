import React from "react";
import { useNavigate } from "react-router";
import {
  Search,
  AlertTriangle,
  Lock,
  WifiOff,
  Wrench,
  Clock,
  Timer,
  Home,
  RotateCw,
  Key,
  Bell,
  Mail,
  Lightbulb,
} from "lucide-react";
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

  // Icon mapping
  const iconMap = {
    "404": Search,
    "500": AlertTriangle,
    "403": Lock,
    "network": WifiOff,
    "maintenance": Wrench,
    "session": Clock,
    "ratelimit": Timer,
  };

  // Error configurations
  const errorConfig = {
    "404": {
      icon: iconMap["404"],
      emoji: "🧭",
      title: "길을 잃으셨나요?",
      subtitle: "괜찮아요, 함께 찾아봐요!",
      description:
        "요청하신 페이지가 존재하지 않거나 이동/삭제되었을 수 있습니다. 주소를 다시 한 번 확인해주세요.",
      primaryAction: { label: "홈으로", icon: Home, onClick: handleGoHome },
      secondaryAction: { label: "이전 페이지", onClick: handleGoBack },
      showSuggestions: true,
      solutions: [
        "URL 주소가 정확한지 확인해보세요",
        "북마크나 링크가 오래된 것일 수 있어요",
        "검색을 통해 원하는 페이지를 찾아보세요",
      ],
    },
    "500": {
      icon: iconMap["500"],
      emoji: "😴",
      title: "앗, 서버가 잠시 쉬고 있어요",
      subtitle: "곧 돌아올게요!",
      description:
        "일시적인 오류로 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요.",
      primaryAction: { label: "다시시도", icon: RotateCw, onClick: handleRetry },
      secondaryAction: { label: "홈으로", icon: Home, onClick: handleGoHome },
      showErrorCode: true,
      errorCode: `ERR_500_${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}`,
      solutions: [
        "잠시 후 다시 시도해주세요 (1-2분 정도)",
        "페이지를 새로고침해보세요",
        "문제가 계속되면 고객센터로 문의해주세요",
      ],
    },
    "403": {
      icon: iconMap["403"],
      emoji: "🎫",
      title: "이 페이지는 특별 초대장이 필요해요",
      subtitle: "로그인하고 입장하세요!",
      description:
        "이 페이지에 접근할 수 있는 권한이 없습니다. 로그인이 필요하거나 관리자 권한이 필요한 페이지일 수 있습니다.",
      primaryAction: { label: "로그인", icon: Key, onClick: handleLogin },
      secondaryAction: { label: "홈으로", icon: Home, onClick: handleGoHome },
      solutions: [
        "로그인 후 다시 시도해보세요",
        "다른 계정으로 로그인해보세요",
        "관리자 권한이 필요한 페이지인지 확인하세요",
      ],
    },
    "network": {
      icon: iconMap["network"],
      emoji: "📡",
      title: "인터넷이 숨바꼭질 중이에요",
      subtitle: "연결을 확인해주세요",
      description:
        "네트워크 연결이 끊어졌거나 불안정합니다. Wi-Fi 또는 모바일 데이터 연결을 확인해주세요.",
      primaryAction: { label: "다시시도", icon: RotateCw, onClick: handleRetry },
      secondaryAction: {
        label: "오프라인모드",
        onClick: () => {
          // 오프라인 모드 활성화 로직
          // localStorage에 오프라인 플래그 설정 등
        }
      },
      solutions: [
        "Wi-Fi 또는 모바일 데이터가 켜져 있는지 확인하세요",
        "기내 모드가 활성화되어 있지 않은지 확인하세요",
        "라우터를 재시작해보세요",
      ],
    },
    "maintenance": {
      icon: iconMap["maintenance"],
      emoji: "🔧",
      title: "더 나은 서비스를 위해 업그레이드 중!",
      subtitle: "잠시만 기다려주세요",
      description:
        "더 나은 서비스를 위해 시스템 점검을 진행하고 있습니다. 점검 시간: 2024년 1월 15일 02:00 - 04:00 (약 1시간 30분 남음)",
      primaryAction: {
        label: "점검 완료 시 알림받기",
        icon: Bell,
        onClick: () => {
          // 점검 완료 알림 등록 로직
          // 이메일 또는 푸시 알림 설정
        }
      },
      showMaintenanceInfo: true,
      solutions: [
        "점검 완료 예정 시간을 확인하세요",
        "알림을 신청하면 점검 완료 시 알려드려요",
        "SNS에서 실시간 업데이트를 확인하세요",
      ],
    },
    "session": {
      icon: iconMap["session"],
      emoji: "⏰",
      title: "시간이 멈춰버렸네요",
      subtitle: "다시 로그인해주세요",
      description:
        "보안을 위해 일정 시간 활동이 없으면 자동으로 로그아웃됩니다. 다시 로그인해주세요.",
      primaryAction: { label: "다시 로그인하기", icon: Key, onClick: handleLogin },
      solutions: [
        "다시 로그인하면 바로 이용할 수 있어요",
        "자동 로그인을 설정하면 더 편리해요",
        "작성 중이던 내용은 자동 저장되었어요",
      ],
    },
    "ratelimit": {
      icon: iconMap["ratelimit"],
      emoji: "🐌",
      title: "잠깐, 너무 빨라요!",
      subtitle: "조금만 천천히 해주세요",
      description:
        "짧은 시간에 너무 많은 요청을 보내셨습니다. 잠시 후 다시 시도해주세요. (약 5분 후 이용 가능)",
      primaryAction: { label: "홈으로", icon: Home, onClick: handleGoHome },
      secondaryAction: {
        label: "5분 대기",
        icon: Clock,
        onClick: () => {
          // 타이머 표시 또는 자동 새로고침 설정
        }
      },
      solutions: [
        "5분 정도 기다린 후 다시 시도해주세요",
        "자동 새로고침 스크립트를 사용하지 마세요",
        "정상적인 속도로 이용해주세요",
      ],
    },
  };

  const config = errorConfig[type];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Error Icon with Gradient Background */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Emoji Background */}
              {"emoji" in config && (
                <div className="text-8xl mb-4 animate-pulse">
                  {config.emoji}
                </div>
              )}
              {/* Icon with Gradient */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 via-lavender-100 to-accent-100 flex items-center justify-center mx-auto mb-2">
                {React.createElement(config.icon, {
                  className: "w-16 h-16 text-primary-600",
                  strokeWidth: 1.5,
                })}
              </div>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-h1 text-neutral-900 mb-2">
            {config.title}
          </h1>

          {/* Subtitle */}
          {"subtitle" in config && config.subtitle && (
            <p className="text-h4 text-primary-600 mb-6">
              {config.subtitle}
            </p>
          )}

          {/* Error Description */}
          <p className="text-body text-neutral-600 leading-relaxed max-w-md mx-auto mb-8">
            {config.description}
          </p>

          {/* Solution Suggestions */}
          {"solutions" in config && config.solutions && (
            <div className="glass-strong rounded-2xl shadow-soft p-6 mb-8 border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-lavender-50 text-left max-w-lg mx-auto">
              <h3 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary-600" />
                이렇게 해보세요
              </h3>
              <ul className="space-y-3">
                {config.solutions.map((solution: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-caption font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-body text-neutral-700 flex-1">
                      {solution}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              variant="primary"
              size="lg"
              onClick={config.primaryAction.onClick}
              className="flex items-center gap-2 min-w-[160px]"
            >
              {"icon" in config.primaryAction &&
                config.primaryAction.icon &&
                React.createElement(config.primaryAction.icon, {
                  className: "w-5 h-5",
                })}
              {config.primaryAction.label}
            </Button>
            {"secondaryAction" in config && config.secondaryAction && (
              <Button
                variant="ghost"
                size="lg"
                onClick={config.secondaryAction.onClick}
                className="border-2 border-neutral-300 flex items-center gap-2 min-w-[160px]"
              >
                {"icon" in config.secondaryAction &&
                  config.secondaryAction.icon &&
                  React.createElement(config.secondaryAction.icon, {
                    className: "w-5 h-5",
                  })}
                {config.secondaryAction.label}
              </Button>
            )}
          </div>

          {/* Help Link */}
          <div className="mb-8">
            <button
              onClick={handleContactSupport}
              className="text-body text-neutral-600 hover:text-primary-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Lightbulb className="w-4 h-4" />
              여전히 문제가 있나요? 도움말 보기 →
            </button>
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
                className="text-sm text-primary-600 hover:underline mt-2 flex items-center gap-1 justify-center"
              >
                <Mail className="w-4 h-4" />
                고객센터 문의
              </button>
            </div>
          )}

          {"showSuggestions" in config && config.showSuggestions && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mt-6 text-left">
              <h3 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary-600" />
                이런 페이지를 찾으시나요?
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
