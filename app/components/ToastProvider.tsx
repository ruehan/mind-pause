import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { Toast, ToastViewport } from "./Toast";
import type { ToastType } from "./Toast";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (
    title: string,
    options?: {
      description?: string;
      type?: ToastType;
      duration?: number;
    }
  ) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      title: string,
      options?: {
        description?: string;
        type?: ToastType;
        duration?: number;
      }
    ) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: ToastMessage = {
        id,
        title,
        description: options?.description,
        type: options?.type || "info",
        duration: options?.duration || 5000,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const success = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, type: "success" });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, type: "error" });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, type: "warning" });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      showToast(title, { description, type: "info" });
    },
    [showToast]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info,
      }}
    >
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        {/* Render Toasts */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            duration={toast.duration}
          />
        ))}

        <ToastViewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
