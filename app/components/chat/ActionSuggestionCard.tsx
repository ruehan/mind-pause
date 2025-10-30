import { Lightbulb } from "lucide-react";
import { Button } from "../Button";

interface ActionSuggestionCardProps {
  title: string;
  onClick: () => void;
}

export function ActionSuggestionCard({ title, onClick }: ActionSuggestionCardProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%] sm:max-w-[85%]">
        <div className="bg-gradient-to-r from-primary-50 to-lavender-50 border-2 border-primary-200 rounded-xl p-4 shadow-soft hover:shadow-primary transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary-600 animate-float" />
            <span className="text-body font-medium text-neutral-800">
              제안: {title}
            </span>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={onClick}
            className="w-full"
          >
            지금 시작하기 →
          </Button>
        </div>
      </div>
    </div>
  );
}
