import { useState } from "react";
import { Button } from "../Button";
import { useToast } from "../ToastProvider";
import { AvatarPreview } from "./AvatarPreview";
import * as api from "../../lib/api";
import {
  Sparkles,
  RotateCcw,
  User,
  Scissors,
  Shirt,
  Users,
  Palette,
  Circle,
  Eye,
  Glasses,
  Smile
} from "lucide-react";

// react-nice-avatar 옵션 정의
const avatarOptions = {
  sex: [
    { value: "man", label: "남성" },
    { value: "woman", label: "여성" },
  ],
  faceColor: [
    { value: "#F9C9B6", label: "밝은", color: "#F9C9B6" },
    { value: "#AC6651", label: "어두운", color: "#AC6651" },
  ],
  earSize: [
    { value: "small", label: "작음" },
    { value: "big", label: "큼" },
  ],
  hairStyle: [
    { value: "normal", label: "기본" },
    { value: "thick", label: "두꺼운" },
    { value: "mohawk", label: "모히칸" },
    { value: "womanLong", label: "긴 머리" },
    { value: "womanShort", label: "짧은 머리" },
  ],
  hairColor: [
    { value: "#000", label: "검정", color: "#000" },
    { value: "#77311D", label: "갈색", color: "#77311D" },
    { value: "#FC909F", label: "핑크", color: "#FC909F" },
    { value: "#D2EFF3", label: "하늘", color: "#D2EFF3" },
    { value: "#506AF4", label: "파랑", color: "#506AF4" },
    { value: "#F48150", label: "주황", color: "#F48150" },
  ],
  hatStyle: [
    { value: "none", label: "없음" },
    { value: "beanie", label: "비니" },
    { value: "turban", label: "터번" },
  ],
  hatColor: [
    { value: "#000", label: "검정", color: "#000" },
    { value: "#FC909F", label: "핑크", color: "#FC909F" },
    { value: "#D2EFF3", label: "하늘", color: "#D2EFF3" },
    { value: "#506AF4", label: "파랑", color: "#506AF4" },
    { value: "#F48150", label: "주황", color: "#F48150" },
  ],
  eyeStyle: [
    { value: "circle", label: "동그란" },
    { value: "oval", label: "타원형" },
    { value: "smile", label: "스마일" },
  ],
  glassesStyle: [
    { value: "none", label: "없음" },
    { value: "round", label: "둥근" },
    { value: "square", label: "사각" },
  ],
  noseStyle: [
    { value: "short", label: "짧은" },
    { value: "long", label: "긴" },
    { value: "round", label: "둥근" },
  ],
  mouthStyle: [
    { value: "laugh", label: "웃음" },
    { value: "smile", label: "미소" },
    { value: "peace", label: "평화" },
  ],
  shirtStyle: [
    { value: "hoody", label: "후드티" },
    { value: "short", label: "반팔" },
    { value: "polo", label: "폴로" },
  ],
  shirtColor: [
    { value: "#77311D", label: "갈색", color: "#77311D" },
    { value: "#FC909F", label: "핑크", color: "#FC909F" },
    { value: "#D2EFF3", label: "하늘", color: "#D2EFF3" },
    { value: "#506AF4", label: "파랑", color: "#506AF4" },
    { value: "#F48150", label: "주황", color: "#F48150" },
    { value: "#9287FF", label: "보라", color: "#9287FF" },
  ],
};

const defaultAvatarOptions = {
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

const personalityPresets = [
  { value: "공감하고 격려하는 친구", label: "따뜻한 친구" },
  { value: "전문적인 심리 상담사", label: "전문 상담사" },
  { value: "긍정적이고 밝은 멘토", label: "밝은 멘토" },
  { value: "차분하고 지혜로운 선생님", label: "지혜로운 선생님" },
];

interface AICharacterCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AICharacterCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: AICharacterCreateModalProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [customPersonality, setCustomPersonality] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatarOptions);
  const [activeTab, setActiveTab] = useState<"info" | "face" | "hair" | "clothing">("info");

  if (!isOpen) return null;

  const handleReset = () => {
    setAvatar(defaultAvatarOptions);
  };

  const handleRandomize = () => {
    const randomSex = avatarOptions.sex[Math.floor(Math.random() * avatarOptions.sex.length)].value;
    const randomFaceColor = avatarOptions.faceColor[Math.floor(Math.random() * avatarOptions.faceColor.length)].value;
    const randomEarSize = avatarOptions.earSize[Math.floor(Math.random() * avatarOptions.earSize.length)].value;
    const randomHairStyle = avatarOptions.hairStyle[Math.floor(Math.random() * avatarOptions.hairStyle.length)].value;
    const randomHairColor = avatarOptions.hairColor[Math.floor(Math.random() * avatarOptions.hairColor.length)].value;
    const randomHatStyle = avatarOptions.hatStyle[Math.floor(Math.random() * avatarOptions.hatStyle.length)].value;
    const randomHatColor = avatarOptions.hatColor[Math.floor(Math.random() * avatarOptions.hatColor.length)].value;
    const randomEyeStyle = avatarOptions.eyeStyle[Math.floor(Math.random() * avatarOptions.eyeStyle.length)].value;
    const randomGlassesStyle = avatarOptions.glassesStyle[Math.floor(Math.random() * avatarOptions.glassesStyle.length)].value;
    const randomNoseStyle = avatarOptions.noseStyle[Math.floor(Math.random() * avatarOptions.noseStyle.length)].value;
    const randomMouthStyle = avatarOptions.mouthStyle[Math.floor(Math.random() * avatarOptions.mouthStyle.length)].value;
    const randomShirtStyle = avatarOptions.shirtStyle[Math.floor(Math.random() * avatarOptions.shirtStyle.length)].value;
    const randomShirtColor = avatarOptions.shirtColor[Math.floor(Math.random() * avatarOptions.shirtColor.length)].value;

    setAvatar({
      sex: randomSex as any,
      faceColor: randomFaceColor,
      earSize: randomEarSize as any,
      hairStyle: randomHairStyle as any,
      hairColor: randomHairColor,
      hatStyle: randomHatStyle as any,
      hatColor: randomHatColor,
      eyeStyle: randomEyeStyle as any,
      glassesStyle: randomGlassesStyle as any,
      noseStyle: randomNoseStyle as any,
      mouthStyle: randomMouthStyle as any,
      shirtStyle: randomShirtStyle as any,
      shirtColor: randomShirtColor,
      bgColor: "transparent",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("입력 오류", "캐릭터 이름을 입력해주세요");
      return;
    }

    const finalPersonality = personality === "custom" ? customPersonality : personality;

    if (!finalPersonality.trim()) {
      toast.error("입력 오류", "캐릭터 성격을 선택하거나 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      await api.createAICharacter({
        name: name.trim(),
        personality: finalPersonality.trim(),
        description: description.trim() || undefined,
        avatar_options: avatar,
      });

      toast.success("성공", "AI 친구가 생성되었습니다");
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof api.UnauthorizedError) {
        toast.error("인증 오류", "다시 로그인해주세요");
      } else if (error instanceof Error) {
        toast.error("오류", error.message);
      } else {
        toast.error("오류", "캐릭터 생성 중 오류가 발생했습니다");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "info" as const, label: "기본 정보", icon: User },
    { id: "face" as const, label: "얼굴", icon: User },
    { id: "hair" as const, label: "헤어", icon: Scissors },
    { id: "clothing" as const, label: "의상", icon: Shirt },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-strong rounded-2xl shadow-elevation-3 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-h3 text-neutral-900">AI 친구 만들기</h2>
                <p className="text-body-sm text-neutral-600 mt-1">
                  당신만의 AI 친구를 만들어보세요
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleRandomize}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  랜덤
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  초기화
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="flex justify-center py-4">
              <AvatarPreview options={avatar} size={160} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-200 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2
                    ${activeTab === tab.id
                      ? "text-primary-600 border-primary-600"
                      : "text-neutral-600 border-transparent hover:text-neutral-900"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[400px] overflow-y-auto">
            {/* Info Tab */}
            {activeTab === "info" && (
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-body font-semibold text-neutral-900 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 따뜻한 친구"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    maxLength={100}
                  />
                </div>

                {/* Personality */}
                <div>
                  <label className="block text-body font-semibold text-neutral-900 mb-2">
                    성격 *
                  </label>
                  <div className="space-y-3">
                    {personalityPresets.map((preset) => (
                      <label
                        key={preset.value}
                        className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="personality"
                          value={preset.value}
                          checked={personality === preset.value}
                          onChange={(e) => setPersonality(e.target.value)}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <div>
                          <div className="text-body font-medium text-neutral-900">
                            {preset.label}
                          </div>
                          <div className="text-body-sm text-neutral-600">
                            {preset.value}
                          </div>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="personality"
                        value="custom"
                        checked={personality === "custom"}
                        onChange={(e) => setPersonality(e.target.value)}
                        className="text-primary-500 focus:ring-primary-500 mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-body font-medium text-neutral-900 mb-2">
                          직접 입력
                        </div>
                        <input
                          type="text"
                          value={customPersonality}
                          onChange={(e) => setCustomPersonality(e.target.value)}
                          placeholder="원하는 성격을 입력하세요"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          maxLength={200}
                          disabled={personality !== "custom"}
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-body font-semibold text-neutral-900 mb-2">
                    설명 (선택)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="AI 친구에 대한 추가 설명을 입력하세요"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Face Tab */}
            {activeTab === "face" && (
              <div className="space-y-6">
                {/* Sex */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">성별</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.sex.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, sex: s.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.sex === s.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Face Color */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">피부색</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.faceColor.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, faceColor: color.value })}
                        className={`
                          w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                          ${avatar.faceColor === color.value
                            ? "border-primary-500 shadow-lg ring-2 ring-primary-200"
                            : "border-neutral-200 hover:border-primary-300"
                          }
                        `}
                        style={{ backgroundColor: color.color }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Ear Size */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Circle className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">귀 크기</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.earSize.map((ear) => (
                      <button
                        key={ear.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, earSize: ear.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.earSize === ear.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {ear.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Style */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">눈 모양</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.eyeStyle.map((eye) => (
                      <button
                        key={eye.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, eyeStyle: eye.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.eyeStyle === eye.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {eye.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glasses */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Glasses className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">안경</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.glassesStyle.map((glasses) => (
                      <button
                        key={glasses.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, glassesStyle: glasses.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.glassesStyle === glasses.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {glasses.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nose */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Circle className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">코 모양</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.noseStyle.map((nose) => (
                      <button
                        key={nose.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, noseStyle: nose.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.noseStyle === nose.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {nose.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mouth */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Smile className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">입 모양</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.mouthStyle.map((mouth) => (
                      <button
                        key={mouth.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, mouthStyle: mouth.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.mouthStyle === mouth.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {mouth.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Hair Tab */}
            {activeTab === "hair" && (
              <div className="space-y-6">
                {/* Hair Style */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Scissors className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">헤어스타일</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.hairStyle.map((hair) => (
                      <button
                        key={hair.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, hairStyle: hair.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.hairStyle === hair.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {hair.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">머리 색상</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.hairColor.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, hairColor: color.value })}
                        className={`
                          w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                          ${avatar.hairColor === color.value
                            ? "border-primary-500 shadow-lg ring-2 ring-primary-200"
                            : "border-neutral-200 hover:border-primary-300"
                          }
                        `}
                        style={{ backgroundColor: color.color }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Hat Style */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Circle className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">모자</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.hatStyle.map((hat) => (
                      <button
                        key={hat.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, hatStyle: hat.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.hatStyle === hat.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {hat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hat Color */}
                {avatar.hatStyle !== "none" && (
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-4 h-4 text-primary-600" />
                      <label className="text-sm font-semibold text-neutral-900">모자 색상</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.hatColor.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setAvatar({ ...avatar, hatColor: color.value })}
                          className={`
                            w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                            ${avatar.hatColor === color.value
                              ? "border-primary-500 shadow-lg ring-2 ring-primary-200"
                              : "border-neutral-200 hover:border-primary-300"
                            }
                          `}
                          style={{ backgroundColor: color.color }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clothing Tab */}
            {activeTab === "clothing" && (
              <div className="space-y-6">
                {/* Shirt Style */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shirt className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">의상 스타일</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.shirtStyle.map((shirt) => (
                      <button
                        key={shirt.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, shirtStyle: shirt.value as any })}
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${avatar.shirtStyle === shirt.value
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                          }
                        `}
                      >
                        {shirt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shirt Color */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-primary-600" />
                    <label className="text-sm font-semibold text-neutral-900">의상 색상</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.shirtColor.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setAvatar({ ...avatar, shirtColor: color.value })}
                        className={`
                          w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                          ${avatar.shirtColor === color.value
                            ? "border-primary-500 shadow-lg ring-2 ring-primary-200"
                            : "border-neutral-200 hover:border-primary-300"
                          }
                        `}
                        style={{ backgroundColor: color.color }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "생성 중..." : "만들기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
