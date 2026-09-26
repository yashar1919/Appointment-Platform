import { Clock, Check, Sun, Sunset, Moon } from "lucide-react";
import { TimeSlot } from "@/src/types/domain";
import { cn } from "@/src/lib/utils/cn";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotPickerProps) {
  const morningSlots = slots.filter((s) => s.period === "morning");
  const afternoonSlots = slots.filter((s) => s.period === "afternoon");
  const eveningSlots = slots.filter((s) => s.period === "evening");

  const renderSlotGroup = (
    title: string,
    groupSlots: TimeSlot[],
    icon: React.ReactNode,
  ) => {
    if (groupSlots.length === 0) return null;

    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#c5baa9]">
          {icon}
          <span>{title}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {groupSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isAvailable = slot.isAvailable;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  "h-12 min-h-11 px-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none border",
                  isSelected &&
                    "bg-(--theme-primary) text-[#0b0c0f] border-(--theme-primary) ring-2 ring-(--theme-primary)/40 shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)/0.25)] scale-[1.02]",
                  isAvailable &&
                    !isSelected &&
                    "bg-[#14161c] text-[#f7f4ed] border-[#2d313b] hover:border-(--theme-primary)/40 hover:bg-[#1b1e27]",
                  !isAvailable &&
                    "bg-[#0f1015] text-[#555a68] border-[#1d2028] opacity-35 cursor-not-allowed line-through",
                )}
              >
                <span>{slot.time}</span>
                {isSelected ? (
                  <Check className="w-4 h-4 stroke-3" />
                ) : isAvailable ? (
                  <span className="text-[10px] text-[#8e8779] font-normal">
                    خالی
                  </span>
                ) : (
                  <span className="text-[10px] text-[#555a68] font-normal">
                    پر
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 text-right">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-[#f7f4ed] flex items-center gap-2">
          <Clock className="w-4 h-4 text-(--theme-primary)" />
          <span>انتخاب ساعت مراجعه</span>
        </h3>
        <span className="text-[11px] text-[#8e8779]">
          مدت زمان اختصاصی برای هر نوبت لحاظ می‌شود
        </span>
      </div>

      <div className="space-y-4">
        {renderSlotGroup(
          "ساعت‌های صبح",
          morningSlots,
          <Sun className="w-4 h-4 text-amber-300" />,
        )}
        {renderSlotGroup(
          "ساعت‌های بعدازظهر",
          afternoonSlots,
          <Sunset className="w-4 h-4 text-orange-300" />,
        )}
        {renderSlotGroup(
          "ساعت‌های عصر و شب",
          eveningSlots,
          <Moon className="w-4 h-4 text-indigo-300" />,
        )}
      </div>
    </div>
  );
}
