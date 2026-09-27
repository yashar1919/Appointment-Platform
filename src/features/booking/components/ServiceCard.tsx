import { Clock, Check } from "lucide-react";
import { Service } from "@/src/types/domain";
import { formatCurrency } from "@/src/lib/formatting/currency";
import { formatDuration } from "@/src/lib/formatting/dateTime";
import { cn } from "@/src/lib/utils/cn";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
  currency?: string;
}

export function ServiceCard({
  service,
  isSelected,
  onSelect,
  currency = "تومان",
}: ServiceCardProps) {
  return (
    <div
      onClick={() => onSelect(service)}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#14161c] border transition-all duration-200 cursor-pointer text-right p-4 sm:p-5",
        isSelected
          ? "border-(--theme-primary) ring-2 ring-(--theme-primary)/30 shadow-[0_4px_24px_rgb(var(--theme-primary-rgb)/0.15)] bg-[#191c24]"
          : "border-[#2d313b]/80 hover:border-(--theme-primary)/40 hover:bg-[#181b23]",
      )}
    >
      <div className="space-y-3">
        {/* Service Image (4:3 aspect ratio) */}
        <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-[#1d202a]">
          <img
            src={service.image}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14161c] via-transparent to-transparent opacity-80" />

          {/* Selection indicator pill/circle */}
          {isSelected && (
            <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-(--theme-primary) text-[#0b0c0f] flex items-center justify-center shadow-lg">
              <Check className="w-3.5 h-3.5 stroke-3" />
            </div>
          )}

          {/* Duration badge overlay */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0b0c0f]/80 backdrop-blur-sm text-[11px] text-[#ded8cb]">
            <Clock className="w-3 h-3 text-(--theme-primary)" />
            <span>{formatDuration(service.durationMinutes)}</span>
          </div>
        </div>

        {/* Title and Short Description */}
        <div>
          <h3 className="text-base font-bold text-[#f7f4ed] group-hover:text-(--theme-primary) transition-colors leading-snug">
            {service.name}
          </h3>
          <p className="mt-1.5 text-xs text-[#a09a8e] leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      {/* Footer: Price & Quick Action */}
      <div className="mt-4 pt-3 border-t border-[#262934] flex items-center justify-between">
        <div>
          <span className="block text-[10px] text-[#8e8779]">هزینه خدمت:</span>
          <span className="text-sm sm:text-base font-bold text-[#f7f4ed]">
            {formatCurrency(service.price, currency)}
          </span>
        </div>

        <button
          type="button"
          className={cn(
            "min-h-10 md:min-h-8 px-4 md:px-2 text-sm font-semibold rounded-xl transition-all duration-200 select-none flex items-center gap-2 cursor-pointer",
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
            <span className="px-4">انتخاب</span>
          )}
        </button>
      </div>
    </div>
  );
}
