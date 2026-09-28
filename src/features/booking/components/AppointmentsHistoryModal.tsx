import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle, Search, AlertCircle } from "lucide-react";
import { Dialog } from "@/src/components/ui/Dialog";
import { Appointment } from "@/src/types/domain";
import { repositories } from "@/src/services/repositories";
import { formatCurrency } from "@/src/lib/formatting/currency";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";

interface AppointmentsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantSlug: string;
}

type AppointmentWithStart = Appointment & {
  starts_at?: string;
};

function getAppointmentStart(appointment: Appointment): Date | null {
  const appointmentWithStart = appointment as AppointmentWithStart;
  const startsAt =
    appointmentWithStart.starts_at ||
    `${appointment.date}T${appointment.timeSlot.replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    )}`;
  const parsedDate = new Date(startsAt);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function AppointmentsHistoryModal({
  isOpen,
  onClose,
  tenantSlug,
}: AppointmentsHistoryModalProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingCancellationId, setPendingCancellationId] = useState<
    string | null
  >(null);

  // State برای فرم پیگیری
  const [showLookupForm, setShowLookupForm] = useState(false);
  const [lookupCode, setLookupCode] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [cancelError, setCancelError] = useState("");

  const loadList = async () => {
    const list = await repositories.appointmentRepository.list(tenantSlug);
    setAppointments(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadList();
      setShowLookupForm(false);
      setLookupError("");
      setCancelError("");
    } else {
      setPendingCancellationId(null);
      setLookupCode("");
      setLookupPhone("");
    }
  }, [isOpen, tenantSlug]);

  const handleCancel = async (appointment: Appointment) => {
    setCancelError("");

    try {
      const success = await repositories.appointmentRepository.cancel(
        tenantSlug,
        appointment,
      );

      if (!success) {
        throw new Error("Cancellation rejected");
      }

      setPendingCancellationId(null);
      await loadList();
    } catch (error) {
      setPendingCancellationId(null);
      const message =
        error instanceof Error
          ? error.message
          : "لغو این نوبت امکان‌پذیر نیست.";
      setCancelError(message);
      alert(message);
    }
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode || !lookupPhone) return;

    setIsLookingUp(true);
    setLookupError("");

    try {
      const foundAppointment = await repositories.appointmentRepository.lookup(
        tenantSlug,
        lookupCode,
        lookupPhone,
      );

      if (foundAppointment) {
        // اضافه کردن نوبت پیدا شده به ابتدای لیست (بدون تکرار)
        setAppointments((prev) => {
          const exists = prev.some(
            (apt) => apt.referenceCode === foundAppointment.referenceCode,
          );
          return exists ? prev : [foundAppointment, ...prev];
        });
        setShowLookupForm(false); // بستن فرم پس از موفقیت
        setLookupCode("");
        setLookupPhone("");
      } else {
        setLookupError("نوبتی با این کد رهگیری و شماره موبایل یافت نشد.");
      }
    } catch (err) {
      setLookupError("خطایی در ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="نوبت‌های ثبت‌شده شما"
      description="تاریخچه و وضعیت نوبت‌های رزرو شده در این کسب‌وکار"
    >
      <div className="space-y-4 text-right">
        {cancelError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg bg-red-900/20 p-3 text-xs text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{cancelError}</span>
          </div>
        )}

        {/* بخش پیگیری با کد رهگیری */}
        {!showLookupForm ? (
          <button
            onClick={() => setShowLookupForm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-(--theme-primary) hover:bg-[#1a1d25] rounded-lg transition-colors border border-dashed border-[#2d313b]"
          >
            <Search className="w-3.5 h-3.5" />
            <span>پیگیری نوبت با کد رهگیری و شماره موبایل</span>
          </button>
        ) : (
          <form
            onSubmit={handleLookupSubmit}
            className="p-4 bg-[#1a1d25] rounded-xl border border-[#2d313b] space-y-3"
          >
            <div>
              <label className="block text-xs text-[#a09a8e] mb-1">
                کد رهگیری (مثال: APT-XXXX)
              </label>
              <input
                type="text"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                className="w-full bg-[#0b0c0f] border border-[#2d313b] rounded-lg px-3 py-2 text-sm text-[#f7f4ed] focus:border-(--theme-primary) outline-none"
                placeholder="APT-..."
                required
              />
            </div>
            <div>
              <label className="block text-xs text-[#a09a8e] mb-1">
                شماره موبایل ثبت‌شده
              </label>
              <input
                type="tel"
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                className="w-full bg-[#0b0c0f] border border-[#2d313b] rounded-lg px-3 py-2 text-sm text-[#f7f4ed] focus:border-(--theme-primary) outline-none"
                placeholder="0912..."
                required
              />
            </div>

            {lookupError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/20 p-2 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{lookupError}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowLookupForm(false);
                  setLookupError("");
                }}
                className="flex-1 py-2 text-xs text-[#b5ada0] border border-[#2d313b] rounded-lg hover:bg-[#21242c]"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isLookingUp}
                className="flex-1 py-2 text-xs font-bold bg-(--theme-primary) text-[#0b0c0f] rounded-lg hover:bg-(--theme-primary-light) disabled:opacity-50"
              >
                {isLookingUp ? "در حال جستجو..." : "جستجو"}
              </button>
            </div>
          </form>
        )}

        {/* لیست نوبت‌ها */}
        {appointments.length === 0 && !showLookupForm ? (
          <div className="text-center py-10 space-y-2 bg-[#1a1d25] rounded-xl border border-[#2d313b]">
            <p className="text-sm text-[#ded8cb]">
              هنوز نوبتی برای شما ثبت نشده است.
            </p>
            <p className="text-xs text-[#8e8779]">
              پس از انتخاب خدمت و زمان، نوبت شما در این بخش قابل پیگیری خواهد
              بود.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
            {appointments.map((apt) => {
              const isCancelled = apt.status === "cancelled";
              const appointmentStart = getAppointmentStart(apt);
              const now = new Date();
              const isPast = appointmentStart ? appointmentStart < now : false;
              const isWithin24Hours = appointmentStart
                ? appointmentStart <=
                  new Date(now.getTime() + 24 * 60 * 60 * 1000)
                : false;
              const canCancel = !isCancelled && !isPast;
              const cancellationRequiresPhone = canCancel && isWithin24Hours;
              const appointmentStatus = isCancelled
                ? "لغو شده"
                : isPast
                  ? "انجام شده"
                  : "تایید شده";
              const statusClass = isCancelled
                ? "bg-red-900/30 text-red-300 border-red-800/40"
                : isPast
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
                  : "bg-sky-950/40 text-sky-300 border-sky-800/40";

              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl bg-[#1a1d25] border border-[#2d313b] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-(--theme-primary)">
                        کد پیگیری: {apt.referenceCode}
                      </span>
                      <h4 className="text-sm font-bold text-[#f7f4ed] mt-1">
                        {apt.service.name}
                      </h4>
                      <p className="text-xs text-[#a09a8e]">
                        متخصص: {apt.staff?.name || "اولین متخصص در دسترس"}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${statusClass}`}
                    >
                      {appointmentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#b5ada0] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-(--theme-primary)" />
                      {apt.dateFormatted}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-(--theme-primary)" />
                      ساعت {toPersianDigits(apt.timeSlot)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#262934] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#f7f4ed]">
                      {formatCurrency(apt.totalPrice, apt.currency)}
                    </span>

                    {canCancel && cancellationRequiresPhone && (
                      <button
                        type="button"
                        disabled
                        title={`برای لغو نوبت‌های کمتر از ۲۴ ساعت، لطفاً با شماره ${apt.businessPhone} تماس بگیرید.`}
                        className="flex cursor-not-allowed items-center gap-1 text-red-300 opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>لغو نوبت</span>
                      </button>
                    )}

                    {canCancel &&
                      !cancellationRequiresPhone &&
                      (pendingCancellationId === apt.id ? (
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <span className="text-[11px] text-[#ded8cb]">
                            لغو این نوبت؟
                          </span>
                          <button
                            type="button"
                            onClick={() => setPendingCancellationId(null)}
                            className="rounded-lg border border-[#2d313b] px-3 py-1.5 text-[11px] text-[#b5ada0] hover:bg-[#21242c]"
                          >
                            انصراف
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancel(apt)}
                            className="rounded-lg bg-red-900/50 px-3 py-1.5 text-[11px] font-semibold text-red-200 hover:bg-red-900/70 flex items-center gap-1"
                          >
                            تایید لغو
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingCancellationId(apt.id)}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>لغو نوبت</span>
                        </button>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Dialog>
  );
}
