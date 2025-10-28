interface FilterTabsProps {
  activeFilter: "popular" | "latest" | "most-liked" | "most-commented";
  onFilterChange: (filter: "popular" | "latest" | "most-liked" | "most-commented") => void;
  onSearch: () => void;
}

export function FilterTabs({ activeFilter, onFilterChange, onSearch }: FilterTabsProps) {
  const filters = [
    { id: "popular" as const, icon: "🔥", label: "인기" },
    { id: "latest" as const, icon: "📝", label: "최신" },
    { id: "most-liked" as const, icon: "💝", label: "공감많은" },
    { id: "most-commented" as const, icon: "💬", label: "댓글많은" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
      <div className="flex items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeFilter === filter.id
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

        {/* Search Button */}
        <button
          onClick={onSearch}
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          aria-label="검색"
        >
          🔍
        </button>
      </div>
    </div>
  );
}
