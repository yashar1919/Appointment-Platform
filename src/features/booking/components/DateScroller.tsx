import { useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { AvailableDay } from "@/src/types/domain";
import { cn } from "@/src/lib/utils/cn";

interface DateScrollerProps {
  days: AvailableDay[];
  selectedDate: string | null;
  onSelectDate: (dateString: string) => void;
}

export function DateScroller({
  days,
  selectedDate,
  onSelectDate,
}: DateScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedDate]);

  return (
    <div className="space-y-3 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-[#f7f4ed] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-(--theme-primary)" />
          <span>انتخاب روز مراجعه</span>
        </h3>
        <span className="text-[11px] text-[#8e8779]">
          {days.length} روز آینده قابل رزرو است
        </span>
      </div>

      {/* Horizontal Mobile-First Date Scroller */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar py-5 px-4 -mx-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {days.map((day) => {
            const isSelected = day.dateString === selectedDate;
            const isAvailable = day.isAvailable;

            return (
              <button
                key={day.dateString}
                ref={isSelected ? activeBtnRef : null}
                type="button"
                disabled={!isAvailable}
                onClick={() => {
                  if (isAvailable) onSelectDate(day.dateString);
                }}
                className={cn(
                  "relative flex flex-col items-center justify-between py-3 px-3.5 min-w-19 sm:min-w-21 h-23 rounded-2xl transition-all duration-200 cursor-pointer select-none shrink-0 border text-center",
                  isSelected &&
                    "bg-(--theme-primary) text-[#0b0c0f] border-(--theme-primary) ring-2 ring-(--theme-primary)/40 shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)/0.3)] scale-[1.05]",
                  isAvailable &&
                    !isSelected &&
                    "bg-[#14161c] text-[#ded8cb] border-[#2d313b]/80 hover:border-(--theme-primary)/40 hover:bg-[#1b1e27]",
                  !isAvailable &&
                    "bg-[#101217] text-[#555a68] border-[#22252e] opacity-40 cursor-not-allowed",
                )}
              >
                {/* Weekday Name */}
                <span
                  className={cn(
                    "text-[11px] font-medium leading-none",
                    isSelected
                      ? "text-[#0b0c0f] font-bold"
                      : isAvailable
                        ? "text-[#a09a8e]"
                        : "text-[#555a68]",
                  )}
                >
                  {day.dayOfWeekName}
                </span>

                {/* Day Number */}
                <span
                  className={cn(
                    "text-xl sm:text-2xl font-black leading-none my-1",
                    isSelected ? "text-[#0b0c0f]" : "text-[#f7f4ed]",
                  )}
                >
                  {day.dayNumber}
                </span>

                {/* Month Name */}
                <span
                  className={cn(
                    "text-[10px] leading-none",
                    isSelected
                      ? "text-[#0b0c0f] font-semibold"
                      : "text-[#8e8779]",
                  )}
                >
                  {day.monthName}
                </span>

                {/* Today badge dot */}
                {day.isToday && (
                  <span
                    className={cn(
                      "absolute -top-1 right-2 text-[9px] px-1.5 py-0.2 rounded-full font-semibold",
                      isSelected
                        ? "bg-[#0b0c0f] text-(--theme-primary)"
                        : "bg-(--theme-primary) text-[#0b0c0f]",
                    )}
                  >
                    امروز
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
