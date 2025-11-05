import ReactNiceAvatar from "react-nice-avatar";
import { ClientOnly } from "../ClientOnly";
import type { AvatarOptions } from "../../lib/api";

interface TypingIndicatorProps {
  avatarOptions?: AvatarOptions;
  aiName?: string;
}

export function TypingIndicator({ avatarOptions, aiName = "AI 코치" }: TypingIndicatorProps) {
  // Default AI avatar config
  const defaultAIAvatar = {
    sex: "woman" as const,
    faceColor: "#F9C9B6",
    earSize: "small" as const,
    eyeStyle: "circle" as const,
    noseStyle: "short" as const,
    mouthStyle: "smile" as const,
    shirtStyle: "polo" as const,
    glassesStyle: "none" as const,
    hairColor: "#506AF4",
    hairStyle: "womanLong" as const,
    hatStyle: "none" as const,
    hatColor: "#000",
    eyeBrowStyle: "up" as const,
    shirtColor: "#9287FF",
    bgColor: "#E0DDFF",
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="flex flex-row gap-3 max-w-[70%] sm:max-w-[85%]">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary-200 hover:ring-4 hover:ring-primary-300 transition-all duration-300 animate-float group cursor-pointer">
          <ClientOnly
            fallback={
              <div className="w-10 h-10 bg-primary-100 flex items-center justify-center text-lg">
                🤖
              </div>
            }
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              <ReactNiceAvatar
                style={{ width: "40px", height: "40px" }}
                {...((avatarOptions || defaultAIAvatar) as any)}
              />
            </div>
          </ClientOnly>
        </div>

        <div className="flex flex-col">
          {/* AI Name */}
          <span className="text-caption text-neutral-600 mb-1 font-medium">
            {aiName}
          </span>

          {/* Typing Bubble */}
          <div className="px-4 py-3 bg-white border border-neutral-200 rounded-2xl rounded-tl-sm">
            <div className="flex items-center gap-1">
              <span className="text-body-sm text-neutral-500">
                입력 중
              </span>
              <div className="flex gap-1 ml-2">
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
