import { useState, useRef, useEffect } from "react";
import { Send, Mic, Smile } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoiceInput?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSend, 
  onVoiceInput, 
  disabled = false,
  placeholder = "AI 코치에게 하고 싶은 말을 적어보세요..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-t from-neutral-50 via-neutral-50 to-transparent">
      <div className="max-w-4xl mx-auto relative">
        <div className="glass-strong rounded-3xl shadow-lg border border-white/60 p-2 flex items-end gap-2 transition-all duration-300 focus-within:shadow-xl focus-within:border-primary-200">
          
          {/* Voice Input Button */}
          <button
            onClick={onVoiceInput}
            className="p-3 rounded-full text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors flex-shrink-0"
            title="음성 입력 (준비 중)"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-body text-neutral-900 placeholder:text-neutral-400 max-h-[120px] overflow-y-auto"
          />

          {/* Emoji Button (Optional) */}
          <button
            className="p-3 rounded-full text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors flex-shrink-0 hidden sm:block"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className={`
              p-3 rounded-full flex-shrink-0 transition-all duration-200
              ${message.trim() && !disabled
                ? "bg-primary-500 text-white shadow-md hover:bg-primary-600 hover:scale-105 active:scale-95"
                : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
              }
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-caption text-neutral-400">
            AI는 실수할 수 있습니다. 중요한 정보는 확인이 필요합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
