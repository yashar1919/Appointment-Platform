import {
  AppointmentRepository,
  HttpAppointmentRepository,
} from "@/src/services/appointments/appointmentService";
import {
  AvailabilityRepository,
  HttpAvailabilityRepository,
} from "@/src/services/availability/availabilityService";
import {
  TenantRepository,
  HttpTenantRepository,
} from "@/src/services/tenant/tenantRepository";

export interface AppRepositories {
  tenantRepository: TenantRepository;
  appointmentRepository: AppointmentRepository;
  availabilityRepository: AvailabilityRepository;
}

export function createRepositories(): AppRepositories {
  const tenantRepository = new HttpTenantRepository();
  const appointmentRepository = new HttpAppointmentRepository(tenantRepository);
  const availabilityRepository = new HttpAvailabilityRepository(
    tenantRepository,
  );

  return {
    tenantRepository,
    appointmentRepository,
    availabilityRepository,
  };
}

export const repositories = createRepositories();
