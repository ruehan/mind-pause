import { HeroSection } from "~/components/home-improve/HeroSection";
import { FeaturesSection } from "~/components/home-improve/FeaturesSection";
import { CoreValuesSection } from "~/components/home-improve/CoreValuesSection";
import { TestimonialsSection } from "~/components/home-improve/TestimonialsSection";
import { CTASection } from "~/components/home-improve/CTASection";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import type { Route } from "./+types/home_improve";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "마음쉼표 - AI 감정 케어 (New)" },
    { name: "description", content: "더 나은 마음 건강을 위한 AI 파트너, 마음쉼표의 새로운 홈 화면입니다." },
  ];
}

export default function HomeImprove() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CoreValuesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
