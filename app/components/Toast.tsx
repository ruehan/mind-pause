import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

const toastStyles = {
  success: {
    container: "bg-white/90 border-mint-200 shadow-mint-100/50",
    icon: CheckCircle2,
    iconBg: "bg-gradient-to-br from-mint-100 to-mint-200",
    iconColor: "text-mint-600",
    title: "text-neutral-900",
    description: "text-neutral-600",
    progress: "bg-mint-500",
  },
  error: {
    container: "bg-white/90 border-error-200 shadow-error-100/50",
    icon: AlertCircle,
    iconBg: "bg-gradient-to-br from-error-100 to-error-200",
    iconColor: "text-error-600",
    title: "text-neutral-900",
    description: "text-neutral-600",
    progress: "bg-error-500",
  },
  warning: {
    container: "bg-white/90 border-orange-200 shadow-orange-100/50",
    icon: AlertTriangle,
    iconBg: "bg-gradient-to-br from-orange-100 to-orange-200",
    iconColor: "text-orange-600",
    title: "text-neutral-900",
    description: "text-neutral-600",
    progress: "bg-orange-500",
  },
  info: {
    container: "bg-white/90 border-primary-200 shadow-primary-100/50",
    icon: Info,
    iconBg: "bg-gradient-to-br from-primary-100 to-primary-200",
    iconColor: "text-primary-600",
    title: "text-neutral-900",
    description: "text-neutral-600",
    progress: "bg-primary-500",
  },
};

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  duration = 3000,
}: ToastProps) {
  const styles = toastStyles[type];
  const Icon = styles.icon;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!open) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [open, duration]);

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={`
        group relative overflow-hidden
        ${styles.container}
        backdrop-blur-md
        rounded-2xl border shadow-lg
        p-4 pr-12
        transition-all duration-300 ease-out
        data-[state=open]:animate-slide-in-right
        data-[state=closed]:animate-fade-out
        data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
        data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform
        data-[swipe=end]:animate-slide-out-right
        hover:scale-[1.02] hover:shadow-xl
      `}
    >
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100/50">
        <div
          className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`${styles.iconBg} p-2.5 rounded-xl shadow-sm flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 pt-0.5">
          <ToastPrimitive.Title className={`text-body font-bold ${styles.title} mb-1`}>
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description className={`text-sm ${styles.description} leading-relaxed`}>
              {description}
            </ToastPrimitive.Description>
          )}
        </div>

        {/* Close Button */}
        <ToastPrimitive.Close
          className="
            absolute top-3 right-3
            p-1.5 rounded-lg
            text-neutral-400 
            hover:text-neutral-600 hover:bg-neutral-100/80
            transition-colors duration-200
            opacity-0 group-hover:opacity-100
          "
        >
          <X className="w-4 h-4" />
        </ToastPrimitive.Close>
      </div>
    </ToastPrimitive.Root>
  );
}

export function ToastViewport() {
  return (
    <ToastPrimitive.Viewport 
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-md outline-none pointer-events-none" 
    >
      {/* Allow pointer events on children (toasts) but not the viewport container itself */}
      <style>{`
        [data-radix-toast-viewport] > * {
          pointer-events: auto;
        }
      `}</style>
    </ToastPrimitive.Viewport>
  );
}
