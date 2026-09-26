import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTenantStore } from "@/src/features/tenant/store/useTenantStore";
import { useBookingStore } from "@/src/features/booking/store/useBookingStore";
import { BusinessHeader } from "@/src/components/shared/BusinessHeader";
import { BeautyHero } from "@/src/features/tenant/components/BeautyHero";
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
import { appointmentStorage } from "@/src/services/storage/appointmentStorage";
import { Appointment, Service, Customer } from "@/src/types/domain";
import { formatFullJalaliDate } from "@/src/lib/formatting/dateTime";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";

export function BookingPage() {
  const { tenantSlug = "yasaman-raesi" } = useParams<{ tenantSlug: string }>();
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
    loadTenant(tenantSlug);
  }, [tenantSlug, loadTenant]);

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
    if (!selectedDate) return [];
    return availabilityService.getAvailableTimeSlots(
      selectedDate,
      selectedStaff?.id,
      selectedService?.id,
    );
  }, [selectedDate, selectedStaff, selectedService]);

  const handleSelectService = (service: Service) => {
    selectService(service);
    if (
      currentTenant?.booking.requireStaffSelection &&
      currentTenant.staff.length > 1
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

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const referenceCode = `YR-${toPersianDigits(randomSuffix)}`;
    const appointmentId = `apt-${Date.now()}`;

    const newAppointment: Appointment = {
      id: appointmentId,
      referenceCode,
      tenantSlug: currentTenant.slug,
      businessName: currentTenant.name,
      businessPhone: currentTenant.phone,
      businessAddress: currentTenant.address,
      service: selectedService,
      staff: allowAnyStaff ? undefined : selectedStaff || undefined,
      date: selectedDate,
      dateFormatted: formatFullJalaliDate(selectedDate),
      timeSlot: selectedTimeSlot.time,
      customer,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      totalPrice: selectedService.price,
      currency: currentTenant.currency,
    };

    setTimeout(() => {
      appointmentStorage.saveAppointment(newAppointment);
      setLastConfirmedAppointment(newAppointment);
      setSubmitting(false);
      navigate(`/booking/${currentTenant.slug}/success/${appointmentId}`);
    }, 600);
  };

  if (isLoading || !currentTenant) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#a09a8e]">
            در حال بارگذاری اطلاعات آکادمی...
          </p>
        </div>
      </div>
    );
  }

  const requireStaff =
    currentTenant.booking.requireStaffSelection &&
    currentTenant.staff.length > 1;

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
      className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] pb-24 sm:pb-16 selection:bg-[var(--theme-primary)]/25"
    >
      {/* Universal Top Bar */}
      <BusinessHeader
        business={currentTenant}
        onViewAppointments={() => setIsHistoryModalOpen(true)}
      />

      {/* Hero Section shown on the initial discovery step */}
      {currentStep === "service" && (
        <BeautyHero
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
            services={currentTenant.services}
            selectedService={selectedService}
            onSelectService={handleSelectService}
            currency={currentTenant.currency}
          />
        )}

        {/* Step 2: Staff Selection */}
        {currentStep === "staff" && (
          <StaffSelector
            staffList={currentTenant.staff}
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
                className="min-h-12 px-7 py-2.5 rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-light)] disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-[#0b0c0f] transition-all shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)_/_0.25)] cursor-pointer"
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
