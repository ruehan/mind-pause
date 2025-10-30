import { FeatureCard } from "./FeatureCard";
import { FileText, MessageCircle, BarChart3, Target } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "감정 기록",
    description: "간단한 기록으로 하루를 돌아봐요",
  },
  {
    icon: MessageCircle,
    title: "AI 코칭",
    description: "따뜻한 AI와 대화하세요",
  },
  {
    icon: BarChart3,
    title: "데이터 분석",
    description: "감정 변화를 한눈에 확인",
  },
  {
    icon: Target,
    title: "챌린지",
    description: "회복 습관을 만들어가요",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-h2 text-neutral-900 mb-4">
            마음쉼표가 특별한 이유
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            AI 기술과 따뜻한 마음으로 당신의 감정을 케어합니다
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
