import * as React from "react";
import { cn } from "@/src/lib/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId =
      id || (label ? `textarea-${label.replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full text-right">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-[#c5baa9] mb-2 select-none"
          >
            {label}
            {props.required && <span className="text-[#cbb38d] mr-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-[#14161c] border border-[#2d313b] text-[#f7f4ed] placeholder-[#717786] text-sm text-right transition-all duration-200 focus:outline-none focus:border-[#cbb38d] focus:ring-1 focus:ring-[#cbb38d]/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none",
            error &&
              "border-red-500/70 focus:border-red-500 focus:ring-red-500/40",
            className,
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";
