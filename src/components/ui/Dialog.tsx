import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils/cn";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          "relative w-full max-w-lg bg-[#14161c] border border-[#cbb38d]/25 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-right text-[#f7f4ed]",
          className,
        )}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-[#2d313b] rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between mb-4 border-b border-[#2d313b] pb-3">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-[#f7f4ed]">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-[#a09a8e] mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9a9488] hover:text-white rounded-lg hover:bg-[#21242c] transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
