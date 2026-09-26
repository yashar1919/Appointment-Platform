import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { availabilityService } from "@/src/services/availability/availabilityService";
import { appointmentService } from "@/src/services/appointments/appointmentService";
import { Service, Customer } from "@/src/types/domain";

export function BookingPage() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tenantSlug) return;
    startSession(tenantSlug);
    loadTenant(tenantSlug);
  }, [tenantSlug, loadTenant, startSession]);

  useEffect(() => {
    if (!currentTenant) return;
    const localization = currentTenant.localization;
    document.documentElement.lang =
      localization?.locale || currentTenant.locale;
    document.documentElement.dir = localization?.direction || "rtl";
    document.title = currentTenant.name;
  }, [currentTenant]);

  const availableDates = useMemo(() => {
    if (!currentTenant) return [];
    return availabilityService.getAvailableDates(
      currentTenant,
      selectedStaff?.id,
    );
  }, [currentTenant, selectedStaff]);

  // Default select first available date if none selected
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const firstAvailable = availableDates.find((d) => d.isAvailable);
      if (firstAvailable) {
        selectDate(firstAvailable.dateString);
      }
    }
  }, [availableDates, selectedDate, selectDate]);

  const timeSlots = useMemo(() => {
    if (!currentTenant || !selectedDate) return [];
    return availabilityService.getAvailableTimeSlots(
      currentTenant,
      selectedDate,
      selectedStaff?.id,
      selectedService?.id,
    );
  }, [selectedDate, selectedStaff, selectedService]);

  const activeServices = useMemo(
    () =>
      currentTenant?.services.filter((service) => service.active !== false) ||
      [],
    [currentTenant],
  );

  useEffect(() => {
    if (
      !currentTenant ||
      currentStep !== "service" ||
      activeServices.length !== 1
    ) {
      return;
    }
    selectService(activeServices[0]);
    setStep(
      currentTenant.booking.flow?.showStaffSelection !== false &&
        currentTenant.booking.requireStaffSelection &&
        currentTenant.staff.length > 1
        ? "staff"
        : "datetime",
    );
  }, [activeServices, currentStep, currentTenant, selectService, setStep]);

  const handleSelectService = (service: Service) => {
    selectService(service);
    if (
      currentTenant?.booking.flow?.showStaffSelection !== false &&
      currentTenant?.booking.requireStaffSelection &&
      currentTenant.staff.filter(
        (staff) =>
          staff.active !== false &&
          (!service.staffIds || service.staffIds.includes(staff.id)),
      ).length > 1
    ) {
      setStep("staff");
    } else {
      setStep("datetime");
    }
    // Smooth scroll down to progress area
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleConfirmBooking = () => {
    if (
      !currentTenant ||
      !selectedService ||
      !selectedDate ||
      !selectedTimeSlot ||
      !customer
    ) {
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const newAppointment = appointmentService.create({
        tenant: currentTenant,
        service: selectedService,
        staff: selectedStaff,
        allowAnyStaff,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customer,
      });
      setLastConfirmedAppointment(newAppointment);
      setSubmitting(false);
      navigate(`/booking/${currentTenant.slug}/success/${newAppointment.id}`);
    }, 600);
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

  const requireStaff =
    currentTenant.booking.flow?.showStaffSelection !== false &&
    currentTenant.booking.requireStaffSelection &&
    currentTenant.staff.filter(
      (staff) =>
        staff.active !== false &&
        (!selectedService?.staffIds ||
          selectedService.staffIds.includes(staff.id)),
    ).length > 1;

  const eligibleStaff = currentTenant.staff.filter(
    (staff) =>
      staff.active !== false &&
      (!selectedService?.staffIds ||
        selectedService.staffIds.includes(staff.id)),
  );

  // Determine if mobile sticky button can advance
  const canAdvance =
    (currentStep === "service" && selectedService !== null) ||
    (currentStep === "staff" && (selectedStaff !== null || allowAnyStaff)) ||
    (currentStep === "datetime" &&
      selectedDate !== null &&
      selectedTimeSlot !== null) ||
    (currentStep === "customer" && customer !== null);

  const handleMobileAdvance = () => {
    if (currentStep === "service") {
      if (requireStaff) setStep("staff");
      else setStep("datetime");
    } else if (currentStep === "staff") {
      setStep("datetime");
    } else if (currentStep === "datetime") {
      setStep("customer");
    } else if (currentStep === "customer") {
      setStep("review");
    }
  };

  return (
    <div
      ref={containerRef}
      data-theme={currentTenant.theme.palette ?? "gold"}
      className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] pb-24 sm:pb-16 selection:bg-(--theme-primary)/25"
    >
      {/* Universal Top Bar */}
      <BusinessHeader
        business={currentTenant}
        onViewAppointments={() => setIsHistoryModalOpen(true)}
      />

      {/* Hero Section shown on the initial discovery step */}
      {currentStep === "service" && (
        <BusinessHero
          business={currentTenant}
          onExploreServices={() => {
            const el = document.getElementById("booking-flow-container");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* Booking Flow Progress */}
      <BookingProgress
        currentStep={currentStep}
        requireStaff={requireStaff}
        onStepClick={(step) => setStep(step)}
      />

      {/* Main Booking Content */}
      <main
        id="booking-flow-container"
        className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10"
      >
        {/* Step 1: Service Selection */}
        {currentStep === "service" && (
          <ServiceGrid
            categories={currentTenant.categories}
            services={activeServices}
            selectedService={selectedService}
            onSelectService={handleSelectService}
            currency={currentTenant.currency}
            title={currentTenant.content?.labels?.servicesTitle}
            description={currentTenant.content?.labels?.servicesDescription}
          />
        )}

        {/* Step 2: Staff Selection */}
        {currentStep === "staff" && (
          <StaffSelector
            staffList={eligibleStaff}
            selectedStaff={selectedStaff}
            allowAnyStaff={allowAnyStaff}
            onSelectStaff={(staff, anyStaff) => selectStaff(staff, anyStaff)}
            onContinue={() => setStep("datetime")}
            onBack={() => setStep("service")}
          />
        )}

        {/* Step 3: Date and Time Selection */}
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

            <DateScroller
              days={availableDates}
              selectedDate={selectedDate}
              onSelectDate={(d) => selectDate(d)}
            />

            <TimeSlotPicker
              slots={timeSlots}
              selectedSlot={selectedTimeSlot}
              onSelectSlot={(slot) => selectTimeSlot(slot)}
            />

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#262934]">
              <button
                type="button"
                onClick={() => setStep(requireStaff ? "staff" : "service")}
                className="min-h-12 px-5 py-2.5 rounded-xl border border-[#2d313b] hover:bg-[#21242c] text-xs sm:text-sm font-medium text-[#ded8cb] transition-colors cursor-pointer"
              >
                مرحله قبل
              </button>

              <button
                type="button"
                disabled={!selectedDate || !selectedTimeSlot}
                onClick={() => setStep("customer")}
                className="min-h-12 px-7 py-2.5 rounded-xl bg-(--theme-primary) hover:bg-(--theme-primary-light) disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-[#0b0c0f] transition-all shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)/0.25)] cursor-pointer"
              >
                ثبت اطلاعات تماس
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Customer Details Form */}
        {currentStep === "customer" && (
          <CustomerForm
            initialData={customer}
            onSubmitCustomer={(data: Customer) => {
              setCustomer(data);
              setStep("review");
            }}
            onBack={() => setStep("datetime")}
          />
        )}

        {/* Step 5: Review and Confirmation */}
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

      {/* Mobile Sticky Booking Bar */}
      <MobileStickyBar
        currentStep={currentStep}
        service={selectedService}
        canContinue={canAdvance}
        onContinue={handleMobileAdvance}
        currency={currentTenant.currency}
      />

      {/* Appointments History Modal */}
      <AppointmentsHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        tenantSlug={currentTenant.slug}
      />
    </div>
  );
}
