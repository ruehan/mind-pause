import { Target, CheckCircle, Calendar, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  const filters: Array<{
    id: "progress" | "completed" | "upcoming" | "popular";
    icon: LucideIcon;
    label: string;
  }> = [
    { id: "progress" as const, icon: Target, label: "진행중" },
    { id: "completed" as const, icon: CheckCircle, label: "완료" },
    { id: "upcoming" as const, icon: Calendar, label: "예정" },
    { id: "popular" as const, icon: Flame, label: "인기" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${
                  activeFilter === filter.id
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
    </div>
  );
}
