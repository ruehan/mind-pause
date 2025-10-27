import { Button } from "../Button";

export function FinalCTASection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-primary-50 via-lavender-50 to-primary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-h2 text-neutral-900 mb-6">
            지금 바로 시작해보세요
          </h2>

          {/* Subheadline */}
          <p className="text-body-lg text-neutral-600 mb-8">
            마음의 쉼표가 필요한 순간, 언제든 함께합니다
          </p>

          {/* CTA Button */}
          <Button variant="primary" size="lg" href="/login?mode=signup">
            무료로 시작하기 →
          </Button>

          {/* Additional info */}
          <p className="text-body-sm text-neutral-500 mt-6">
            신용카드 필요 없음 · 언제든 무료로 시작
          </p>
        </div>
      </div>
    </section>
  );
}
