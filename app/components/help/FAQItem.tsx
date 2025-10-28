interface FAQItemProps {
  question: string;
  shortAnswer: string;
  isPopular?: boolean;
  onViewDetail: () => void;
}

export function FAQItem({
  question,
  shortAnswer,
  isPopular = false,
  onViewDetail,
}: FAQItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-3 hover:shadow-md transition-shadow">
      {isPopular && (
        <div className="mb-2">
          <span className="text-xs font-semibold text-error-600 bg-error-50 px-2 py-1 rounded">
            🔥 인기 질문
          </span>
        </div>
      )}
      <h4 className="text-base font-semibold text-neutral-800 mb-2">
        Q. {question}
      </h4>
      <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
        A. {shortAnswer}
      </p>
      <button
        onClick={onViewDetail}
        className="text-sm text-primary-600 hover:underline font-medium"
      >
        자세히 보기 →
      </button>
    </div>
  );
}
