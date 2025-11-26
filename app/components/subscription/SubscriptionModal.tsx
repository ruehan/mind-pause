import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Check, Sparkles, Zap } from "lucide-react";

interface SubscriptionPlan {
  tier: "FREE" | "PREMIUM";
  name: string;
  description: string;
  price_monthly: number | null;
  monthly_token_limit: number;
  features: string[];
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: "FREE" | "PREMIUM";
  onUpgrade: (tier: "FREE" | "PREMIUM") => Promise<void>;
}

const PLANS: SubscriptionPlan[] = [
  {
    tier: "FREE",
    name: "무료",
    description: "마음쉼표를 시작하는 모든 분들을 위한 기본 플랜",
    price_monthly: null,
    monthly_token_limit: 10000,
    features: [
      "월 10,000 토큰 (~20-25회 대화)",
      "일 500 토큰 제한",
      "기본 AI 캐릭터",
      "감정 기록 및 분석",
      "커뮤니티 접근",
    ],
  },
  {
    tier: "PREMIUM",
    name: "프리미엄",
    description: "더 많은 대화와 프리미엄 기능",
    price_monthly: 5900,
    monthly_token_limit: 100000,
    features: [
      "월 100,000 토큰 (~220회 대화)",
      "일 5,000 토큰 제한",
      "모든 AI 캐릭터",
      "고급 감정 분석",
      "광고 제거",
      "우선 지원",
      "커스텀 캐릭터 (곧 출시)",
    ],
  },
];

export function SubscriptionModal({
  isOpen,
  onClose,
  currentTier,
  onUpgrade,
}: SubscriptionModalProps) {
  const handleUpgrade = async (tier: "FREE" | "PREMIUM") => {
    try {
      await onUpgrade(tier);
      onClose();
    } catch (error) {
      console.error("업그레이드 실패:", error);
      alert("업그레이드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      플랜 선택
                    </Dialog.Title>
                    <p className="text-gray-600 mt-1">
                      나에게 맞는 플랜을 선택하세요
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* 플랜 카드들 */}
                <div className="grid md:grid-cols-2 gap-6">
                  {PLANS.map((plan) => {
                    const isCurrentPlan = plan.tier === currentTier;
                    const isPremium = plan.tier === "PREMIUM";

                    return (
                      <div
                        key={plan.tier}
                        className={`relative rounded-xl border-2 p-6 transition-all ${
                          isPremium
                            ? "border-primary-500 shadow-lg shadow-primary-100"
                            : "border-gray-200"
                        }`}
                      >
                        {/* 프리미엄 배지 */}
                        {isPremium && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className="bg-gradient-to-r from-primary-500 to-mint-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                              <Sparkles className="w-4 h-4" />
                              <span>인기</span>
                            </div>
                          </div>
                        )}

                        {/* 현재 플랜 배지 */}
                        {isCurrentPlan && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                              현재 플랜
                            </span>
                          </div>
                        )}

                        {/* 플랜 정보 */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {plan.description}
                          </p>

                          {/* 가격 */}
                          <div className="mb-4">
                            {plan.price_monthly ? (
                              <div className="flex items-baseline">
                                <span className="text-4xl font-bold text-gray-900">
                                  ₩{plan.price_monthly.toLocaleString()}
                                </span>
                                <span className="text-gray-600 ml-2">/월</span>
                              </div>
                            ) : (
                              <div className="text-4xl font-bold text-gray-900">
                                무료
                              </div>
                            )}
                          </div>

                          {/* 토큰 정보 */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">월간 토큰</span>
                              <span className="font-bold text-gray-900">
                                {plan.monthly_token_limit.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 기능 목록 */}
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* 액션 버튼 */}
                        {isCurrentPlan ? (
                          <button
                            disabled
                            className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                          >
                            현재 사용 중
                          </button>
                        ) : isPremium ? (
                          <button
                            onClick={() => handleUpgrade(plan.tier)}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-mint-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-mint-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-100"
                          >
                            <Zap className="w-5 h-5" />
                            <span>업그레이드</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpgrade(plan.tier)}
                            className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            무료로 시작
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 하단 안내 */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>알림:</strong> 플랜은 언제든지 변경하실 수
                    있습니다. 결제는 안전하게 처리됩니다.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
