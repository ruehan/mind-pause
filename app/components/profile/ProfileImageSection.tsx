import { useRef } from "react";
import { Button } from "../Button";

interface ProfileImageSectionProps {
  imageUrl?: string;
  onImageChange: (file: File) => void;
  onImageDelete: () => void;
}

export function ProfileImageSection({
  imageUrl,
  onImageChange,
  onImageDelete,
}: ProfileImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("JPEG, PNG, WebP 형식만 업로드 가능합니다.");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      onImageChange(file);
    }
  };

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mb-8">
      {/* Profile Image */}
      <div className="relative group mb-4">
        <div className="w-32 h-32 rounded-full border-4 border-neutral-200 overflow-hidden bg-neutral-100 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">👤</span>
          )}
        </div>

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleChangeClick}
        >
          <span className="text-white text-sm font-medium">변경</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleChangeClick}>
          사진 변경
        </Button>
        {imageUrl && (
          <button
            onClick={onImageDelete}
            className="text-body-sm text-error-600 hover:text-error-700 font-medium transition-colors"
          >
            삭제
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
