export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex flex-row gap-3 max-w-[70%] sm:max-w-[85%]">
        {/* AI Avatar Placeholder */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-lg">
          🤖
        </div>

        <div className="flex flex-col">
          {/* Typing Bubble */}
          <div className="px-4 py-3 bg-white border border-neutral-200 rounded-2xl rounded-tl-sm">
            <div className="flex items-center gap-1">
              <span className="text-body-sm text-neutral-500">
                AI 코치가 입력 중
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
