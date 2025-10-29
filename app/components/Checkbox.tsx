interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  link?: {
    text: string;
    href: string;
  };
}

export function Checkbox({
  label,
  checked,
  onChange,
  required = false,
  link,
}: CheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer transition-colors duration-200"
        />
      </div>
      <div className="ml-3">
        <label className="text-body-sm text-neutral-700 cursor-pointer">
          {label}
          {required && <span className="text-error ml-1">*</span>}
          {link && (
            <>
              {" "}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
                onClick={(e) => e.stopPropagation()}
              >
                {link.text}
              </a>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
