import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingStore } from "@/src/features/booking/store/useBookingStore";
import { useTenantStore } from "@/src/features/tenant/store/useTenantStore";
import { repositories } from "@/src/services/repositories";
import { Appointment } from "@/src/types/domain";
import { BookingSuccessView } from "@/src/features/booking/components/BookingSuccessView";
import { BusinessHeader } from "@/src/components/shared/BusinessHeader";
import { AlertCircle } from "lucide-react";
import { getTenantSlugFromHostname } from "@/src/lib/tenantResolver";

export function BookingSuccessPage() {
  const { id: appointmentId } = useParams<{ id: string }>();
  // Subdomain routing support
  const tenantSlug = getTenantSlugFromHostname();
  const navigate = useNavigate();

  const { currentTenant, loadTenant } = useTenantStore();
  const { resetBooking } = useBookingStore();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenantSlug || !appointmentId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all([
      loadTenant(tenantSlug),
      repositories.appointmentRepository.getById(tenantSlug, appointmentId),
    ])
      .then(([, foundAppointment]) => {
        if (foundAppointment?.tenantSlug === tenantSlug) {
          setAppointment(foundAppointment);
        } else {
          setAppointment(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, [appointmentId, tenantSlug, loadTenant]);

  const handleStartAgain = () => {
    resetBooking();
    navigate("/");
  };

  const handleGoHome = () => {
    resetBooking();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] flex items-center justify-center p-4 text-right">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-(--theme-primary) border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#a09a8e]">
            در حال دریافت اطلاعات نوبت...
          </p>
        </div>
      </div>
    );
  }

  if (!appointment || !currentTenant) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] flex items-center justify-center p-4 text-right">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#14161c] border border-[#2d313b] text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-(--theme-primary) mx-auto" />
          <h2 className="text-lg font-bold">اطلاعات نوبت یافت نشد</h2>
          <p className="text-xs text-[#a09a8e] leading-relaxed">
            ممکن است این نوبت منقضی شده یا در این دستگاه ثبت نشده باشد.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full h-11 rounded-xl bg-(--theme-primary) text-[#0b0c0f] font-bold text-xs cursor-pointer hover:bg-(--theme-primary-light) transition-colors"
          >
            بازگشت به صفحه رزرو نوبت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme={currentTenant?.theme.palette ?? "gold"}
      className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] selection:bg-(--theme-primary)/25"
    >
      {currentTenant && <BusinessHeader business={currentTenant} />}
      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        <BookingSuccessView
          appointment={appointment}
          onStartAgain={handleStartAgain}
          onGoHome={handleGoHome}
        />
      </main>
    </div>
  );
}
