import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItemProps {
  question: string;
  shortAnswer: string;
  fullAnswer?: string;
  isPopular?: boolean;
  category?: string;
}

export function FAQItem({
  question,
  shortAnswer,
  fullAnswer,
  isPopular = false,
  category,
}: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 mb-3 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Question Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-neutral-50 transition-colors"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-lavender-100 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-primary-600" />
        </div>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            {isPopular && (
              <span className="text-xs font-semibold text-error-600 bg-error-50 px-2 py-1 rounded">
                🔥 인기
              </span>
            )}
            {category && (
              <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                {category}
              </span>
            )}
          </div>

          {/* Question */}
          <h4 className="text-body font-semibold text-neutral-900 mb-2">
            {question}
          </h4>

          {/* Short Answer Preview */}
          {!isExpanded && (
            <p className="text-body-sm text-neutral-600 line-clamp-2">
              {shortAnswer}
            </p>
          )}
        </div>

        {/* Expand/Collapse Icon */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-neutral-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-500" />
          )}
        </div>
      </button>

      {/* Full Answer - Expandable */}
      {isExpanded && (
        <div className="px-5 pb-5 pl-[74px] border-t border-neutral-100 pt-4 animate-fade-in">
          <div className="prose prose-sm max-w-none">
            <p className="text-body text-neutral-700 whitespace-pre-wrap">
              {fullAnswer || shortAnswer}
            </p>
          </div>

          {/* Helpful Feedback */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <p className="text-body-sm text-neutral-600 mb-3">
              이 답변이 도움이 되었나요?
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-mint-50 text-mint-700 rounded-lg hover:bg-mint-100 transition-colors text-body-sm font-medium">
                👍 도움됨
              </button>
              <button className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-body-sm font-medium">
                👎 별로예요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
