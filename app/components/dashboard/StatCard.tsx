import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
}

export function StatCard({ icon: Icon, title, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
      {/* Title */}
      <h3 className="text-body-sm font-medium text-neutral-600 mb-4">
        {title}
      </h3>

      {/* Icon & Value */}
      <div className="flex items-center justify-center mb-3">
        <Icon className="w-12 h-12 text-primary-600" />
      </div>
      <p className="text-center text-h2 font-bold text-neutral-900 mb-2">
        {value}
      </p>

      {/* Subtitle & Trend */}
      {(subtitle || trend) && (
        <div className="pt-3 border-t border-neutral-100 space-y-1">
          {subtitle && (
            <p className="text-body-sm text-neutral-600 text-center">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className="text-body-sm text-neutral-500 text-center">
              {trend}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
