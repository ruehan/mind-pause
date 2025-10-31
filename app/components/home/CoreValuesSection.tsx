import { Shield, Bot, LineChart, Gift } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const values = [
  {
    icon: Shield,
    title: "완벽한 프라이버시",
    description: "철저한 익명성 보장으로 안전하게 감정을 나눠요",
    color: "primary",
    tooltip: "🔒 모든 데이터는 암호화되어 안전하게 보관됩니다",
  },
  {
    icon: Bot,
    title: "24시간 AI 코치",
    description: "언제든 대화할 수 있는 따뜻한 AI가 함께해요",
    color: "lavender",
    tooltip: "💬 새벽이든 한밤중이든, 언제나 함께합니다",
  },
  {
    icon: LineChart,
    title: "과학 기반 접근",
    description: "심리학 연구를 바탕으로 한 감정 케어 시스템",
    color: "mint",
    tooltip: "📊 검증된 심리학 이론을 바탕으로 설계되었습니다",
  },
  {
    icon: Gift,
    title: "무료로 시작",
    description: "부담 없이 체험하고 필요한 만큼 사용하세요",
    color: "accent",
    tooltip: "🎁 기본 기능은 영구 무료로 사용 가능합니다",
  },
];

interface ValueCardProps {
  value: typeof values[0];
  index: number;
  isVisible: boolean;
}

function ValueCard({ value, index, isVisible }: ValueCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = value.icon;

  const handleClick = () => {
    setShowTooltip(!showTooltip);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div
      className={`text-center transition-all duration-700 transform ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      onClick={handleClick}
    >
      {/* Icon with flip animation */}
      <div className="flex justify-center mb-4 relative">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft transition-all duration-500 cursor-pointer ${
            value.color === "primary"
              ? "bg-primary-100 hover:bg-primary-200"
              : value.color === "lavender"
              ? "bg-lavender-100 hover:bg-lavender-200"
              : value.color === "mint"
              ? "bg-mint-100 hover:bg-mint-200"
              : "bg-accent-100 hover:bg-accent-200"
          } ${isHovered ? "scale-110 rotate-12 shadow-lg" : "scale-100 rotate-0"}
          ${isFlipped ? "rotate-y-180" : ""}`}
          onAnimationEnd={() => setIsFlipped(false)}
        >
          {/* Glow effect */}
          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            } ${
              value.color === "primary"
                ? "bg-primary-400/20"
                : value.color === "lavender"
                ? "bg-lavender-400/20"
                : value.color === "mint"
                ? "bg-mint-400/20"
                : "bg-accent-400/20"
            } blur-xl`}
          ></div>

          <Icon
            className={`w-8 h-8 transition-all duration-500 relative z-10 ${
              value.color === "primary"
                ? "text-primary-600"
                : value.color === "lavender"
                ? "text-lavender-600"
                : value.color === "mint"
                ? "text-mint-600"
                : "text-accent-600"
            } ${isHovered ? "scale-125 animate-bounce-subtle" : ""}`}
          />
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
            <div className="bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {value.tooltip}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45"></div>
            </div>
          </div>
        )}
      </div>

      {/* Title with gradient effect on hover */}
      <h3
        className={`text-h4 font-semibold text-neutral-900 mb-2 transition-all duration-300 ${
          isHovered ? "bg-gradient-to-r from-primary-600 to-lavender-600 bg-clip-text text-transparent" : ""
        }`}
      >
        {value.title}
      </h3>

      {/* Description */}
      <p className="text-body text-neutral-600 leading-relaxed transition-all duration-300">
        {value.description}
      </p>

      {/* Interactive indicator */}
      <div className="flex justify-center mt-3">
        <div
          className={`h-1 rounded-full transition-all duration-500 ${
            isHovered ? "w-12 opacity-100" : "w-0 opacity-0"
          } ${
            value.color === "primary"
              ? "bg-primary-500"
              : value.color === "lavender"
              ? "bg-lavender-500"
              : value.color === "mint"
              ? "bg-mint-500"
              : "bg-accent-500"
          }`}
        ></div>
      </div>
    </div>
  );
}

export function CoreValuesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial visibility after mount
    const timer = setTimeout(() => setIsVisible(true), 200);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-lavender-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <h2 className="text-h2 font-bold text-neutral-900 mb-4">
            마음쉼표가 특별한 이유
          </h2>
          <p className="text-body-lg text-neutral-600">
            안전하고 과학적인 방법으로 당신의 감정을 돌봅니다
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <ValueCard
              key={index}
              value={value}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Click instruction hint */}
        <div
          className={`text-center mt-8 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm text-neutral-500 animate-pulse-slow">
            💡 카드를 클릭해서 더 자세한 정보를 확인하세요
          </p>
        </div>
      </div>
    </section>
  );
}
