import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  label,
  error,
  disabled = false,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-body-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between
          px-4 py-3 rounded-lg
          text-body text-left
          border transition-all duration-200
          ${
            error
              ? "border-error-500 focus:ring-2 focus:ring-error-500"
              : "border-neutral-300 focus:ring-2 focus:ring-primary-500"
          }
          ${disabled ? "bg-neutral-100 cursor-not-allowed opacity-60" : "bg-white hover:border-neutral-400"}
          ${isOpen ? "ring-2 ring-primary-500 border-primary-500" : ""}
        `}
      >
        <span className={selectedOption ? "text-neutral-900" : "text-neutral-500"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Options */}
          <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-elevation-3 border border-neutral-200 py-2 max-h-60 overflow-y-auto animate-scale-in">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2.5 text-body text-left
                  transition-colors duration-150
                  ${
                    option.disabled
                      ? "text-neutral-400 cursor-not-allowed"
                      : "text-neutral-900 hover:bg-primary-50"
                  }
                  ${option.value === value ? "bg-primary-50 text-primary-700" : ""}
                `}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-body-sm text-error-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
