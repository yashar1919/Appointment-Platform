import { useState, useEffect } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import { Dialog } from "@/src/components/ui/Dialog";
import { Appointment } from "@/src/types/domain";
import { appointmentService } from "@/src/services/appointments/appointmentService";
import { formatCurrency } from "@/src/lib/formatting/currency";

interface AppointmentsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantSlug: string;
}

export function AppointmentsHistoryModal({
  isOpen,
  onClose,
  tenantSlug,
}: AppointmentsHistoryModalProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadList = () => {
    const list = appointmentService.list(tenantSlug);
    setAppointments(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadList();
    }
  }, [isOpen, tenantSlug]);

  const handleCancel = (id: string) => {
    if (window.confirm("آیا از لغو این نوبت رزرو اطمینان دارید؟")) {
      appointmentService.cancel(tenantSlug, id);
      loadList();
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
        {appointments.length === 0 ? (
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

              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl bg-[#1a1d25] border border-[#2d313b] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--theme-primary)]">
                        کد پیگیری: {apt.referenceCode}
                      </span>
                      <h4 className="text-sm font-bold text-[#f7f4ed]">
                        {apt.service.name}
                      </h4>
                      <p className="text-xs text-[#a09a8e]">
                        متخصص: {apt.staff?.name || "اولین متخصص در دسترس"}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                        isCancelled
                          ? "bg-red-900/30 text-red-300 border border-red-800/40"
                          : "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                      }`}
                    >
                      {isCancelled ? "لغو شده" : "تایید شده"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#b5ada0] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                      {apt.dateFormatted}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                      ساعت {apt.timeSlot}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#262934] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#f7f4ed]">
                      {formatCurrency(apt.totalPrice, apt.currency)}
                    </span>

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleCancel(apt.id)}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>لغو نوبت</span>
                      </button>
                    )}
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
