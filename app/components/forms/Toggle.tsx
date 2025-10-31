interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    container: "w-9 h-5",
    circle: "w-4 h-4",
    translate: "translate-x-4",
  },
  md: {
    container: "w-11 h-6",
    circle: "w-5 h-5",
    translate: "translate-x-5",
  },
  lg: {
    container: "w-14 h-7",
    circle: "w-6 h-6",
    translate: "translate-x-7",
  },
};

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
}: ToggleProps) {
  const sizes = sizeClasses[size];

  return (
    <div className="flex items-start gap-3">
      {/* Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex items-center rounded-full
          transition-all duration-300 ease-in-out
          ${sizes.container}
          ${
            checked
              ? "bg-primary-600"
              : "bg-neutral-300"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        `}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-md
            transition-transform duration-300 ease-in-out
            ${sizes.circle}
            ${checked ? sizes.translate : "translate-x-0.5"}
          `}
        />
      </button>

      {/* Label and Description */}
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div
              className={`text-body font-medium ${
                disabled ? "text-neutral-500" : "text-neutral-900"
              }`}
            >
              {label}
            </div>
          )}
          {description && (
            <div className="text-body-sm text-neutral-600 mt-1">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ToggleGroupOption {
  value: string;
  label: string;
  description?: string;
}

interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function ToggleGroup({
  options,
  value,
  onChange,
  label,
  disabled = false,
}: ToggleGroupProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-body-sm font-medium text-neutral-700 mb-3">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {options.map((option) => (
          <Toggle
            key={option.value}
            checked={value.includes(option.value)}
            onChange={() => handleToggle(option.value)}
            label={option.label}
            description={option.description}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
