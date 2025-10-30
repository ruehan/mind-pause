import { Link2 } from "lucide-react";

interface RelatedArticle {
  id: string;
  question: string;
  category: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  onArticleClick: (id: string) => void;
}

export function RelatedArticles({
  articles,
  onArticleClick,
}: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-neutral-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-primary-600" />
        <h3 className="text-body font-semibold text-neutral-900">
          이 글도 도움이 될 수 있어요
        </h3>
      </div>

      {/* Related Articles List */}
      <div className="space-y-2">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => onArticleClick(article.id)}
            className="w-full flex items-start gap-3 p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all duration-200 text-left group"
          >
            {/* Dot Indicator */}
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-400 mt-2 group-hover:bg-primary-600 transition-colors" />

            {/* Article Info */}
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
                {article.question}
              </p>
              <p className="text-caption text-neutral-500 mt-1">
                {article.category}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-neutral-400 group-hover:text-primary-600 transition-colors">
              →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
