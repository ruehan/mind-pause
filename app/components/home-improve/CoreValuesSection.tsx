import { Shield, Bot, LineChart, Gift, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const values = [
  {
    icon: Shield,
    title: "완벽한 프라이버시",
    description: "철저한 익명성 보장으로 안전하게 감정을 나눠요",
    color: "primary",
    features: ["데이터 암호화", "익명 닉네임", "기록 자동 삭제 옵션"]
  },
  {
    icon: Bot,
    title: "24시간 AI 코치",
    description: "언제든 대화할 수 있는 따뜻한 AI가 함께해요",
    color: "lavender",
    features: ["실시간 대화", "감정 분석 리포트", "맞춤형 조언"]
  },
  {
    icon: LineChart,
    title: "과학 기반 접근",
    description: "심리학 연구를 바탕으로 한 감정 케어 시스템",
    color: "mint",
    features: ["CBT 기반", "감정 패턴 분석", "전문가 검수"]
  },
  {
    icon: Gift,
    title: "무료로 시작",
    description: "부담 없이 체험하고 필요한 만큼 사용하세요",
    color: "accent",
    features: ["기본 기능 평생 무료", "광고 없음", "자유로운 해지"]
  },
];

export function CoreValuesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Sticky Content */}
          <div className="lg:sticky lg:top-32 self-start">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6 leading-tight">
              당신의 마음을 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-lavender-600">
                가장 안전하고 똑똑하게
              </span> <br />
              지키는 방법
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              마음쉼표는 최신 AI 기술과 심리학적 원리를 결합하여, <br className="hidden lg:block" />
              누구나 쉽게 마음 건강을 챙길 수 있도록 돕습니다.
            </p>
            
            <div className="hidden lg:block relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-neutral-100 rounded-full"></div>
              <div className="space-y-8">
                {values.map((value, index) => (
                  <div key={index} className="relative pl-8 group cursor-pointer">
                    <div className={`absolute left-[-6px] top-2 w-3 h-3 rounded-full border-2 border-white transition-colors duration-300 ${
                      isVisible ? `bg-${value.color === 'accent' ? 'warmPink' : value.color}-500` : 'bg-neutral-300'
                    }`}></div>
                    <h4 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {value.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Cards Stack */}
          <div className="space-y-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group bg-white rounded-3xl p-8 shadow-lg border border-neutral-100 hover:border-primary-200 transition-all duration-500 transform ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:rotate-6 ${
                    value.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                    value.color === 'lavender' ? 'bg-lavender-100 text-lavender-600' :
                    value.color === 'mint' ? 'bg-mint-100 text-mint-600' :
                    'bg-warmPink-100 text-warmPink-600'
                  }`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      {value.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {value.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            value.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                            value.color === 'lavender' ? 'bg-lavender-100 text-lavender-600' :
                            value.color === 'mint' ? 'bg-mint-100 text-mint-600' :
                            'bg-warmPink-100 text-warmPink-600'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
