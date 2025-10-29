interface NotificationCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function NotificationCheckbox({
  label,
  checked,
  onChange,
  description,
}: NotificationCheckboxProps) {
  return (
    <label className="flex items-start gap-3 py-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 mt-0.5 text-primary-600 rounded border-neutral-300 focus:ring-2 focus:ring-primary-200 cursor-pointer transition-colors duration-200"
      />
      <div className="flex-1">
        <p className="text-sm text-neutral-700">{label}</p>
        {description && (
          <p className="text-xs text-neutral-500 mt-1">{description}</p>
        )}
      </div>
    </label>
  );
}
