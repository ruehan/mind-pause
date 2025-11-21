import { LayoutGrid, CheckCircle2, Clock } from "lucide-react";

interface ChallengeFilterProps {
  activeFilter: "all" | "my" | "pending";
  onFilterChange: (filter: "all" | "my" | "pending") => void;
  counts: {
    all: number;
    my: number;
    pending: number;
  };
}

export function ChallengeFilter({ activeFilter, onFilterChange, counts }: ChallengeFilterProps) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onFilterChange("all")}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200
          ${activeFilter === "all"
            ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20"
            : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
          }
        `}
      >
        <LayoutGrid className="w-4 h-4" />
        전체 챌린지
        <span className={`ml-1 text-xs py-0.5 px-2 rounded-full ${activeFilter === "all" ? "bg-white/20" : "bg-neutral-100"}`}>
          {counts.all}
        </span>
      </button>

      <button
        onClick={() => onFilterChange("my")}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200
          ${activeFilter === "my"
            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
            : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
          }
        `}
      >
        <CheckCircle2 className="w-4 h-4" />
        내 챌린지
        <span className={`ml-1 text-xs py-0.5 px-2 rounded-full ${activeFilter === "my" ? "bg-white/20" : "bg-neutral-100"}`}>
          {counts.my}
        </span>
      </button>

      {counts.pending > 0 && (
        <button
          onClick={() => onFilterChange("pending")}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200
            ${activeFilter === "pending"
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
              : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
            }
          `}
        >
          <Clock className="w-4 h-4" />
          승인 대기
          <span className={`ml-1 text-xs py-0.5 px-2 rounded-full ${activeFilter === "pending" ? "bg-white/20" : "bg-neutral-100"}`}>
            {counts.pending}
          </span>
        </button>
      )}
    </div>
  );
}
