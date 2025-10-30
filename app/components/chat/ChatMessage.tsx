import ReactNiceAvatar from "react-nice-avatar";
import { ClientOnly } from "../ClientOnly";

interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  timestamp: string;
  avatarOptions?: Record<string, string>;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  avatarOptions,
}: ChatMessageProps) {
  const isAI = role === "ai";

  // Default AI avatar config
  const defaultAIAvatar = {
    sex: "woman",
    faceColor: "#F9C9B6",
    earSize: "small",
    eyeStyle: "circle",
    noseStyle: "short",
    mouthStyle: "smile",
    shirtStyle: "polo",
    glassesStyle: "none",
    hairColor: "#506AF4",
    hairStyle: "womanLong",
    hatStyle: "none",
    hatColor: "#000",
    eyeBrowStyle: "up",
    shirtColor: "#9287FF",
    bgColor: "#E0DDFF",
  };

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`flex ${
          isAI ? "flex-row" : "flex-row-reverse"
        } gap-3 max-w-[70%] sm:max-w-[85%]`}
      >
        {/* Avatar */}
        {isAI && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-200 animate-float">
            <ClientOnly
              fallback={
                <div className="w-10 h-10 bg-primary-100 flex items-center justify-center text-lg">
                  🤖
                </div>
              }
            >
              <ReactNiceAvatar
                style={{ width: "40px", height: "40px" }}
                {...(avatarOptions || defaultAIAvatar)}
              />
            </ClientOnly>
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
