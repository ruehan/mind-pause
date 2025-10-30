import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AIAvatarCustomizer } from "../components/chat/AIAvatarCustomizer";
import { AvatarPreview } from "../components/chat/AvatarPreview";

export function meta() {
  return [
    { title: "AI 아바타 커스터마이징 - 마음쉼표" },
    {
      name: "description",
      content: "나만의 AI 코치 아바타를 만들어보세요",
    },
  ];
}

const defaultOptions = {
  sex: "man",
  faceColor: "#F9C9B6",
  earSize: "small",
  hairStyle: "normal",
  hairColor: "#000",
  hatStyle: "none",
  hatColor: "#000",
  eyeStyle: "circle",
  glassesStyle: "none",
  noseStyle: "short",
  mouthStyle: "smile",
  shirtStyle: "hoody",
  shirtColor: "#506AF4",
  bgColor: "transparent",
};

export default function AvatarDemo() {
  const [savedAvatar, setSavedAvatar] = useState(defaultOptions);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleSave = (options: typeof defaultOptions) => {
    setSavedAvatar(options);
    setIsCustomizing(false);
    console.log("Saved avatar options:", options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-lavender-50 relative">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 gradient-mesh opacity-20 animate-gradient bg-[length:200%_200%] pointer-events-none"></div>

      <div className="relative z-10">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎨</span>
            <div>
              <h1 className="text-h2 text-gradient-primary font-bold">AI 아바타 커스터마이징</h1>
              <p className="text-body text-neutral-600 mt-1">
                나만의 AI 코치 아바타를 만들어보세요
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!isCustomizing ? (
            // 저장된 아바타 미리보기
            <div className="glass-strong rounded-2xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 p-8 text-center">
              <h2 className="text-h3 text-neutral-900 mb-6">현재 AI 코치 아바타</h2>
              <div className="flex justify-center mb-6">
                <AvatarPreview options={savedAvatar} size={250} />
              </div>
              <button
                onClick={() => setIsCustomizing(true)}
                className="gradient-primary text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-primary transition-all duration-300 transform hover:scale-105 font-medium"
              >
                아바타 커스터마이징하기
              </button>
            </div>
          ) : (
            // 커스터마이저
            <AIAvatarCustomizer
              onSave={handleSave}
              onCancel={() => setIsCustomizing(false)}
            />
          )}

          {/* 사용 예시 안내 */}
          <div className="mt-8 glass rounded-xl shadow-soft p-6 border border-white/20">
            <h3 className="text-h4 text-neutral-900 mb-4">💡 사용 팁</h3>
            <ul className="space-y-2 text-body text-neutral-700">
              <li>• <strong>랜덤 버튼</strong>을 눌러 빠르게 다양한 조합을 시도해보세요</li>
              <li>• <strong>탭</strong>을 전환하며 얼굴, 헤어, 의상을 각각 설정할 수 있습니다</li>
              <li>• 색상 옵션은 <strong>클릭</strong>하여 바로 적용됩니다</li>
              <li>• 마음에 드는 아바타가 완성되면 <strong>저장하기</strong>를 눌러주세요</li>
            </ul>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
