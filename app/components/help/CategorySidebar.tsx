interface CategorySidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategorySidebar({
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  const categories = [
    { id: "getting_started", icon: "🏠", label: "시작하기" },
    { id: "emotion_log", icon: "📝", label: "감정 기록" },
    { id: "ai_coach", icon: "💬", label: "AI 코치" },
    { id: "community", icon: "👥", label: "커뮤니티" },
    { id: "challenge", icon: "🏆", label: "챌린지" },
    { id: "dashboard", icon: "📊", label: "대시보드" },
    { id: "settings", icon: "⚙️", label: "설정" },
    { id: "account", icon: "🔒", label: "계정/보안" },
    { id: "payment", icon: "💳", label: "결제/구독" },
    { id: "other", icon: "❓", label: "기타" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
      <h3 className="text-h4 text-neutral-900 mb-4 flex items-center gap-2">
        📂 카테고리
      </h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-2
              ${
                activeCategory === category.id
                  ? "bg-primary-50 border-l-4 border-primary-500 text-primary-700 font-medium"
                  : "hover:bg-neutral-100 text-neutral-700"
              }
            `}
          >
            <span>{category.icon}</span>
            <span className="text-sm">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
