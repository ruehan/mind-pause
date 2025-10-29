import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../Button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center gap-2 bg-white rounded-lg shadow-sm border-2 border-neutral-300 p-4 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 transition-all"
    >
      <Search className="w-5 h-5 text-neutral-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요..."
        className="flex-1 outline-none text-body"
      />
      <Button type="submit" variant="primary" size="sm">
        검색
      </Button>
    </form>
  );
}
