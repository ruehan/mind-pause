interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isAI = role === "ai";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} gap-3 max-w-[70%] sm:max-w-[85%]`}>
        {/* Avatar (AI only) */}
        {isAI && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-lg">
            🤖
          </div>
        )}

        <div className="flex flex-col">
          {/* Message Bubble */}
          <div
            className={`
              px-4 py-3 shadow-sm
              ${isAI
                ? "bg-white border border-neutral-200 rounded-2xl rounded-tl-sm text-neutral-800"
                : "bg-primary-500 rounded-2xl rounded-tr-sm text-white"
              }
            `}
          >
            <p className="text-body leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>

          {/* Timestamp */}
          <span
            className={`
              text-caption mt-1
              ${isAI ? "text-neutral-500" : "text-primary-200 text-right"}
            `}
          >
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
