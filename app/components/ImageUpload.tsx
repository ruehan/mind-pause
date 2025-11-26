import { useState, useRef } from "react";
import type { DragEvent } from "react";
import { uploadImage } from "~/lib/api";
import type { UploadResponse } from "~/lib/api";
import { useToast } from "./ToastProvider";

interface ImageUploadProps {
  onUploadSuccess: (response: UploadResponse) => void;
  folder?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  showPreview?: boolean;
  className?: string;
}

export function ImageUpload({
  onUploadSuccess,
  folder = "mind-pause",
  maxSizeMB = 10,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  showPreview = true,
  className = "",
}: ImageUploadProps) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error("오류", `지원하지 않는 파일 형식입니다. (${file.type})`);
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("오류", `파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
      return false;
    }

    return true;
  };

  const handleFileChange = async (file: File) => {
    if (!validateFile(file)) return;

    // Show preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress (since we don't have real progress tracking)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await uploadImage(file, folder);
      setUploadProgress(100);
      toast.success("성공", "이미지가 업로드되었습니다.");
      onUploadSuccess(response);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("오류", error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
      setPreview(null);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging ? "border-primary-500 bg-primary-50" : "border-neutral-300 bg-neutral-50"}
          ${uploading ? "opacity-50 pointer-events-none" : "hover:border-primary-400 hover:bg-primary-25"}
        `}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-cover"
            />
            {!uploading && (
              <p className="text-sm text-neutral-600">클릭하여 다른 이미지 선택</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-body font-medium text-neutral-900">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-caption text-neutral-500 mt-1">
                PNG, JPG, GIF, WEBP (최대 {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-3">
              <svg className="animate-spin h-16 w-16 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-body font-medium text-neutral-900">업로드 중...</p>
            <div className="w-48 h-2 bg-neutral-200 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-caption text-neutral-600 mt-2">{uploadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
