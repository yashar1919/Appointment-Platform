import {
  Check,
  Calendar,
  MapPin,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Appointment } from "@/src/types/domain";
import { formatCurrency } from "@/src/lib/formatting/currency";
import { formatPhoneNumber } from "@/src/lib/formatting/persianNumbers";

interface BookingSuccessViewProps {
  appointment: Appointment;
  onStartAgain: () => void;
  onGoHome: () => void;
}

export function BookingSuccessView({
  appointment,
  onStartAgain,
  onGoHome,
}: BookingSuccessViewProps) {
  const handleCopyCode = () => {
    navigator.clipboard?.writeText(appointment.referenceCode);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-right space-y-8 animate-in fade-in zoom-in-95 duration-400">
      {/* Visual Success Indicator with Luxury Gold Glow */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center">
          {/* Subtle pulsating gold ring */}
          <div className="absolute w-24 h-24 rounded-full bg-[var(--theme-primary)]/20 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--theme-primary)] to-[var(--theme-primary-light)] text-[#0b0c0f] flex items-center justify-center shadow-[0_0_40px_rgb(var(--theme-primary-rgb)_/_0.5)]">
            <Check className="w-10 h-10 stroke-[2.5]" />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[var(--theme-primary)] tracking-wide flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            رزرو شما با موفقیت قطعی شد
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f7f4ed]">
            نوبت شما در {appointment.businessName} ثبت شد
          </h1>
          <p className="text-xs sm:text-sm text-[#b5ada0] max-w-md mx-auto leading-relaxed">
            پیامک حاوی جزئیات نوبت، لوکیشن و نکات قبل از مراجعه به شماره{" "}
            <span className="font-mono text-[#f7f4ed]">
              {formatPhoneNumber(appointment.customer.phone)}
            </span>{" "}
            ارسال گردید.
          </p>
        </div>
      </div>

      {/* Reference Code Card */}
      <div className="p-4 rounded-2xl bg-[#14161c] border border-[var(--theme-primary)]/40 flex items-center justify-between shadow-xl">
        <div className="space-y-0.5">
          <span className="text-[11px] text-[#8e8779]">کد پیگیری اختصاصی:</span>
          <div className="text-lg sm:text-xl font-mono font-bold text-[var(--theme-primary)] tracking-widest">
            {appointment.referenceCode}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="px-3.5 py-2 text-xs rounded-xl bg-[#21242c] hover:bg-[#2d313c] border border-[var(--theme-primary)]/20 text-[#ded8cb] transition-colors cursor-pointer"
        >
          کپی کد
        </button>
      </div>

      {/* Comprehensive Appointment Summary Card */}
      <div className="bg-[#14161c] rounded-2xl border border-[#2d313b] overflow-hidden divide-y divide-[#232732] shadow-xl">
        {/* Service & Staff */}
        <div className="p-5 flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#21242c] shrink-0 border border-[#2d313b]">
            <img
              src={appointment.service.image}
              alt={appointment.service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-[#8e8779]">خدمت رزرو شده:</span>
            <h3 className="text-base font-bold text-[#f7f4ed]">
              {appointment.service.name}
            </h3>
            <p className="text-xs text-[var(--theme-primary)]">
              متخصص:{" "}
              {appointment.staff
                ? appointment.staff.name
                : "اولین ارائه‌دهنده در دسترس"}
            </p>
          </div>
        </div>

        {/* Date and Time */}
        <div className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#f7f4ed]">
            <Calendar className="w-4 h-4 text-[var(--theme-primary)]" />
            <span>{appointment.dateFormatted}</span>
            <span className="text-[var(--theme-primary)]">
              · ساعت {appointment.timeSlot}
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs text-[#a09a8e]">
            <MapPin className="w-4 h-4 text-[#9a9488] shrink-0 mt-0.5" />
            <span>{appointment.businessAddress}</span>
          </div>
        </div>

        {/* Client & Price Details */}
        <div className="p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#8e8779]">مشتری:</span>
            <p className="text-sm font-semibold text-[#f7f4ed]">
              {appointment.customer.fullName}
            </p>
          </div>

          <div className="text-left space-y-0.5">
            <span className="text-[11px] text-[#8e8779]">
              مبلغ قابل پرداخت:
            </span>
            <p className="text-base sm:text-lg font-bold text-[var(--theme-primary)]">
              {formatCurrency(appointment.totalPrice, appointment.currency)}
            </p>
          </div>
        </div>

        {/* Preparation Guidelines */}
        {appointment.service.careInstructions && (
          <div className="p-5 bg-[#171a22] text-xs text-[#ded8cb] space-y-1">
            <span className="font-semibold text-[var(--theme-primary)] block">
              نکات مهم پیش از مراجعه:
            </span>
            <p className="leading-relaxed text-[#b5ada0]">
              {appointment.service.careInstructions}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons: Return Home or Start Again */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onStartAgain}
          className="w-full sm:flex-1 min-h-12 px-6 py-3 rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-light)] text-xs sm:text-sm font-bold text-[#0b0c0f] transition-all shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)_/_0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <RefreshCw className="w-4 h-4" />
          <span>رزرو مجدد نوبت دیگر</span>
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="w-full sm:flex-1 min-h-12 px-6 py-3 rounded-xl bg-[#21242c] hover:bg-[#2c303b] border border-[#2d313b] text-xs sm:text-sm font-medium text-[#ded8cb] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به صفحه معرفی کسب‌وکار</span>
        </button>
      </div>
    </div>
  );
}
