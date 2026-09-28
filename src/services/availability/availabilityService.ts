import { AvailableDay, TimeSlot } from "@/src/types/domain";
import { getNextDays } from "@/src/lib/formatting/dateTime"; // فرض بر این است که این تابع را دارید
import { fetchApi } from "../api/httpClient";
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
    locationId?: string, // اضافه شده برای تطابق با بک‌اند
  ): Promise<TimeSlot[]>;
}

export class HttpAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async getAvailableDates(
    tenantSlug: string,
    _staffId?: string,
  ): Promise<AvailableDay[]> {
    // فعلاً تاریخ‌ها را محلی تولید می‌کنیم، چون بک‌اند فقط اسلات‌های یک روز خاص را می‌دهد
    const tenant = await this.tenantRepository.getTenant(tenantSlug);
    if (!tenant) return [];

    const maxAdvanceDays = tenant.booking.maxAdvanceDays || 14;
    const availableDays = getNextDays(maxAdvanceDays, []);

    return availableDays.map((day) => {
      const dayOfWeek = new Date(`${day.dateString}T00:00:00`).getDay();

      return {
        ...day,
        isAvailable: tenant.workingHours.workingDays.includes(dayOfWeek),
      };
    });
  }

  async getAvailableTimeSlots(
    tenantSlug: string,
    dateString: string,
    staffId?: string,
    serviceId?: string,
    locationId?: string,
  ): Promise<TimeSlot[]> {
    if (!serviceId || !locationId) return [];

    const tenant = await this.tenantRepository.getTenant(tenantSlug);
    const defaultLocationId = locationId || tenant?.locations[0]?.id;
    if (!defaultLocationId) return [];

    let url = `/${tenantSlug}/availability?service_id=${serviceId}&location_id=${defaultLocationId}&day=${dateString}`;
    if (staffId) url += `&staff_id=${staffId}`;

    try {
      const slotsData = await fetchApi<
        Array<{
          starts_at: string;
          ends_at: string;
          is_available: boolean;
        }>
      >(url);

      console.log(
        "Raw slots from API:",
        slotsData.map((slot) => ({
          starts_at: slot.starts_at,
          ends_at: slot.ends_at,
          is_available: slot.is_available,
        })),
      );

      console.log(
        "Current browser timezone:",
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      console.log("Tenant timezone:", tenant?.timezone);

      // const mappedSlots = slotsData.map((slot, index) => {
      //   const slotDate = new Date(slot.starts_at);
      //   const timeStr = timeFormatter.format(slotDate);
      //   const hour = Number(hourFormatter.format(slotDate));
      //   let period: "morning" | "afternoon" | "evening" = "morning";
      //   if (hour >= 12 && hour < 17) period = "afternoon";
      //   else if (hour >= 17) period = "evening";

      //   return {
      //     id: `slot-${index}`,
      //     time: timeStr,
      //     period,
      //     isAvailable: slot.is_available,
      //   };
      // });

      const mappedSlots = slotsData.map((slot, index) => {
        // ✅ استفاده از toTimeString برای اطمینان از فرمت انگلیسی "HH:mm"
        const slotDate = new Date(slot.starts_at);
        const timeStr = slotDate.toTimeString().slice(0, 5); // همیشه "10:00" برمی‌گرداند

        const hour = slotDate.getHours();
        let period: "morning" | "afternoon" | "evening" = "morning";
        if (hour >= 12 && hour < 17) period = "afternoon";
        else if (hour >= 17) period = "evening";

        return {
          id: `slot-${index}`,
          time: timeStr, // ✅ حالا مطمئنیم که "10:00" است
          period: period,
          isAvailable: slot.is_available,
          _rawStartsAt: slotDate,
          _rawEndsAt: new Date(slot.ends_at),
        };
      });

      console.log(
        "Parsed slots in tenant timezone:",
        mappedSlots.map((slot) => ({
          time: slot.time,
          period: slot.period,
          isAvailable: slot.isAvailable,
        })),
      );

      return mappedSlots;
    } catch (error) {
      console.error("Error fetching availability:", error);
      return [];
    }
  }
}
