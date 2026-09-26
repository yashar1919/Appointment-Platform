import * as React from "react";
import { cn } from "@/src/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/60 cursor-pointer rounded-xl";

    const variants = {
      primary:
        "bg-[var(--theme-primary)] text-[#0b0c0f] hover:bg-[var(--theme-primary-light)] shadow-[0_4px_20px_-4px_rgb(var(--theme-primary-rgb)_/_0.35)] font-semibold",
      secondary:
        "bg-[#21242c] text-[#ede8df] hover:bg-[#2c303b] border border-[var(--theme-primary)]/15 shadow-sm",
      outline:
        "border border-[var(--theme-primary)]/30 text-[#f7f4ed] hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10",
      ghost: "text-[#ede8df] hover:bg-[#21242c]/60 hover:text-white",
      destructive:
        "bg-red-950/40 text-red-300 border border-red-800/40 hover:bg-red-900/50",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs",
      md: "h-11 px-5 text-sm min-h-[44px]",
      lg: "h-12 px-7 text-base min-h-[48px]",
      icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>لطفاً صبور باشید...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
