import { useState } from "react";
import { Button } from "../Button";
import { Mic, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onVoiceInput?: () => void;
}

export function ChatInput({
  onSend,
  disabled = false,
  onVoiceInput,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceClick = () => {
    setIsRecording(!isRecording);
    onVoiceInput?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-neutral-200 bg-white p-4"
    >
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          type="button"
          className="flex-shrink-0 w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
          disabled={disabled}
          title="파일 첨부"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceClick}
          className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
            isRecording
              ? "border-error-500 bg-error-50 text-error-600 animate-pulse"
              : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
          }`}
          disabled={disabled}
          title={isRecording ? "녹음 중..." : "음성 입력"}
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          disabled={disabled}
          rows={1}
          className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg text-body text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:bg-neutral-100 disabled:cursor-not-allowed"
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />

        {/* Send Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0"
        >
          전송
        </Button>
      </div>
    </form>
  );
}
