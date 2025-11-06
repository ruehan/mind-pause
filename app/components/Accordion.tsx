import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AccordionSectionProps {
  title: string;
  icon?: string;
  badge?: string | number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionSection({
  title,
  icon,
  badge,
  defaultOpen = false,
  children,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-strong rounded-3xl shadow-elevation-2 border border-white/40 overflow-hidden transition-all duration-300 hover:shadow-elevation-3">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Chevron Icon */}
          <div className="text-primary-600 transition-transform duration-200">
            {isOpen ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </div>

          {/* Section Icon */}
          {icon && <span className="text-3xl">{icon}</span>}

          {/* Title */}
          <h2 className="text-h3 text-neutral-900 font-bold">{title}</h2>

          {/* Badge */}
          {badge && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-body-sm font-semibold">
              {badge}
            </span>
          )}
        </div>

        {/* Status Indicator */}
        <div className="text-body-sm text-neutral-500">
          {isOpen ? "접기" : "펼치기"}
        </div>
      </button>

      {/* Content - Collapsible */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}
