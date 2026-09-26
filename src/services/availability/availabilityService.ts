import { BusinessConfig, AvailableDay, TimeSlot } from "@/src/types/domain";
import {
  getNextDays,
  generateDailyTimeSlots,
} from "@/src/lib/formatting/dateTime";
import { appointmentStorage } from "../storage/appointmentStorage";

export const availabilityService = {
  getAvailableDates(
    tenantConfig: BusinessConfig,
    _staffId?: string,
    daysCount: number = 14,
  ): AvailableDay[] {
    // 5 in JS is Friday (جمعه) which is typically non-working for clinics
    const workingDays = tenantConfig.workingHours.workingDays;
    // Map non-working days:
    const allDays = [0, 1, 2, 3, 4, 5, 6];
    const nonWorkingDays = allDays.filter((d) => !workingDays.includes(d));

    return getNextDays(daysCount, nonWorkingDays);
  },

  getAvailableTimeSlots(
    dateString: string,
    staffId?: string,
    _serviceId?: string,
  ): TimeSlot[] {
    const defaultSlots = generateDailyTimeSlots();

    // Check already booked appointments for this date and staff
    const existingAppointments = appointmentStorage.getAppointments();
    const bookedTimeSlots = new Set(
      existingAppointments
        .filter((apt) => apt.date === dateString && apt.status !== "cancelled")
        .filter((apt) => !staffId || !apt.staff || apt.staff.id === staffId)
        .map((apt) => apt.timeSlot),
    );

    return defaultSlots.map((slot) => {
      // Deterministic availability based on ID and existing bookings
      const isBooked =
        bookedTimeSlots.has(slot.time) || bookedTimeSlots.has(slot.id);
      return {
        ...slot,
        isAvailable: slot.isAvailable && !isBooked,
      };
    });
  },
};
