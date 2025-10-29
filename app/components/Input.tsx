import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  type?: "text" | "email" | "password";
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export function Input({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-label font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200
            text-body text-neutral-900 placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${
              error
                ? "border-error focus:ring-error focus:border-error"
                : "border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
            }
          `}
        />

        {/* Password Toggle Button */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Error or Helper Text */}
      {(error || helperText) && (
        <p
          className={`mt-2 text-body-sm ${
            error ? "text-error" : "text-neutral-500"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
