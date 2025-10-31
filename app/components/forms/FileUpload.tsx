import { useState, useRef } from "react";
import { Upload, X, FileIcon, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept,
  multiple = false,
  maxSize = 10,
  label,
  description,
  error,
  disabled = false,
  showPreview = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${file.name}은(는) ${maxSize}MB를 초과합니다.`);
        return;
      }

      validFiles.push(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          if (newPreviews.length === validFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onFileSelect(updatedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFileSelect(updatedFiles);
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-body-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "border-primary-500 bg-primary-50"
              : error
              ? "border-error-500 bg-error-50"
              : "border-neutral-300 hover:border-neutral-400 bg-neutral-50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload
            className={`w-12 h-12 mb-4 ${
              isDragging ? "text-primary-600" : "text-neutral-400"
            }`}
          />
          <p className="text-body font-medium text-neutral-900 mb-1">
            파일을 드래그하거나 클릭하여 업로드
          </p>
          {description && (
            <p className="text-body-sm text-neutral-600">{description}</p>
          )}
          <p className="text-body-sm text-neutral-500 mt-2">
            최대 {maxSize}MB {accept && `· ${accept}`}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-body-sm text-error-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const preview = previews[index];

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 hover:shadow-sm transition-shadow"
              >
                {/* Preview or Icon */}
                {showPreview && isImage && preview ? (
                  <img
                    src={preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center">
                    {isImage ? (
                      <ImageIcon className="w-6 h-6 text-neutral-500" />
                    ) : (
                      <FileIcon className="w-6 h-6 text-neutral-500" />
                    )}
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-neutral-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-body-sm text-neutral-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-error-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
