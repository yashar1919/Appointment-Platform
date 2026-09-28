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
  const tenantRepository = new HttpTenantRepository(); // <-- تغییر اینجا
  const appointmentRepository = new HttpAppointmentRepository(tenantRepository); // <-- تغییر اینجا
  const availabilityRepository = new HttpAvailabilityRepository(
    tenantRepository,
  ); // <-- تغییر اینجا

  return {
    tenantRepository,
    appointmentRepository,
    availabilityRepository,
  };
}

export const repositories = createRepositories();
