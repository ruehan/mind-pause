import ReactNiceAvatar from "react-nice-avatar";
import { ClientOnly } from "../ClientOnly";
import { useState, useEffect } from "react";
import type { AvatarOptions } from "../../lib/api";

interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  timestamp: string;
  avatarOptions?: AvatarOptions;
  aiName?: string;
  isStreaming?: boolean;
  shouldTypeEffect?: boolean;
  onTypingComplete?: () => void;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  avatarOptions,
  aiName,
  isStreaming = false,
  shouldTypeEffect = false,
  onTypingComplete,
}: ChatMessageProps) {
  const isAI = role === "ai";
  const [isVisible, setIsVisible] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // 스트리밍 중이면 바로 표시
    if (isStreaming) {
      setDisplayedContent(content);
      setIsTyping(false);
      return;
    }

    // 타이핑 효과가 필요한 경우 (청크를 모두 받은 후)
    if (shouldTypeEffect && isAI) {
      let currentIndex = 0;
      const typingSpeed = 15; // ms per character

      setIsTyping(true);
      setDisplayedContent("");

      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          // 타이핑 완료 콜백 호출
          if (onTypingComplete) {
            onTypingComplete();
          }
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    } else {
      // 일반 메시지는 바로 표시
      setDisplayedContent(content);
      setIsTyping(false);
    }
  }, [content, isAI, shouldTypeEffect, onTypingComplete, isStreaming]);

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
    <div
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className={`flex ${
          isAI ? "flex-row" : "flex-row-reverse"
        } gap-3 max-w-[70%] sm:max-w-[85%]`}
      >
        {/* Avatar */}
        {isAI && (
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
        )}

        <div className="flex flex-col">
          {/* AI 이름 표시 */}
          {isAI && aiName && (
            <span className="text-caption text-neutral-600 mb-1 font-medium">
              {aiName}
            </span>
          )}

          {/* Message Bubble */}
          <div
            className={`
              px-4 py-3 shadow-sm transition-all duration-300 transform hover:scale-102
              ${isAI
                ? "bg-white border border-neutral-200 rounded-2xl rounded-tl-sm text-neutral-800 hover:shadow-md"
                : "bg-primary-500 rounded-2xl rounded-tr-sm text-white hover:bg-primary-600"
              }
            `}
          >
            <p className="text-body leading-relaxed whitespace-pre-wrap">
              {displayedContent}
              {(isTyping || isStreaming) && (
                <span className="inline-block w-1 h-4 bg-primary-500 ml-1 animate-pulse">|</span>
              )}
            </p>
          </div>

          {/* Timestamp */}
          <span
            className={`
              text-caption mt-1 transition-opacity duration-300
              ${isAI ? "text-neutral-500" : "text-primary-200 text-right"}
              ${(isTyping || isStreaming) ? "opacity-0" : "opacity-100"}
            `}
          >
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
