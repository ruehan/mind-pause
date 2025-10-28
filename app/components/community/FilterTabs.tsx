import { Flame, FileText, Heart, MessageCircle, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FilterTabsProps {
  activeFilter: "popular" | "latest" | "most-liked" | "most-commented";
  onFilterChange: (filter: "popular" | "latest" | "most-liked" | "most-commented") => void;
  onSearch: () => void;
}

export function FilterTabs({ activeFilter, onFilterChange, onSearch }: FilterTabsProps) {
  const filters: Array<{ id: "popular" | "latest" | "most-liked" | "most-commented"; icon: LucideIcon; label: string }> = [
    { id: "popular" as const, icon: Flame, label: "인기" },
    { id: "latest" as const, icon: FileText, label: "최신" },
    { id: "most-liked" as const, icon: Heart, label: "공감많은" },
    { id: "most-commented" as const, icon: MessageCircle, label: "댓글많은" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
      <div className="flex items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${activeFilter === filter.id
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-700 hover:bg-neutral-100"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Search Button */}
        <button
          onClick={onSearch}
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          aria-label="검색"
        >
          <Search className="w-5 h-5 text-neutral-600" />
        </button>
      </div>
    </div>
  );
}
