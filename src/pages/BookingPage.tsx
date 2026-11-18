import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTenantSlugFromHostname } from "@/src/lib/tenantResolver";
import { useTenantStore } from "@/src/features/tenant/store/useTenantStore";
import { useBookingStore } from "@/src/features/booking/store/useBookingStore";
import { BusinessHeader } from "@/src/components/shared/BusinessHeader";
import { BusinessHero } from "@/src/features/tenant/components/BusinessHero";
import { BookingStepContent } from "@/src/features/booking/components/BookingStepContent";
import { MobileStickyBar } from "@/src/features/booking/components/MobileStickyBar";
import { AppointmentsHistoryModal } from "@/src/features/booking/components/AppointmentsHistoryModal";
import { useBookingAvailability } from "@/src/features/booking/hooks/useBookingAvailability";
import { repositories } from "@/src/services/repositories";
import { USE_MOCK_DATA } from "@/src/services/api/httpClient";
import { Customer, Service } from "@/src/types/domain";
import {
  getFirstBookingStep,
  getNextBookingStep,
  isFlowStepEnabled,
} from "@/src/features/booking/lib/bookingFlow";

interface BookingPageProps {
  tenantSlug?: string;
}

export function BookingPage({ tenantSlug: propSlug }: BookingPageProps) {
  const { tenantSlug: urlSlug } = useParams();
  // Subdomain routing support
  const tenantSlug = propSlug || urlSlug || getTenantSlugFromHostname();
  const navigate = useNavigate();
  const { currentTenant, isLoading, loadTenant } = useTenantStore();
  const {
    currentStep,
    selectedService,
    selectedStaff,
    allowAnyStaff,
    selectedDate,
    selectedTimeSlot,
    customer,
    isSubmitting,
    startSession,
    setStep,
    selectService,
    selectStaff,
    selectDate,
    selectTimeSlot,
    setCustomer,
    setSubmitting,
    setLastConfirmedAppointment,
  } = useBookingStore();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCustomerFormValid, setIsCustomerFormValid] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (!tenantSlug) return;
    loadTenant(tenantSlug).then((tenant) => {
      if (tenant) startSession(tenantSlug, getFirstBookingStep(tenant));
    });
  }, [tenantSlug, loadTenant, startSession]);

  useEffect(() => {
    if (!currentTenant) return;
    document.documentElement.lang =
      currentTenant.localization?.locale || currentTenant.locale;
    document.documentElement.dir =
      currentTenant.localization?.direction || "rtl";
    document.title = currentTenant.name;
  }, [currentTenant]);

  const flow = currentTenant?.booking.flow;
  const showDateSelection = flow?.showDateSelection !== false;
  const showTimeSelection = flow?.showTimeSelection !== false;
  const activeServices = useMemo(
    () =>
      currentTenant?.services.filter((service) => service.active !== false) ||
      [],
    [currentTenant],
  );

  const { availableDates, timeSlots, isAvailabilityLoading } =
    useBookingAvailability({
      tenant: currentTenant,
      selectedStaff,
      selectedService,
      selectedDate,
    });

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      selectDate(
        availableDates.find((day) => day.isAvailable)?.dateString || null,
      );
    }
  }, [availableDates, selectedDate, selectDate]);

  useEffect(() => {
    if (!showTimeSelection && timeSlots.length > 0 && !selectedTimeSlot) {
      selectTimeSlot(timeSlots.find((slot) => slot.isAvailable) || null);
    }
  }, [showTimeSelection, timeSlots, selectedTimeSlot, selectTimeSlot]);

  const allowAnyStaffOption = currentTenant?.booking.allowAnyStaff === true;
  const requireStaff = Boolean(
    currentTenant?.booking.flow?.showStaffSelection !== false &&
    currentTenant?.booking.requireStaffSelection &&
    currentTenant.staff.filter(
      (staff) =>
        staff.active !== false &&
        (!selectedService?.staffIds ||
          selectedService.staffIds.includes(staff.id)),
    ).length > 1,
  );

  const eligibleStaff =
    currentTenant?.staff.filter(
      (staff) =>
        staff.active !== false &&
        (!selectedService?.staffIds ||
          selectedService.staffIds.includes(staff.id)),
    ) || [];

  useEffect(() => {
    if (
      !currentTenant ||
      currentStep !== "service" ||
      activeServices.length !== 1
    )
      return;
    selectService(activeServices[0]);
    setStep(getNextBookingStep(currentTenant, "service") || "review");
  }, [activeServices, currentStep, currentTenant, selectService, setStep]);

  useEffect(() => {
    if (
      !currentTenant ||
      currentStep !== "service" ||
      isFlowStepEnabled(flow, "service")
    )
      return;
    if (activeServices.length > 0 && !selectedService)
      selectService(activeServices[0]);
    setStep(getNextBookingStep(currentTenant, "service") || "review");
  }, [
    activeServices,
    currentStep,
    currentTenant,
    flow,
    selectedService,
    selectService,
    setStep,
  ]);

  useEffect(() => {
    if (
      currentTenant &&
      !isFlowStepEnabled(flow, "service") &&
      activeServices.length > 0 &&
      !selectedService
    ) {
      selectService(activeServices[0]);
    }
  }, [activeServices, currentTenant, flow, selectedService, selectService]);

  const handleSelectService = (service: Service) => {
    selectService(service);
  };

  const handleConfirmBooking = () => {
    if (
      !currentTenant ||
      !selectedService ||
      !selectedDate ||
      !selectedTimeSlot ||
      !customer
    )
      return;
    setSubmitting(true);
    repositories.appointmentRepository
      .create({
        tenantSlug: currentTenant.slug,
        serviceId: selectedService.id,
        staffId: allowAnyStaff ? undefined : selectedStaff?.id,
        locationId: currentTenant.locations[0]?.id,
        date: selectedDate,
        time: selectedTimeSlot.time,
        customer,
      })
      .then((appointment) => {
        setLastConfirmedAppointment(appointment);
        if (USE_MOCK_DATA) {
          alert(
            `پیامک تایید به صورت شبیه‌سازی شده ارسال شد (کد رهگیری: ${appointment.referenceCode})`,
          );
        }
        navigate(`/success/${appointment.id}`);
      })
      .catch((error) => {
        alert(`خطا در رزرو: ${error.message}`);
      })
      .finally(() => setSubmitting(false));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-(--theme-primary) border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#a09a8e]">
            در حال بارگذاری اطلاعات کسب‌وکار...
          </p>
        </div>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] flex items-center justify-center p-4 text-right">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#14161c] border border-[#2d313b] text-center space-y-4">
          <h1 className="text-xl font-bold">کسب‌وکار مورد نظر یافت نشد</h1>
          <p className="text-sm text-[#a09a8e]">
            این لینک رزرو معتبر نیست یا دیگر در دسترس نیست.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="min-h-11 px-5 rounded-xl bg-(--theme-primary) text-[#0b0c0f] font-bold text-xs cursor-pointer"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const canAdvance =
    (currentStep === "service" && selectedService !== null) ||
    (currentStep === "staff" &&
      (selectedStaff !== null || (allowAnyStaffOption && allowAnyStaff))) ||
    (currentStep === "datetime" &&
      selectedDate !== null &&
      selectedTimeSlot !== null) ||
    (currentStep === "customer" && isCustomerFormValid);

  const handleMobileAdvance = () => {
    if (currentStep === "customer") {
      const customerForm = document.getElementById(
        "customer-details-form",
      ) as HTMLFormElement | null;
      customerForm?.requestSubmit();
      return;
    }
    const nextStep = getNextBookingStep(currentTenant, currentStep);
    if (nextStep) setStep(nextStep);
  };

  return (
    <div
      ref={containerRef}
      data-theme={currentTenant.theme.palette ?? "gold"}
      className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] pb-24 sm:pb-16 selection:bg-(--theme-primary)/25"
    >
      <BusinessHeader
        business={currentTenant}
        onViewAppointments={() => setIsHistoryModalOpen(true)}
      />
      {currentStep === "service" && (
        <BusinessHero
          business={currentTenant}
          onExploreServices={() =>
            document
              .getElementById("booking-flow-container")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />
      )}
      <BookingStepContent
        tenant={currentTenant}
        currentStep={currentStep}
        selectedService={selectedService}
        selectedStaff={selectedStaff}
        allowAnyStaff={allowAnyStaff}
        availableDates={availableDates}
        selectedDate={selectedDate}
        timeSlots={timeSlots}
        selectedTimeSlot={selectedTimeSlot}
        customer={customer}
        isSubmitting={isSubmitting}
        isAvailabilityLoading={isAvailabilityLoading}
        activeServices={activeServices}
        eligibleStaff={eligibleStaff}
        allowAnyStaffOption={allowAnyStaffOption}
        requireStaff={requireStaff}
        showDateSelection={showDateSelection}
        showTimeSelection={showTimeSelection}
        onStepChange={setStep}
        onSelectService={handleSelectService}
        onSelectStaff={(staff, anyStaff) =>
          selectStaff(staff, anyStaff && allowAnyStaffOption)
        }
        onSelectDate={selectDate}
        onSelectTimeSlot={selectTimeSlot}
        onCustomerValidityChange={setIsCustomerFormValid}
        onSubmitCustomer={(data: Customer) => {
          setCustomer(data);
          setStep(getNextBookingStep(currentTenant, "customer") || "review");
        }}
        onConfirmBooking={handleConfirmBooking}
      />
      <MobileStickyBar
        currentStep={currentStep}
        service={selectedService}
        canContinue={canAdvance}
        onContinue={handleMobileAdvance}
        currency={currentTenant.currency}
      />
      <AppointmentsHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        tenantSlug={currentTenant.slug}
      />
    </div>
  );
}
