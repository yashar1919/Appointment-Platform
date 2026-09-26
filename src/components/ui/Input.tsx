import * as React from "react";
import { cn } from "@/src/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", label, error, helperText, id, ...props },
    ref,
  ) => {
    const inputId =
      id || (label ? `input-${label.replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full text-right">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#c5baa9] mb-2 select-none"
          >
            {label}
            {props.required && <span className="text-[var(--theme-primary)] mr-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full h-12 px-4 rounded-xl bg-[#14161c] border border-[#2d313b] text-[#f7f4ed] placeholder-[#717786] text-sm text-right transition-all duration-200 focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed",
              error &&
                "border-red-500/70 focus:border-red-500 focus:ring-red-500/40",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-red-400 font-normal leading-relaxed">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#8e8779]">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
