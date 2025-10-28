import { Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface InsightSection {
  icon: LucideIcon;
  title: string;
  content: string;
}

interface AIInsightCardProps {
  weeklyChange: InsightSection;
  pattern: InsightSection;
  achievement: InsightSection;
  onViewDetail?: () => void;
}

export function AIInsightCard({
  weeklyChange,
  pattern,
  achievement,
  onViewDetail,
}: AIInsightCardProps) {
  const sections = [weeklyChange, pattern, achievement];

  return (
    <div className="bg-gradient-to-br from-primary-50 to-lavender-50 border-2 border-primary-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h4 text-neutral-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary-600" />
          AI 인사이트
        </h2>
        {onViewDetail && (
          <button
            onClick={onViewDetail}
            className="text-body-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            자세히 보기 →
          </button>
        )}
      </div>

      {/* Insight Sections */}
      <div>
        {sections.map((section, index) => {
          const SectionIcon = section.icon;
          return (
            <div
              key={index}
              className={`${index < sections.length - 1 ? "mb-4 pb-4 border-b border-neutral-200" : ""}`}
            >
              <h3 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                <SectionIcon className="w-5 h-5 text-primary-600" />
                {section.title}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {section.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
