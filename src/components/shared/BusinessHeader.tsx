import { useState } from "react";
import { BusinessConfig } from "@/src/types/domain";
import { BusinessInfoModal } from "@/src/features/tenant/components/BusinessInfoModal";
import { CalendarCheck, Info, Phone } from "lucide-react";

interface BusinessHeaderProps {
  business: BusinessConfig;
  onViewAppointments?: () => void;
}

export function BusinessHeader({
  business,
  onViewAppointments,
}: BusinessHeaderProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#0b0c0f]/90 backdrop-blur-md border-b border-[#2d313b]/60 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3">
            <img
              src={business.logo}
              alt={business.name}
              className="w-14 h-14 object-cover rounded-full"
            />
            <a
              href={`/booking/${business.slug}`}
              className="hidden lg:block text-base sm:text-lg font-bold tracking-tight text-[#f7f4ed] hover:text-(--theme-primary) transition-colors whitespace-nowrap"
            >
              {business.name}
            </a>
          </div>

          {/* Zone 2: Clean single-line text links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#c5baa9]">
            <a
              href="#services"
              className="hover:text-[#f7f4ed] transition-colors whitespace-nowrap"
            >
              خدمات تخصصی
            </a>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="hover:text-[#f7f4ed] transition-colors whitespace-nowrap cursor-pointer"
            >
              اطلاعات آکادمی و ساعت کاری
            </button>
            <a
              href={`tel:${business.phone}`}
              className="hover:text-[#f7f4ed] transition-colors whitespace-nowrap"
            >
              تماس مستقیم
            </a>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-2 text-[#c5baa9] hover:text-[#f7f4ed] hover:bg-[#1a1c23] rounded-lg transition-colors min-h-11 min-w-11 flex items-center justify-center cursor-pointer md:hidden"
              aria-label="اطلاعات سالن و تماس"
            >
              <Info className="w-5 h-5" />
            </button>

            {onViewAppointments && (
              <button
                onClick={onViewAppointments}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-(--theme-primary) hover:text-white rounded-lg hover:bg-[#21242c] transition-colors min-h-10 cursor-pointer"
                title="مشاهده نوبت‌های ثبت‌شده"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>پیگیری نوبت</span>
              </button>
            )}

            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center gap-2 p-3 text-xs font-semibold text-[#0b0c0f] bg-(--theme-primary) hover:bg-(--theme-primary-light) rounded-full sm:rounded-xl transition-all shadow-[0_2px_12px_rgb(var(--theme-primary-rgb)/0.25)] whitespace-nowrap cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تماس تلفنی</span>
            </a>
          </div>
        </div>
      </header>

      <BusinessInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        business={business}
      />
    </>
  );
}
