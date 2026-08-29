"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-spice-500 text-white hover:bg-spice-600 shadow-card hover:shadow-card-hover active:scale-[0.98]",
  secondary:
    "bg-saffron-500 text-maroon-700 hover:bg-saffron-600 shadow-card hover:shadow-card-hover active:scale-[0.98]",
  ghost:
    "bg-transparent text-ink hover:bg-spice-100/70 active:scale-[0.98]",
  outline:
    "bg-white/60 border border-spice-200 text-ink hover:bg-white active:scale-[0.98]",
  danger:
    "bg-maroon-600 text-white hover:bg-maroon-700 shadow-card hover:shadow-card-hover active:scale-[0.98]",
};

const sizeClasses: Record<string, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 gap-2 rounded-xl",
  lg: "text-base px-6 py-3.5 gap-2.5 rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
