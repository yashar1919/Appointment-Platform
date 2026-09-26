import { ArrowLeft } from "lucide-react";
import { Service } from "@/src/types/domain";
import { formatCurrency } from "@/src/lib/formatting/currency";
import { formatDuration } from "@/src/lib/formatting/dateTime";
import { BookingStep } from "../types";

interface MobileStickyBarProps {
  currentStep: BookingStep;
  service: Service | null;
  canContinue: boolean;
  onContinue: () => void;
  currency?: string;
}

export function MobileStickyBar({
  currentStep,
  service,
  canContinue,
  onContinue,
  currency = "تومان",
}: MobileStickyBarProps) {
  // If no service selected yet on the first step, hide the sticky bar to avoid unnecessary clutter
  if (!service) return null;

  // Don't show sticky bar on review step, as the review screen already has its big confirmation CTA
  if (currentStep === "review") return null;

  const getActionLabel = () => {
    switch (currentStep) {
      case "service":
        return "انتخاب متخصص";
      case "staff":
        return "انتخاب زمان";
      case "datetime":
        return "ثبت مشخصات";
      case "customer":
        return "مشاهده پیش‌فاکتور";
      default:
        return "ادامه";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#0c0e13]/95 backdrop-blur-md border-t border-(--theme-primary)/20 px-4 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-safe">
      <div className="flex items-center justify-between gap-3">
        {/* Dynamic summary */}
        <div className="min-w-0 text-right space-y-0.5">
          <p className="text-xs font-bold text-[#f7f4ed] truncate">
            {service.name}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#c5baa9]">
            <span>{formatDuration(service.durationMinutes)}</span>
            <span aria-hidden="true" className="text-[#555a68]">
              ·
            </span>
            <span className="font-bold text-(--theme-primary)">
              {formatCurrency(service.price, currency)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="h-11 px-5 rounded-xl bg-(--theme-primary) hover:bg-(--theme-primary-light) disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-[#0b0c0f] flex items-center gap-1.5 shrink-0 shadow-[0_2px_12px_rgb(var(--theme-primary-rgb)/0.3)] cursor-pointer active:scale-95 transition-all"
        >
          <span>{getActionLabel()}</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
