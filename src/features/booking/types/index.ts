import {
  Service,
  Staff,
  TimeSlot,
  Customer,
  Appointment,
} from "@/src/types/domain";

export type BookingStep =
  | "service"
  | "staff"
  | "datetime"
  | "customer"
  | "review";

export interface BookingState {
  tenantSlug: string | null;
  currentStep: BookingStep;
  selectedService: Service | null;
  selectedStaff: Staff | null;
  allowAnyStaff: boolean;
  selectedDate: string | null; // YYYY-MM-DD
  selectedTimeSlot: TimeSlot | null;
  customer: Customer | null;
  lastConfirmedAppointment: Appointment | null;
  isSubmitting: boolean;

  // Actions
  setStep: (step: BookingStep) => void;
  startSession: (tenantSlug: string, initialStep?: BookingStep) => void;
  selectService: (service: Service | null) => void;
  selectStaff: (staff: Staff | null, anyStaff?: boolean) => void;
  selectDate: (date: string | null) => void;
  selectTimeSlot: (slot: TimeSlot | null) => void;
  setCustomer: (customer: Customer) => void;
  resetBooking: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setLastConfirmedAppointment: (appointment: Appointment | null) => void;
}
