import {
  Clock,
  Calendar,
  User,
  Phone,
  Edit3,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  Service,
  Staff,
  TimeSlot,
  Customer,
  BusinessConfig,
} from "@/src/types/domain";
import { formatCurrency } from "@/src/lib/formatting/currency";
import {
  formatDuration,
  formatFullJalaliDate,
} from "@/src/lib/formatting/dateTime";
import { formatPhoneNumber } from "@/src/lib/formatting/persianNumbers";

interface BookingReviewProps {
  business: BusinessConfig;
  service: Service;
  staff: Staff | null;
  allowAnyStaff: boolean;
  date: string;
  timeSlot: TimeSlot;
  customer: Customer;
  isSubmitting: boolean;
  onConfirmBooking: () => void;
  onEditSection: (
    section: "service" | "staff" | "datetime" | "customer",
  ) => void;
  onBack: () => void;
}

export function BookingReview({
  business,
  service,
  staff,
  allowAnyStaff,
  date,
  timeSlot,
  customer,
  isSubmitting,
  onConfirmBooking,
  onEditSection,
  onBack,
}: BookingReviewProps) {
  const staffDisplayName = allowAnyStaff
    ? "اولین ارائه‌دهنده در دسترس"
    : staff?.name || "ارائه‌دهنده تخصیص داده نشده";

  const staffRole = allowAnyStaff
    ? "تخصیص هوشمند توسط مدیریت سالن"
    : staff?.role || "ارائه‌دهنده خدمت";

  return (
    <div className="space-y-6 text-right">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f7f4ed]">
          بازبینی و تایید نهایی نوبت
        </h2>
        <p className="text-xs sm:text-sm text-[#a09a8e]">
          لطفاً جزئیات نوبت خود را بررسی نمایید. در صورت تمایل می‌توانید هر بخش
          را پیش از ثبت قطعی ویرایش کنید.
        </p>
      </div>

      <div className="bg-[#14161c] rounded-2xl border border-(--theme-primary)/30 overflow-hidden shadow-2xl">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#21242c] via-[#2a2e3a] to-[#21242c] p-4 border-b border-[#2d313b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-(--theme-primary)" />
            <span className="text-sm font-semibold text-[#f7f4ed]">
              خلاصه اطلاعات نوبت شما
            </span>
            {/* <span className="text-xs sm:text-sm font-bold text-[#f7f4ed]">
              خلاصه اطلاعات نوبت شما در {business.name}
            </span> */}
          </div>
          <span className="text-xs text-(--theme-primary)">آماده تایید</span>
        </div>

        <div className="p-4 sm:p-6 space-y-5 divide-y divide-[#232732]">
          {/* Section 1: Service */}
          <div className="flex items-start justify-between gap-4 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#21242c] shrink-0 border border-[#2d313b]">
                <img
                  src={service.image}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-[#8e8779]">
                  خدمت انتخابی:
                </span>
                <h4 className="text-base font-bold text-[#f7f4ed]">
                  {service.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#a09a8e]">
                  <Clock className="w-3.5 h-3.5 text-(--theme-primary)" />
                  <span>
                    مدت تقریبی: {formatDuration(service.durationMinutes)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEditSection("service")}
              className="text-xs text-(--theme-primary) hover:text-(--theme-primary-light) inline-flex items-center gap-1 min-h-10 px-2 cursor-pointer font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تغییر</span>
            </button>
          </div>

          {/* Section 2: Staff */}
          <div className="flex items-start justify-between gap-4 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#21242c] shrink-0 border border-(--theme-primary)/25 flex items-center justify-center">
                {staff?.avatar ? (
                  <img
                    src={staff.avatar}
                    alt={staffDisplayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-(--theme-primary)" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#8e8779]">
                  ارائه‌دهنده خدمت:
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#f7f4ed]">
                  {staffDisplayName}
                </h4>
                <p className="text-xs text-[#a09a8e]">{staffRole}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEditSection("staff")}
              className="text-xs text-(--theme-primary) hover:text-(--theme-primary-light) inline-flex items-center gap-1 min-h-10 px-2 cursor-pointer font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تغییر</span>
            </button>
          </div>

          {/* Section 3: Date & Time */}
          <div className="flex items-start justify-between gap-4 pb-5">
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#8e8779]">
                زمان مراجعه حضوری:
              </span>
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#f7f4ed] py-2">
                <Calendar className="w-4 h-4 text-(--theme-primary)" />
                <span>{formatFullJalaliDate(date)}</span>
                <span className="text-(--theme-primary)">
                  · ساعت {timeSlot.time}
                </span>
              </div>
              <p className="text-[11px] text-[#a09a8e] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9a9488]" />
                <span>{business.locations[0]?.address}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onEditSection("datetime")}
              className="text-xs text-(--theme-primary) hover:text-(--theme-primary-light) inline-flex items-center gap-1 min-h-10 px-2 cursor-pointer font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تغییر</span>
            </button>
          </div>

          {/* Section 4: Customer Details */}
          <div className="flex items-start justify-between gap-4 pb-5">
            <div className="space-y-2">
              <span className="text-[11px] text-[#8e8779]">مشخصات زیباجو:</span>
              <h4 className="text-sm sm:text-base font-bold text-[#f7f4ed] pt-1">
                {customer.fullName}
              </h4>
              <p className="text-xs text-[#a09a8e] flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-(--theme-primary)" />
                <span className="flex gap-1 items-center">
                  تماس:
                  <span dir="ltr" className="inline-block">
                    {formatPhoneNumber(customer.phone)}
                  </span>
                </span>
              </p>
              {customer.notes && (
                <p className="text-xs text-[#ded8cb] mt-1 mb-5 bg-[#1a1d25] p-2.5 rounded-lg border border-[#2d313b] flex items-center gap-1">
                  <span className="text-[#8e8779] block text-[10px]">
                    توضیحات شما:
                  </span>
                  {customer.notes}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onEditSection("customer")}
              className="text-xs text-(--theme-primary) hover:text-(--theme-primary-light) inline-flex items-center gap-1 min-h-10 px-2 cursor-pointer font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تغییر</span>
            </button>
          </div>

          {/* Section 5: Pricing Breakdown */}
          <div className="flex items-center justify-between pb-5">
            <div>
              <span className="text-xs text-[#8e8779]">مبلغ کل خدمت:</span>
              <div className="text-xl sm:text-2xl font-black text-(--theme-primary) mt-0.5">
                {formatCurrency(service.price, business.currency)}
              </div>
            </div>

            <div className="text-left text-xs text-[#8e8779]">
              <span className="block text-[#4ade80] font-medium mb-1">
                {business.content?.policies?.payment ||
                  "نحوه پرداخت توسط کسب‌وکار اعلام می‌شود."}
              </span>
              <span>
                {business.content?.policies?.cancellation ||
                  "شرایط تغییر یا لغو را بررسی کنید."}
              </span>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3.5 bg-[#171a22] border-t border-[#262934] flex items-center gap-2 text-[11px] text-[#ded8cb]">
          <ShieldCheck className="w-4 h-4 text-(--theme-primary) shrink-0" />
          {/* <span>
            امکان لغو یا تغییر زمان نوبت تا {business.booking.minNoticeHours}{" "}
            ساعت قبل از طریق پیامک یا تماس امکان‌پذیر است.
          </span> */}
          <span>
            امکان لغو یا تغییر زمان نوبت تا 24 ساعت قبل از طریق پنل کاربری یا تماس
            امکان‌پذیر است.
          </span>
        </div>
      </div>

      {/* Confirmation CTA */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 px-5 py-2.5 rounded-xl border border-[#2d313b] hover:bg-[#21242c] text-xs sm:text-sm font-medium text-[#ded8cb] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            مرحله قبل
          </span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onConfirmBooking}
          className="min-h-12 px-8 py-3 rounded-xl bg-(--theme-primary) hover:bg-(--theme-primary-light) text-xs sm:text-sm font-bold text-[#0b0c0f] transition-all shadow-[0_4px_20px_rgb(var(--theme-primary-rgb)/0.35)] cursor-pointer flex items-center gap-2"
        >
          {isSubmitting ? (
            <span>در حال ثبت نوبت...</span>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>تایید نهایی و ثبت رزرو نوبت</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
