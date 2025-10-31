import { Link } from "react-router";
import { Spinner } from "./Spinner";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gradient" | "glass" | "error";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  loading = false,
  loadingText,
}: ButtonProps) {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant styles
  const variantStyles = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
    secondary:
      "bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50 focus:ring-primary-500 transform hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500",
    gradient:
      "gradient-primary text-white hover:shadow-primary shadow-lg transform hover:scale-105 focus:ring-primary-500",
    glass:
      "glass text-neutral-900 hover:bg-white/80 border border-white/20 backdrop-blur-lg focus:ring-primary-500 shadow-soft",
    error:
      "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-body-sm",
    md: "px-6 py-3 text-body",
    lg: "px-8 py-4 text-body-lg",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const isDisabled = disabled || loading;
  const spinnerColor = variant === "secondary" || variant === "ghost" ? "primary" : "white";
  const spinnerSize = size === "sm" ? "sm" : "md";

  const content = loading ? (
    <div className="flex items-center gap-2">
      <Spinner size={spinnerSize} color={spinnerColor} />
      <span>{loadingText || children}</span>
    </div>
  ) : (
    children
  );

  // If href is provided, render as Link
  if (href && !isDisabled) {
    return (
      <Link to={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${combinedClassName} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {content}
    </button>
  );
}
