import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const variantStyles = {
    danger: {
      icon: "text-error-500",
      button: "error" as const,
    },
    warning: {
      icon: "text-orange-500",
      button: "secondary" as const,
    },
    info: {
      icon: "text-primary-500",
      button: "primary" as const,
    },
  };

  const styles = variantStyles[variant];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

        {/* Content */}
        <Dialog.Content
          className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            max-w-md w-[90vw]
            bg-white rounded-2xl shadow-elevation-3
            p-6 z-50
            animate-in fade-in zoom-in-95 duration-200
            focus:outline-none
          "
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-12 h-12 rounded-full bg-${variant === "danger" ? "error" : variant === "warning" ? "orange" : "primary"}-100 flex items-center justify-center`}
            >
              <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
            </div>
          </div>

          {/* Title */}
          <Dialog.Title className="text-h4 font-bold text-neutral-900 text-center mb-2">
            {title}
          </Dialog.Title>

          {/* Description */}
          <Dialog.Description className="text-body text-neutral-600 text-center mb-6">
            {description}
          </Dialog.Description>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={styles.button}
              size="md"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "처리 중..." : confirmText}
            </Button>
          </div>

          {/* Close Button */}
          <Dialog.Close className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors">
            <X className="w-5 h-5" />
            <span className="sr-only">닫기</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
