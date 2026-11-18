import { ArrowLeft, ArrowRight } from "lucide-react";
import { BookingProgress } from "@/src/features/booking/components/BookingProgress";
import { ServiceGrid } from "@/src/features/booking/components/ServiceGrid";
import { StaffSelector } from "@/src/features/booking/components/StaffSelector";
import { DateScroller } from "@/src/features/booking/components/DateScroller";
import { TimeSlotPicker } from "@/src/features/booking/components/TimeSlotPicker";
import { CustomerForm } from "@/src/features/booking/components/CustomerForm";
import { BookingReview } from "@/src/features/booking/components/BookingReview";
import { BookingStep } from "@/src/features/booking/types";
import {
  getFirstBookingStep,
  getNextBookingStep,
} from "@/src/features/booking/lib/bookingFlow";
import { AvailableDates } from "@/src/features/booking/hooks/useBookingAvailability";
import {
  BusinessConfig,
  Customer,
  Service,
  Staff,
  TimeSlot,
} from "@/src/types/domain";

interface BookingStepContentProps {
  tenant: BusinessConfig;
  currentStep: BookingStep;
  selectedService: Service | null;
  selectedStaff: Staff | null;
  allowAnyStaff: boolean;
  availableDates: AvailableDates;
  selectedDate: string | null;
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  customer: Customer | null;
  isSubmitting: boolean;
  isAvailabilityLoading: boolean;
  activeServices: Service[];
  eligibleStaff: Staff[];
  allowAnyStaffOption: boolean;
  requireStaff: boolean;
  showDateSelection: boolean;
  showTimeSelection: boolean;
  onStepChange: (step: BookingStep) => void;
  onSelectService: (service: Service) => void;
  onSelectStaff: (staff: Staff | null, anyStaff?: boolean) => void;
  onSelectDate: (date: string | null) => void;
  onSelectTimeSlot: (slot: TimeSlot | null) => void;
  onCustomerValidityChange: (isValid: boolean) => void;
  onSubmitCustomer: (customer: Customer) => void;
  onConfirmBooking: () => void;
}

export function BookingStepContent({
  tenant,
  currentStep,
  selectedService,
  selectedStaff,
  allowAnyStaff,
  availableDates,
  selectedDate,
  timeSlots,
  selectedTimeSlot,
  customer,
  isSubmitting,
  isAvailabilityLoading,
  activeServices,
  eligibleStaff,
  allowAnyStaffOption,
  requireStaff,
  showDateSelection,
  showTimeSelection,
  onStepChange,
  onSelectService,
  onSelectStaff,
  onSelectDate,
  onSelectTimeSlot,
  onCustomerValidityChange,
  onSubmitCustomer,
  onConfirmBooking,
}: BookingStepContentProps) {
  const handleMobileAdvance = () => {
    if (currentStep === "customer") {
      const customerForm = document.getElementById(
        "customer-details-form",
      ) as HTMLFormElement | null;
      customerForm?.requestSubmit();
      return;
    }
    const nextStep = getNextBookingStep(tenant, currentStep);
    if (nextStep) onStepChange(nextStep);
  };

  return (
    <>
      <BookingProgress
        currentStep={currentStep}
        requireStaff={requireStaff}
        flow={tenant.booking.flow}
        onStepClick={onStepChange}
      />
      <main
        id="booking-flow-container"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10"
      >
        {currentStep === "service" && (
          <>
            <ServiceGrid
              categories={tenant.categories}
              services={activeServices}
              selectedService={selectedService}
              onSelectService={onSelectService}
              currency={tenant.currency}
              title={tenant.content?.labels?.servicesTitle}
              description={tenant.content?.labels?.servicesDescription}
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
            onSelectStaff={onSelectStaff}
            onContinue={() =>
              onStepChange(getNextBookingStep(tenant, "staff") || "review")
            }
            onBack={() => onStepChange(getFirstBookingStep(tenant))}
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
                onSelectDate={onSelectDate}
              />
            )}
            {showTimeSelection && (
              <TimeSlotPicker
                slots={timeSlots}
                selectedSlot={selectedTimeSlot}
                onSelectSlot={onSelectTimeSlot}
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
                onClick={() => onStepChange(getFirstBookingStep(tenant))}
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
                  onStepChange(
                    getNextBookingStep(tenant, "datetime") || "review",
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
            phoneValidation={tenant.booking.phoneValidation}
            onValidityChange={onCustomerValidityChange}
            onSubmitCustomer={onSubmitCustomer}
            onBack={() => onStepChange("datetime")}
          />
        )}
        {currentStep === "review" &&
          selectedService &&
          selectedDate &&
          selectedTimeSlot &&
          customer && (
            <BookingReview
              business={tenant}
              service={selectedService}
              staff={selectedStaff}
              allowAnyStaff={allowAnyStaff}
              date={selectedDate}
              timeSlot={selectedTimeSlot}
              customer={customer}
              isSubmitting={isSubmitting}
              onConfirmBooking={onConfirmBooking}
              onEditSection={onStepChange}
              onBack={() => onStepChange("customer")}
            />
          )}
      </main>
    </>
  );
}
