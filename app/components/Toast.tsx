import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

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
    container: "bg-gradient-to-r from-mint-50 to-mint-100 border-mint-500",
    icon: CheckCircle,
    iconColor: "text-mint-600",
    title: "text-mint-900",
    description: "text-mint-700",
  },
  error: {
    container: "bg-gradient-to-r from-error-50 to-error-100 border-error-500",
    icon: AlertCircle,
    iconColor: "text-error-600",
    title: "text-error-900",
    description: "text-error-700",
  },
  warning: {
    container: "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-500",
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    title: "text-orange-900",
    description: "text-orange-700",
  },
  info: {
    container: "bg-gradient-to-r from-primary-50 to-primary-100 border-primary-500",
    icon: Info,
    iconColor: "text-primary-600",
    title: "text-primary-900",
    description: "text-primary-700",
  },
};

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  duration = 5000,
}: ToastProps) {
  const styles = toastStyles[type];
  const Icon = styles.icon;

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={`
        ${styles.container}
        rounded-xl shadow-elevation-2 border-l-4
        p-4 pr-10
        data-[state=open]:animate-in data-[state=open]:slide-in-from-right
        data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right
        data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full
        transition-all duration-300
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />

        {/* Content */}
        <div className="flex-1 space-y-1">
          <ToastPrimitive.Title
            className={`text-body-sm font-semibold ${styles.title}`}
          >
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description
              className={`text-body-sm ${styles.description}`}
            >
              {description}
            </ToastPrimitive.Description>
          )}
        </div>

        {/* Close Button */}
        <ToastPrimitive.Close
          className={`
            absolute top-2 right-2
            p-1.5 rounded-lg
            ${styles.iconColor} hover:bg-black/5
            transition-colors
          `}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">닫기</span>
        </ToastPrimitive.Close>
      </div>
    </ToastPrimitive.Root>
  );
}

export function ToastViewport() {
  return (
    <ToastPrimitive.Viewport className="fixed top-0 right-0 flex flex-col gap-2 p-6 w-full max-w-md z-[100] outline-none" />
  );
}
