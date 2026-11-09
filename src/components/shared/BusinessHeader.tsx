import { useState } from "react";
import { BusinessConfig } from "@/src/types/domain";
import { BusinessInfoModal } from "@/src/features/tenant/components/BusinessInfoModal";
import { CalendarCheck, Gem, Info, Phone } from "lucide-react";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <a className="flex items-center gap-3" href="/">
            <img
              src={business.logo}
              alt={business.name}
              className="w-14 h-14 object-cover rounded-full"
            />
            <span
              className="hidden lg:block text-base font-light tracking-tight text-[#f7f4ed] hover:text-(--theme-primary) transition-colors whitespace-nowrap"
            >
              {business.name}
            </span>
          </a>

          {/* Zone 2: Clean single-line text links */}
          <nav className="hidden md:flex items-center gap-10 text-xs sm:text-[13px] font-medium text-[#c5baa9]">
            <a
              href="#services"
              className="hover:text-(--theme-primary) transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Gem className="w-4 h-4" />
              <span>خدمات تخصصی</span>
            </a>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="hover:text-(--theme-primary) transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              <span>اطلاعات و ساعت کاری</span>
            </button>
            <a
              href={`tel:${business.phone}`}
              className="hover:text-(--theme-primary) transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>تماس مستقیم</span>
            </a>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-2 text-[#c5baa9] hover:text-[#f7f4ed] hover:bg-[#1a1c23] rounded-lg transition-colors min-h-11 min-w-11 flex items-center justify-center cursor-pointer md:hidden"
              aria-label="اطلاعات کسب‌وکار و تماس"
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
