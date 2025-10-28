interface ConversationListItemProps {
  id: string;
  title: string;
  timestamp: string;
  isActive: boolean;
  isOngoing: boolean;
  onClick: () => void;
}

export function ConversationListItem({
  title,
  timestamp,
  isActive,
  isOngoing,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-lg transition-all duration-200
        ${isActive
          ? "bg-primary-50 border-l-4 border-primary-500"
          : "hover:bg-white hover:shadow-sm"
        }
      `}
    >
      <div className="flex items-start gap-2 mb-1">
        <span className="text-lg flex-shrink-0">
          {isOngoing ? "🟢" : "⚪"}
        </span>
        <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">
          {title}
        </h3>
      </div>
      <p className="text-xs text-neutral-500 ml-6">{timestamp}</p>
    </button>
  );
}
