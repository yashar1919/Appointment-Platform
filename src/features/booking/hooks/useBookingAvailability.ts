import { useEffect, useState } from "react";
import { repositories } from "@/src/services/repositories";
import { BusinessConfig, Service, Staff } from "@/src/types/domain";

export type AvailableDates = Awaited<
  ReturnType<typeof repositories.availabilityRepository.getAvailableDates>
>;

export type TimeSlots = Awaited<
  ReturnType<typeof repositories.availabilityRepository.getAvailableTimeSlots>
>;

interface UseBookingAvailabilityParams {
  tenant: BusinessConfig | null;
  selectedStaff: Staff | null;
  selectedService: Service | null;
  selectedDate: string | null;
}

interface UseBookingAvailabilityResult {
  availableDates: AvailableDates;
  timeSlots: TimeSlots;
  isAvailabilityLoading: boolean;
}

export function useBookingAvailability({
  tenant,
  selectedStaff,
  selectedService,
  selectedDate,
}: UseBookingAvailabilityParams): UseBookingAvailabilityResult {
  const [availableDates, setAvailableDates] = useState<AvailableDates>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>([]);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    setIsAvailabilityLoading(true);
    repositories.availabilityRepository
      .getAvailableDates(tenant.slug, selectedStaff?.id)
      .then(setAvailableDates)
      .finally(() => setIsAvailabilityLoading(false));
  }, [tenant, selectedStaff]);

  useEffect(() => {
    if (!tenant || !selectedDate) {
      setTimeSlots([]);
      return;
    }
    setIsAvailabilityLoading(true);
    repositories.availabilityRepository
      .getAvailableTimeSlots(
        tenant.slug,
        selectedDate,
        selectedStaff?.id,
        selectedService?.id,
        tenant.locations[0]?.id,
      )
      .then(setTimeSlots)
      .finally(() => setIsAvailabilityLoading(false));
  }, [tenant, selectedDate, selectedStaff, selectedService]);

  return { availableDates, timeSlots, isAvailabilityLoading };
}
