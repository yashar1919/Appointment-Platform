import { create } from "zustand";
import { BookingState, BookingStep } from "../types";
import {
  Service,
  Staff,
  TimeSlot,
  Customer,
  Appointment,
} from "@/src/types/domain";

export const useBookingStore = create<BookingState>((set) => ({
  tenantSlug: null,
  currentStep: "service",
  selectedService: null,
  selectedStaff: null,
  allowAnyStaff: false,
  selectedDate: null,
  selectedTimeSlot: null,
  customer: null,
  lastConfirmedAppointment: null,
  isSubmitting: false,

  setStep: (step: BookingStep) => set({ currentStep: step }),

  startSession: (tenantSlug: string) =>
    set({
      tenantSlug,
      currentStep: "service",
      selectedService: null,
      selectedStaff: null,
      allowAnyStaff: false,
      selectedDate: null,
      selectedTimeSlot: null,
      customer: null,
      lastConfirmedAppointment: null,
      isSubmitting: false,
    }),

  selectService: (service: Service | null) =>
    set({
      selectedService: service,
      // If service changes, keep or reset downstream slots if needed
    }),

  selectStaff: (staff: Staff | null, anyStaff = false) =>
    set({
      selectedStaff: staff,
      allowAnyStaff: anyStaff,
    }),

  selectDate: (date: string | null) =>
    set({
      selectedDate: date,
      selectedTimeSlot: null, // Reset time slot when date changes
    }),

  selectTimeSlot: (slot: TimeSlot | null) => set({ selectedTimeSlot: slot }),

  setCustomer: (customer: Customer) => set({ customer }),

  setSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

  setLastConfirmedAppointment: (appointment: Appointment | null) =>
    set({ lastConfirmedAppointment: appointment }),

  resetBooking: () =>
    set({
      tenantSlug: null,
      currentStep: "service",
      selectedService: null,
      selectedStaff: null,
      allowAnyStaff: false,
      selectedDate: null,
      selectedTimeSlot: null,
      customer: null,
      lastConfirmedAppointment: null,
      isSubmitting: false,
    }),
}));
