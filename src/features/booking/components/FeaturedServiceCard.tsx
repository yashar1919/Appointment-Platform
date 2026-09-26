import { Clock, Check, Sparkles } from "lucide-react";
import { Service } from "@/src/types/domain";
import { formatCurrency } from "@/src/lib/formatting/currency";
import { formatDuration } from "@/src/lib/formatting/dateTime";
import { cn } from "@/src/lib/utils/cn";

interface FeaturedServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
  currency?: string;
}

export function FeaturedServiceCard({
  service,
  isSelected,
  onSelect,
  currency = "تومان",
}: FeaturedServiceCardProps) {
  return (
    <div
      onClick={() => onSelect(service)}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-[#151720] border transition-all duration-300 cursor-pointer text-right",
        isSelected
          ? "border-(--theme-primary) ring-2 ring-(--theme-primary)/40 shadow-[0_0_24px_rgb(var(--theme-primary-rgb)/0.2)]"
          : "border-[#2d313b] hover:border-(--theme-primary)/50 hover:bg-[#191c26]",
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Visual Slot */}
        <div className="md:col-span-5 relative aspect-16/10 md:aspect-auto h-52 md:h-full overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#151720] via-transparent to-black/20" />

          {/* Top signature mark (no pill box, clean editorial text with subtle background) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0b0c0f]/80 backdrop-blur-md border border-(--theme-primary)/30 text-xs font-semibold text-(--theme-primary)">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خدمت ویژه و پرطرفدار آکادمی</span>
          </div>
        </div>

        {/* Details & Action */}
        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-[#f7f4ed] group-hover:text-(--theme-primary) transition-colors">
                {service.name}
              </h3>
              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-(--theme-primary) text-[#0b0c0f] flex items-center justify-center shrink-0 shadow-md">
                  <Check className="w-4 h-4 stroke-3" />
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#b5ada0] leading-relaxed line-clamp-2 sm:line-clamp-3">
              {service.description}
            </p>

            {/* Included features list */}
            {service.includedItems && service.includedItems.length > 0 && (
              <div className="pt-2 space-y-1.5 hidden sm:block">
                {service.includedItems.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-[#a09a8e]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-(--theme-primary)" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price, Duration, and Selection Button */}
          <div className="pt-3 border-t border-[#262a34] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8779]">
                <Clock className="w-3.5 h-3.5 text-(--theme-primary)" />
                <span>{formatDuration(service.durationMinutes)}</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-[#f7f4ed]">
                {formatCurrency(service.price, currency)}
              </div>
            </div>

            <button
              type="button"
              className={cn(
                "min-h-11 px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 select-none flex items-center gap-2 cursor-pointer",
                isSelected
                  ? "bg-(--theme-primary) text-[#0b0c0f]"
                  : "bg-[#222530] text-[#ded8cb] hover:bg-(--theme-primary) hover:text-[#0b0c0f] border border-(--theme-primary)/20",
              )}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>انتخاب شد</span>
                </>
              ) : (
                <span>انتخاب و ادامه</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
