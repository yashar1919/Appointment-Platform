import { Check } from "lucide-react";
import { BookingStep } from "../types";
import { cn } from "@/src/lib/utils/cn";

interface StepItem {
  id: BookingStep;
  label: string;
}

interface BookingProgressProps {
  currentStep: BookingStep;
  requireStaff: boolean;
  onStepClick?: (step: BookingStep) => void;
}

export function BookingProgress({
  currentStep,
  requireStaff,
  onStepClick,
}: BookingProgressProps) {
  const steps: StepItem[] = [
    { id: "service", label: "انتخاب خدمت" },
    ...(requireStaff ? [{ id: "staff" as BookingStep, label: "متخصص" }] : []),
    { id: "datetime", label: "تاریخ و ساعت" },
    { id: "customer", label: "مشخصات شما" },
    { id: "review", label: "تایید نهایی" },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-[#12141a]/80 border-b border-[#2d313b]/60 py-3 px-4 sticky top-16 z-20 backdrop-blur-md">
      <div className="max-w-4xl mx-auto">
        {/* Mobile View: Clean compact step counter & title */}
        <div className="flex sm:hidden items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#cbb38d] text-[#0b0c0f] font-bold flex items-center justify-center text-[10px]">
              {currentIndex + 1}
            </span>
            <span className="font-semibold text-[#f7f4ed]">
              {steps[currentIndex]?.label || ""}
            </span>
          </div>
          <span className="text-[11px] text-[#8e8779]">
            مرحله {currentIndex + 1} از {steps.length}
          </span>
        </div>

        {/* Mobile thin progress line */}
        <div className="w-full bg-[#21242c] h-1 rounded-full mt-2 sm:hidden overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-[#cbb38d] to-[#ddc5a2] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Desktop / Tablet View: Full Step Indicators */}
        <div className="hidden sm:flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isClickable = isCompleted && onStepClick;

            return (
              <div
                key={step.id}
                className="flex items-center flex-1 last:flex-none"
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.id)}
                  className={cn(
                    "flex items-center gap-2.5 transition-all group text-right select-none",
                    isClickable
                      ? "cursor-pointer hover:opacity-90"
                      : "cursor-default",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                      isCompleted && "bg-[#cbb38d] text-[#0b0c0f]",
                      isCurrent &&
                        "bg-[#cbb38d] text-[#0b0c0f] ring-4 ring-[#cbb38d]/20 shadow-[0_0_12px_rgba(203,179,141,0.5)]",
                      !isCompleted &&
                        !isCurrent &&
                        "bg-[#21242c] text-[#717786] border border-[#2d313b]",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap transition-colors",
                      isCurrent
                        ? "text-[#f7f4ed] font-bold"
                        : isCompleted
                          ? "text-[#c5baa9]"
                          : "text-[#717786]",
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-[1.5px] mx-3 transition-colors",
                      index < currentIndex ? "bg-[#cbb38d]/80" : "bg-[#21242c]",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
