import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showClose?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  showClose = true,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

        {/* Content */}
        <Dialog.Content
          className={`
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            ${sizeClasses[size]} w-[90vw]
            bg-white rounded-2xl shadow-elevation-3
            p-6 z-50
            animate-in fade-in zoom-in-95 duration-200
            focus:outline-none
          `}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Dialog.Title className="text-h3 font-bold text-neutral-900 mb-2">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-body text-neutral-600">
                  {description}
                </Dialog.Description>
              )}
            </div>

            {/* Close Button */}
            {showClose && (
              <Dialog.Close className="ml-4 p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors">
                <X className="w-5 h-5" />
                <span className="sr-only">닫기</span>
              </Dialog.Close>
            )}
          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-[60vh]">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
