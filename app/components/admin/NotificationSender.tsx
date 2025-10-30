import { useState } from "react";
import { Send, Users, User, Bell } from "lucide-react";
import { Button } from "../Button";

export function NotificationSender() {
  const [targetType, setTargetType] = useState<"all" | "specific">("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [specificUsers, setSpecificUsers] = useState("");

  const handleSend = () => {
    console.log("Sending notification:", {
      targetType,
      title,
      message,
      specificUsers: targetType === "specific" ? specificUsers.split(",") : [],
    });
    alert("알림이 발송되었습니다!");
    // Reset form
    setTitle("");
    setMessage("");
    setSpecificUsers("");
  };

  const isValid = title.trim() && message.trim() && (targetType === "all" || specificUsers.trim());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-h3 text-neutral-900">알림 발송</h2>
          <p className="text-body-sm text-neutral-600">
            전체 또는 특정 사용자에게 알림을 보내세요
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Target Type */}
        <div>
          <label className="block text-body font-medium text-neutral-900 mb-3">
            발송 대상
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTargetType("all")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                targetType === "all"
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">전체 사용자</span>
            </button>
            <button
              onClick={() => setTargetType("specific")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                targetType === "specific"
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">특정 사용자</span>
            </button>
          </div>
        </div>

        {/* Specific Users Input */}
        {targetType === "specific" && (
          <div>
            <label className="block text-body font-medium text-neutral-900 mb-2">
              사용자 ID (쉼표로 구분)
            </label>
            <input
              type="text"
              value={specificUsers}
              onChange={(e) => setSpecificUsers(e.target.value)}
              placeholder="예: user1@email.com, user2@email.com"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-caption text-neutral-500 mt-2">
              이메일 주소를 쉼표로 구분하여 입력하세요
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-body font-medium text-neutral-900 mb-2">
            알림 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="알림 제목을 입력하세요"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={50}
          />
          <p className="text-caption text-neutral-500 mt-2">
            {title.length}/50자
          </p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-body font-medium text-neutral-900 mb-2">
            알림 내용
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="알림 메시지를 입력하세요"
            rows={5}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            maxLength={200}
          />
          <p className="text-caption text-neutral-500 mt-2">
            {message.length}/200자
          </p>
        </div>

        {/* Preview */}
        {(title || message) && (
          <div className="glass-strong rounded-lg p-4 border border-primary-200 bg-gradient-to-br from-primary-50 to-lavender-50">
            <p className="text-caption font-semibold text-neutral-600 mb-2">
              미리보기
            </p>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-body font-semibold text-neutral-900 mb-1">
                    {title || "알림 제목"}
                  </h4>
                  <p className="text-body-sm text-neutral-600">
                    {message || "알림 내용이 여기에 표시됩니다"}
                  </p>
                  <p className="text-caption text-neutral-500 mt-2">방금 전</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSend}
            disabled={!isValid}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {targetType === "all" ? "전체 사용자에게 발송" : "선택한 사용자에게 발송"}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              setTitle("");
              setMessage("");
              setSpecificUsers("");
            }}
            className="border-2 border-neutral-300"
          >
            초기화
          </Button>
        </div>

        {/* Warning */}
        <div className="glass rounded-lg p-4 border border-accent-200 bg-accent-50">
          <p className="text-body-sm text-neutral-700">
            <span className="font-semibold">⚠️ 주의:</span> 발송된 알림은 취소할 수 없습니다.
            내용을 확인하신 후 발송해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
