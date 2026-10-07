import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getTenantSlugFromHostname } from "@/src/lib/tenantResolver";
import { useTenantStore } from "@/src/features/tenant/store/useTenantStore";
import { useBookingStore } from "@/src/features/booking/store/useBookingStore";
import { BusinessHeader } from "@/src/components/shared/BusinessHeader";
import { BusinessHero } from "@/src/features/tenant/components/BusinessHero";
import { BookingProgress } from "@/src/features/booking/components/BookingProgress";
import { ServiceGrid } from "@/src/features/booking/components/ServiceGrid";
import { StaffSelector } from "@/src/features/booking/components/StaffSelector";
import { DateScroller } from "@/src/features/booking/components/DateScroller";
import { TimeSlotPicker } from "@/src/features/booking/components/TimeSlotPicker";
import { CustomerForm } from "@/src/features/booking/components/CustomerForm";
import { BookingReview } from "@/src/features/booking/components/BookingReview";
import { MobileStickyBar } from "@/src/features/booking/components/MobileStickyBar";
import { AppointmentsHistoryModal } from "@/src/features/booking/components/AppointmentsHistoryModal";
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
  const [availableDates, setAvailableDates] = useState<
    Awaited<
      ReturnType<typeof repositories.availabilityRepository.getAvailableDates>
    >
  >([]);
  const [timeSlots, setTimeSlots] = useState<
    Awaited<
      ReturnType<
        typeof repositories.availabilityRepository.getAvailableTimeSlots
      >
    >
  >([]);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
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

  useEffect(() => {
    if (!currentTenant) return;
    setIsAvailabilityLoading(true);
    repositories.availabilityRepository
      .getAvailableDates(currentTenant.slug, selectedStaff?.id)
      .then(setAvailableDates)
      .finally(() => setIsAvailabilityLoading(false));
  }, [currentTenant, selectedStaff]);

  useEffect(() => {
    if (!currentTenant || !selectedDate) {
      setTimeSlots([]);
      return;
    }
    setIsAvailabilityLoading(true);
    repositories.availabilityRepository
      .getAvailableTimeSlots(
        currentTenant.slug,
        selectedDate,
        selectedStaff?.id,
        selectedService?.id,
        currentTenant.locations[0]?.id,
      )
      .then(setTimeSlots)
      .finally(() => setIsAvailabilityLoading(false));
  }, [currentTenant, selectedDate, selectedStaff, selectedService]);

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
      <BookingProgress
        currentStep={currentStep}
        requireStaff={requireStaff}
        flow={flow}
        onStepClick={(step) => setStep(step)}
      />
      <main
        id="booking-flow-container"
        className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10"
      >
        {currentStep === "service" && (
          <>
            <ServiceGrid
              categories={currentTenant.categories}
              services={activeServices}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              currency={currentTenant.currency}
              title={currentTenant.content?.labels?.servicesTitle}
              description={currentTenant.content?.labels?.servicesDescription}
            />
            <div className="hidden sm:flex mt-8 items-center justify-between gap-6 rounded-2xl border border-[#2d313b] bg-[#14161c] p-4 sm:p-5">
              <div className="min-w-0 text-right">
                {selectedService ? (
                  <>
                    <p className="text-[11px] text-[#8e8779]">
                      خدمت انتخاب‌شده
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#f7f4ed]">
                      {selectedService.name}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-[#8e8779]">
                    برای ادامه، ابتدا یکی از خدمات را انتخاب کنید.
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={!selectedService}
                onClick={handleMobileAdvance}
                className="min-h-12 shrink-0 rounded-xl bg-(--theme-primary) px-6 py-2.5 text-xs font-bold text-[#0b0c0f] shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)/0.25)] transition-all hover:bg-(--theme-primary-light) disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>انتخاب متخصص</span>
                <ArrowLeft className="mr-2 inline-block h-4 w-4 align-middle" />
              </button>
            </div>
          </>
        )}
        {currentStep === "staff" && (
          <StaffSelector
            staffList={eligibleStaff}
            selectedStaff={selectedStaff}
            allowAnyStaff={allowAnyStaff}
            allowAnyStaffOption={allowAnyStaffOption}
            onSelectStaff={(staff, anyStaff) =>
              selectStaff(staff, anyStaff && allowAnyStaffOption)
            }
            onContinue={() =>
              setStep(getNextBookingStep(currentTenant, "staff") || "review")
            }
            onBack={() => setStep(getFirstBookingStep(currentTenant))}
          />
        )}
        {currentStep === "datetime" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="space-y-1 text-right">
              <h2 className="text-xl sm:text-2xl font-bold text-[#f7f4ed]">
                انتخاب تاریخ و ساعت مراجعه
              </h2>
              <p className="text-xs sm:text-sm text-[#a09a8e]">
                روز و بازه زمانی دلخواه خود را جهت دریافت خدمت انتخاب نمایید.
              </p>
            </div>
            {showDateSelection && (
              <DateScroller
                days={availableDates}
                selectedDate={selectedDate}
                onSelectDate={selectDate}
              />
            )}
            {showTimeSelection && (
              <TimeSlotPicker
                slots={timeSlots}
                selectedSlot={selectedTimeSlot}
                onSelectSlot={selectTimeSlot}
              />
            )}
            {isAvailabilityLoading && (
              <p className="text-xs text-[#8e8779] text-center">
                در حال بررسی زمان‌های آزاد...
              </p>
            )}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#262934]">
              <button
                type="button"
                onClick={() => setStep(getFirstBookingStep(currentTenant))}
                className="min-h-12 px-5 py-2 rounded-xl border border-[#2d313b] hover:bg-[#21242c] text-xs sm:text-sm font-medium text-[#ded8cb] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  مرحله قبل
                </span>
              </button>
              <button
                type="button"
                disabled={!selectedDate || !selectedTimeSlot}
                onClick={() =>
                  setStep(
                    getNextBookingStep(currentTenant, "datetime") || "review",
                  )
                }
                className="min-h-12 px-5 py-2 rounded-xl bg-(--theme-primary) hover:bg-(--theme-primary-light) disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-[#0b0c0f] transition-all shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)/0.25)] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  مرحله بعد
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </button>
            </div>
          </div>
        )}
        {currentStep === "customer" && (
          <CustomerForm
            initialData={customer}
            phoneValidation={currentTenant.booking.phoneValidation}
            onValidityChange={setIsCustomerFormValid}
            onSubmitCustomer={(data: Customer) => {
              setCustomer(data);
              setStep(
                getNextBookingStep(currentTenant, "customer") || "review",
              );
            }}
            onBack={() => setStep("datetime")}
          />
        )}
        {currentStep === "review" &&
          selectedService &&
          selectedDate &&
          selectedTimeSlot &&
          customer && (
            <BookingReview
              business={currentTenant}
              service={selectedService}
              staff={selectedStaff}
              allowAnyStaff={allowAnyStaff}
              date={selectedDate}
              timeSlot={selectedTimeSlot}
              customer={customer}
              isSubmitting={isSubmitting}
              onConfirmBooking={handleConfirmBooking}
              onEditSection={(section) => setStep(section)}
              onBack={() => setStep("customer")}
            />
          )}
      </main>
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
