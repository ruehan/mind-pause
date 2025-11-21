import { Bot, User } from "lucide-react";
import { AvatarPreview } from "../chat/AvatarPreview";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  timestamp: string;
  avatarOptions?: any;
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
  isStreaming,
  shouldTypeEffect,
  onTypingComplete,
}: ChatMessageProps) {
  const isUser = role === "user";
  const [displayedContent, setDisplayedContent] = useState(shouldTypeEffect ? "" : content);

  useEffect(() => {
    if (!shouldTypeEffect) {
      setDisplayedContent(content);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        onTypingComplete?.();
      }
    }, 20); // Typing speed

    return () => clearInterval(interval);
  }, [content, shouldTypeEffect, onTypingComplete]);

  // If streaming, always show full content as it updates in real-time
  const textToShow = isStreaming ? content : displayedContent;

  return (
    <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shadow-sm">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-neutral-100 overflow-hidden">
              {avatarOptions ? (
                <AvatarPreview options={avatarOptions} size={40} />
              ) : (
                <Bot className="w-6 h-6 text-primary-600" />
              )}
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          {/* Name (AI only) */}
          {!isUser && aiName && (
            <span className="text-caption text-neutral-500 mb-1 ml-1">{aiName}</span>
          )}

          {/* Bubble */}
          <div
            className={`
              relative px-5 py-3.5 rounded-2xl text-body leading-relaxed shadow-sm min-h-[3rem] min-w-[4rem]
              ${isUser 
                ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm" 
                : "bg-white/80 backdrop-blur-sm border border-white/40 text-neutral-800 rounded-tl-sm"
              }
            `}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap">{textToShow}</div>
            ) : (
              <div className="markdown-body text-neutral-800">
                <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-neutral-900" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-neutral-800" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    a: ({node, ...props}) => <a className="text-primary-600 hover:underline font-medium" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary-200 pl-4 italic my-2 text-neutral-600 bg-neutral-50 py-2 pr-2 rounded-r" {...props} />,
                    code: ({node, ...props}) => {
                      const { className, children } = props;
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary-700 border border-neutral-200" {...props} />
                      ) : (
                        <code className="block bg-neutral-900 text-neutral-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2 shadow-inner" {...props} />
                      );
                    }
                  }}
                >
                  {textToShow}
                </ReactMarkdown>
              </div>
            )}
            {(isStreaming || (shouldTypeEffect && displayedContent.length < content.length)) && (
              <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary-400 animate-pulse" />
            )}
          </div>

          {/* Timestamp */}
          <span className="text-caption text-neutral-400 mt-1 px-1">
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
