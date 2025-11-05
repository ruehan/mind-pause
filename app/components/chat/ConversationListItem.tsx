import { AvatarPreview } from "./AvatarPreview";

interface ConversationListItemProps {
  id: string;
  title: string;
  timestamp: string;
  isActive: boolean;
  isOngoing: boolean;
  characterName?: string;
  characterAvatar?: Record<string, string>;
  onClick: () => void;
}

export function ConversationListItem({
  title,
  timestamp,
  isActive,
  isOngoing,
  characterName,
  characterAvatar,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-white shadow-md border-2 border-primary-200 scale-[1.02]"
            : "bg-neutral-50 hover:bg-white hover:shadow-sm border-2 border-transparent hover:border-neutral-100"
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Character Avatar */}
        <div className="flex-shrink-0 relative">
          {characterAvatar ? (
            <AvatarPreview options={characterAvatar} size={40} />
          ) : (
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
              🤖
            </div>
          )}
          {/* Status indicator badge */}
          {isOngoing && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-mint-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with active indicator */}
          <div className="flex items-center gap-2 mb-1.5">
            {isActive && (
              <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 animate-pulse" />
            )}
            <h3
              className={`text-body font-semibold line-clamp-1 flex-1 ${
                isActive ? "text-neutral-900" : "text-neutral-800"
              }`}
            >
              {title}
            </h3>
          </div>

          {/* Character name and timestamp */}
          <div className="flex items-center gap-2 mt-2">
            {characterName && (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-xs text-primary-600 font-medium truncate">
                  {characterName}
                </span>
              </div>
            )}
            <span className="text-xs text-neutral-500 flex-shrink-0">
              {timestamp}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
