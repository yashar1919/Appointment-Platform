import { AvailableDay, TimeSlot } from "@/src/types/domain";
import {
  getNextDays,
  generateDailyTimeSlots,
  getCurrentTimeInTimeZone,
} from "@/src/lib/formatting/dateTime";
import type { AppointmentRepository } from "../appointments/appointmentService";
import type { TenantRepository } from "../tenant/tenantRepository";

export interface AvailabilityRepository {
  getAvailableDates(
    tenantSlug: string,
    staffId?: string,
  ): Promise<AvailableDay[]>;
  getAvailableTimeSlots(
    tenantSlug: string,
    dateString: string,
    staffId?: string,
    serviceId?: string,
  ): Promise<TimeSlot[]>;
}
export class DemoAvailabilityRepository implements AvailabilityRepository {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async getAvailableDates(
    tenantSlug: string,
    _staffId?: string,
  ): Promise<AvailableDay[]> {
    const tenant = await this.tenantRepository.getTenant(tenantSlug);
    if (!tenant) return [];
    const maxAdvanceDays = tenant.booking.maxAdvanceDays || 14;
    const blockedDays = [0, 1, 2, 3, 4, 5, 6].filter(
      (day) => !tenant.workingHours.workingDays.includes(day),
    );
    return getNextDays(maxAdvanceDays, blockedDays);
  }

  async getAvailableTimeSlots(
    tenantSlug: string,
    dateString: string,
    staffId?: string,
    serviceId?: string,
  ): Promise<TimeSlot[]> {
    const tenant = await this.tenantRepository.getTenant(tenantSlug);
    if (!tenant) return [];
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
    const currentTime = getCurrentTimeInTimeZone(tenant.timezone);
    const isToday = currentTime.dateString === dateString;
    const appointments = await this.appointmentRepository.list(tenant.slug);
    const bookedTimeSlots = new Set(
      appointments
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
        (!isToday || getSlotMinutes(slot.id) > currentTime.minutes) &&
        !bookedTimeSlots.has(slot.id) &&
        !bookedTimeSlots.has(slot.time),
    }));
  }
}

function getSlotMinutes(slotId: string): number {
  const [hours, minutes] = slotId.split(":").map(Number);
  return hours * 60 + minutes;
}
