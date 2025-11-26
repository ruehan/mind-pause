import type { Route } from "./+types/home_old";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/home/HeroSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { CoreValuesSection } from "../components/home/CoreValuesSection";
import { TargetAudienceSection } from "../components/home/TargetAudienceSection";
import { FinalCTASection } from "../components/home/FinalCTASection";

// 실제 데이터가 생기면 아래 섹션들로 교체 가능:
// import { RealStatisticsSection } from "../components/home/RealStatisticsSection";
// import { RealTestimonialsSection } from "../components/home/RealTestimonialsSection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "마음쉼표 - AI 기반 감정 케어 서비스" },
    {
      name: "description",
      content:
        "AI와 함께하는 감정 기록과 코칭. 마음의 쉼표가 필요한 순간, 언제든 함께합니다.",
    },
    {
      name: "keywords",
      content: "감정 케어, AI 코칭, 감정 일기, 마음 건강, 정서 관리",
    },
    { property: "og:title", content: "마음쉼표 - AI 기반 감정 케어 서비스" },
    {
      property: "og:description",
      content: "AI와 함께하는 감정 기록과 코칭",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CoreValuesSection />
        <TargetAudienceSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
