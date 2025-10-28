interface ChallengeFilterTabsProps {
  activeFilter: "progress" | "completed" | "upcoming" | "popular";
  onFilterChange: (
    filter: "progress" | "completed" | "upcoming" | "popular"
  ) => void;
}

export function ChallengeFilterTabs({
  activeFilter,
  onFilterChange,
}: ChallengeFilterTabsProps) {
  const filters = [
    { id: "progress" as const, icon: "🎯", label: "진행중" },
    { id: "completed" as const, icon: "✅", label: "완료" },
    { id: "upcoming" as const, icon: "📅", label: "예정" },
    { id: "popular" as const, icon: "🔥", label: "인기" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeFilter === filter.id
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-100"
              }
            `}
          >
            <span className="mr-1">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
