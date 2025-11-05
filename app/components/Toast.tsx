import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
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
    container: "bg-white border-mint-200",
    icon: CheckCircle,
    iconBg: "bg-mint-100",
    iconColor: "text-mint-600",
    title: "text-neutral-900",
    description: "text-neutral-600",
    progress: "bg-mint-500",
  },
  error: {
    container: "bg-white border-error-200",
    icon: AlertCircle,
    iconBg: "bg-error-100",
    iconColor: "text-error-600",
    title: "text-neutral-900",
    description: "text-neutral-600",
    progress: "bg-error-500",
  },
  warning: {
    container: "bg-white border-orange-200",
    icon: AlertTriangle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "text-neutral-900",
    description: "text-neutral-600",
    progress: "bg-orange-500",
  },
  info: {
    container: "bg-white border-primary-200",
    icon: Info,
    iconBg: "bg-primary-100",
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
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [open, duration]);

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={`
        ${styles.container}
        relative overflow-hidden
        rounded-2xl shadow-lg border-2
        backdrop-blur-sm
        data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full
        data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full
        data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
        data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform
        data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full
        transition-all duration-300
      `}
    >
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100">
        <div
          className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4 pr-12">
        <div className="flex items-start gap-3">
          {/* Icon with background */}
          <div className={`${styles.iconBg} p-2 rounded-xl flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${styles.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1 pt-0.5">
            <ToastPrimitive.Title
              className={`text-body font-semibold ${styles.title} leading-snug`}
            >
              {title}
            </ToastPrimitive.Title>
            {description && (
              <ToastPrimitive.Description
                className={`text-body-sm ${styles.description} leading-relaxed`}
              >
                {description}
              </ToastPrimitive.Description>
            )}
          </div>

          {/* Close Button */}
          <ToastPrimitive.Close
            className={`
              absolute top-3 right-3
              p-1 rounded-lg
              text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100
              transition-all duration-200
            `}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">닫기</span>
          </ToastPrimitive.Close>
        </div>
      </div>
    </ToastPrimitive.Root>
  );
}

export function ToastViewport() {
  return (
    <ToastPrimitive.Viewport className="fixed top-0 right-0 flex flex-col gap-3 p-6 w-full max-w-sm z-[100] outline-none" />
  );
}
