import { useState } from "react";
import { AvatarPreview } from "./AvatarPreview";
import { Button } from "../Button";
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

interface AIAvatarCustomizerProps {
  onSave?: (options: typeof defaultOptions) => void;
  onCancel?: () => void;
}

export function AIAvatarCustomizer({ onSave, onCancel }: AIAvatarCustomizerProps) {
  const [options, setOptions] = useState(defaultOptions);
  const [activeTab, setActiveTab] = useState<"face" | "hair" | "clothing">("face");

  const handleReset = () => {
    setOptions(defaultOptions);
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

    setOptions({
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

  const tabs = [
    { id: "face" as const, label: "얼굴", icon: User },
    { id: "hair" as const, label: "헤어", icon: Scissors },
    { id: "clothing" as const, label: "의상", icon: Shirt },
  ];

  return (
    <div className="glass-strong rounded-2xl shadow-soft hover:shadow-elevation-3 transition-all duration-300 border border-white/20">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-neutral-900">AI 아바타 커스터마이징</h2>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRandomize}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              랜덤
            </Button>
            <Button
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
          <AvatarPreview options={options} size={180} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200/50 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2
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

      {/* Options */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
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
                    onClick={() => setOptions({ ...options, sex: s.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.sex === s.value
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
                    onClick={() => setOptions({ ...options, faceColor: color.value })}
                    className={`
                      w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                      ${options.faceColor === color.value
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
                    onClick={() => setOptions({ ...options, earSize: ear.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.earSize === ear.value
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
                    onClick={() => setOptions({ ...options, eyeStyle: eye.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.eyeStyle === eye.value
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
                    onClick={() => setOptions({ ...options, glassesStyle: glasses.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.glassesStyle === glasses.value
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
                    onClick={() => setOptions({ ...options, noseStyle: nose.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.noseStyle === nose.value
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
                    onClick={() => setOptions({ ...options, mouthStyle: mouth.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.mouthStyle === mouth.value
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
                    onClick={() => setOptions({ ...options, hairStyle: hair.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.hairStyle === hair.value
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
                    onClick={() => setOptions({ ...options, hairColor: color.value })}
                    className={`
                      w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                      ${options.hairColor === color.value
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
                    onClick={() => setOptions({ ...options, hatStyle: hat.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.hatStyle === hat.value
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
            {options.hatStyle !== "none" && (
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-primary-600" />
                  <label className="text-sm font-semibold text-neutral-900">모자 색상</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.hatColor.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setOptions({ ...options, hatColor: color.value })}
                      className={`
                        w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                        ${options.hatColor === color.value
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
                    onClick={() => setOptions({ ...options, shirtStyle: shirt.value as any })}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${options.shirtStyle === shirt.value
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
                    onClick={() => setOptions({ ...options, shirtColor: color.value })}
                    className={`
                      w-14 h-14 rounded-full transition-all duration-200 border-2 relative
                      ${options.shirtColor === color.value
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
      <div className="flex gap-3 p-6 border-t border-neutral-200/50">
        <Button
          variant="primary"
          onClick={() => onSave?.(options)}
          className="flex-1"
        >
          저장하기
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          취소
        </Button>
      </div>
    </div>
  );
}
