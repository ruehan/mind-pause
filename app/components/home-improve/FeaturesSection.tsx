import { FeatureCard } from "../home/FeatureCard";
import { FileText, MessageCircle, BarChart3, Target, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const features = [
  {
    icon: FileText,
    title: "감정 기록",
    description: "하루 5분, 간단한 기록으로 나를 이해하는 시간을 가져보세요.",
    color: "primary",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    rowSpan: "row-span-2"
  },
  {
    icon: MessageCircle,
    title: "AI 코칭",
    description: "판단 없이 경청하는 AI와 마음을 나누세요.",
    color: "lavender",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    rowSpan: "row-span-1"
  },
  {
    icon: BarChart3,
    title: "데이터 분석",
    description: "감정의 패턴을 시각적으로 확인하세요.",
    color: "mint",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    rowSpan: "row-span-1"
  },
  {
    icon: Target,
    title: "맞춤 챌린지",
    description: "긍정적인 습관을 만드는 21일 챌린지.",
    color: "orange",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-1",
    rowSpan: "row-span-1"
  },
  {
    icon: ShieldCheck,
    title: "철저한 보안",
    description: "모든 대화는 암호화되어 안전합니다.",
    color: "neutral",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-1",
    rowSpan: "row-span-1"
  }
];

export function FeaturesSection() {
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
    <section id="features" ref={sectionRef} className="py-24 bg-neutral-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>핵심 기능</span>
          </div>
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">
            마음 건강을 위한 <br className="sm:hidden" />
            <span className="text-primary-600">올인원 솔루션</span>
          </h2>
          <p className="text-lg text-neutral-600">
            단순한 기록을 넘어, AI 기술로 당신의 마음을 깊이 있게 분석하고 케어합니다.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100 ${feature.colSpan} ${feature.rowSpan} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                feature.color === 'primary' ? 'from-primary-500 to-primary-600' :
                feature.color === 'lavender' ? 'from-lavender-500 to-lavender-600' :
                feature.color === 'mint' ? 'from-mint-500 to-mint-600' :
                feature.color === 'orange' ? 'from-orange-500 to-orange-600' :
                'from-neutral-500 to-neutral-600'
              }`}></div>

              <div className="relative z-10 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                  feature.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  feature.color === 'lavender' ? 'bg-lavender-100 text-lavender-600' :
                  feature.color === 'mint' ? 'bg-mint-100 text-mint-600' :
                  feature.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  'bg-neutral-100 text-neutral-600'
                }`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Elements for Large Cards */}
                {feature.rowSpan === "row-span-2" && (
                  <div className="mt-auto pt-8 flex justify-center">
                    <div className="relative w-full max-w-[200px] aspect-[4/3] bg-neutral-50 rounded-xl overflow-hidden shadow-inner border border-neutral-100 group-hover:scale-105 transition-transform duration-500">
                      {/* Mock UI Elements */}
                      <div className="absolute top-3 left-3 right-3 h-2 bg-neutral-200 rounded-full"></div>
                      <div className="absolute top-8 left-3 w-1/2 h-2 bg-neutral-200 rounded-full"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary-100 to-transparent rounded-tl-full opacity-50"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
