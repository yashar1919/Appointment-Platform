import { BusinessConfig, AvailableDay, TimeSlot } from "@/src/types/domain";
import {
  getNextDays,
  generateDailyTimeSlots,
} from "@/src/lib/formatting/dateTime";
import { appointmentStorage } from "../storage/appointmentStorage";

export interface AvailabilityRepository {
  getAvailableDates(tenant: BusinessConfig, staffId?: string): AvailableDay[];
  getAvailableTimeSlots(
    tenant: BusinessConfig,
    dateString: string,
    staffId?: string,
    serviceId?: string,
  ): TimeSlot[];
}

export class DemoAvailabilityRepository implements AvailabilityRepository {
  getAvailableDates(tenant: BusinessConfig, _staffId?: string): AvailableDay[] {
    const maxAdvanceDays = tenant.booking.maxAdvanceDays || 14;
    const blockedDays = [0, 1, 2, 3, 4, 5, 6].filter(
      (day) => !tenant.workingHours.workingDays.includes(day),
    );
    return getNextDays(maxAdvanceDays, blockedDays);
  }

  getAvailableTimeSlots(
    tenant: BusinessConfig,
    dateString: string,
    staffId?: string,
    serviceId?: string,
  ): TimeSlot[] {
    const service = tenant.services.find((item) => item.id === serviceId);
    if (serviceId && !service) return [];

    const eligibleStaff = service?.staffIds;
    if (staffId && eligibleStaff && !eligibleStaff.includes(staffId)) return [];

    const slots = generateDailyTimeSlots(
      tenant.workingHours.openTime,
      tenant.workingHours.closeTime,
      tenant.workingHours.slotDurationMinutes,
      service?.durationMinutes || tenant.workingHours.slotDurationMinutes,
    );
    const bookedTimeSlots = new Set(
      appointmentStorage
        .getAppointments(tenant.slug)
        .filter(
          (appointment) =>
            appointment.date === dateString &&
            appointment.status !== "cancelled",
        )
        .filter(
          (appointment) =>
            !staffId || !appointment.staff || appointment.staff.id === staffId,
        )
        .map((appointment) => appointment.timeSlot),
    );

    return slots.map((slot) => ({
      ...slot,
      isAvailable:
        !bookedTimeSlots.has(slot.id) && !bookedTimeSlots.has(slot.time),
    }));
  }
}

export const availabilityService: AvailabilityRepository =
  new DemoAvailabilityRepository();
