import type { LucideIcon } from "lucide-react";
import { useState } from "react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
}

export function StatCard({ icon: Icon, title, value, subtitle, trend }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="glass rounded-xl shadow-soft hover:shadow-primary transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 p-6 relative overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary-50/0 via-lavender-50/0 to-mint-50/0 transition-all duration-500 ${
        isHovered ? "from-primary-50/50 via-lavender-50/30 to-mint-50/50" : ""
      }`}></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <h3 className={`text-body-sm font-medium mb-4 transition-all duration-300 ${
          isHovered ? "text-primary-700" : "text-neutral-600"
        }`}>
          {title}
        </h3>

        {/* Icon & Value */}
        <div className="flex items-center justify-center mb-3">
          <div className={`transition-all duration-500 ${
            isHovered ? "scale-110 rotate-12" : "scale-100 rotate-0"
          }`}>
            <Icon className={`w-12 h-12 transition-colors duration-300 ${
              isHovered ? "text-primary-700 animate-bounce-subtle" : "text-primary-600 animate-float"
            }`} />
          </div>
        </div>
        <p className={`text-center text-h2 font-bold mb-2 transition-all duration-300 ${
          isHovered ? "text-primary-700 scale-110" : "text-neutral-900 scale-100"
        }`}>
          {value}
        </p>

        {/* Subtitle & Trend */}
        {(subtitle || trend) && (
          <div className="pt-3 border-t border-neutral-100 space-y-1">
            {subtitle && (
              <p className={`text-body-sm text-center transition-colors duration-300 ${
                isHovered ? "text-neutral-700" : "text-neutral-600"
              }`}>
                {subtitle}
              </p>
            )}
            {trend && (
              <p className={`text-body-sm text-center transition-all duration-300 ${
                isHovered ? "text-primary-600 font-medium" : "text-neutral-500"
              }`}>
                {trend}
              </p>
            )}
          </div>
        )}

        {/* Hover indicator */}
        <div className={`mt-3 h-1 bg-gradient-to-r from-primary-500 via-lavender-500 to-mint-500 rounded-full transition-all duration-300 ${
          isHovered ? "opacity-100 w-full" : "opacity-0 w-0"
        }`}></div>
      </div>
    </div>
  );
}
