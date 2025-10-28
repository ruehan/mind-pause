import { Button } from "../Button";

interface ActionSuggestionCardProps {
  title: string;
  onClick: () => void;
}

export function ActionSuggestionCard({ title, onClick }: ActionSuggestionCardProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%] sm:max-w-[85%]">
        <div className="bg-gradient-to-r from-primary-50 to-lavender-50 border-2 border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
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
