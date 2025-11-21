import { Search, X, PenLine } from "lucide-react";

interface CommunityHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  onWriteClick: () => void;
  activeSearch: string;
}

export function CommunityHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  onWriteClick,
  activeSearch,
}: CommunityHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in-down">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Title Section */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-lavender-100 flex items-center justify-center shadow-sm border border-white/50">
            <span className="text-3xl">💬</span>
          </div>
          <div>
            <h1 className="text-h2 font-bold text-neutral-900">커뮤니티</h1>
            <p className="text-body text-neutral-600 mt-1">
              함께 나누고 공감하는 따뜻한 공간
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <form onSubmit={onSearchSubmit} className="relative flex-1 sm:w-80">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="관심있는 이야기를 검색해보세요"
                className="
                  w-full pl-11 pr-10 py-3 
                  bg-white/80 backdrop-blur-sm border border-neutral-200 
                  rounded-xl shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                  transition-all duration-200
                "
              />
              {(searchQuery || activeSearch) && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Write Button */}
          <button
            onClick={onWriteClick}
            className="
              hidden md:flex items-center justify-center gap-2 px-6 py-3 
              bg-gradient-to-r from-primary-500 to-primary-600 
              text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 
              hover:shadow-primary-500/40 hover:-translate-y-0.5 
              transition-all duration-200
            "
          >
            <PenLine className="w-5 h-5" />
            <span>글쓰기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
