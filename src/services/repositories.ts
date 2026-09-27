import {
  AppointmentRepository,
  DemoAppointmentRepository,
} from "@/src/services/appointments/appointmentService";
import {
  AvailabilityRepository,
  DemoAvailabilityRepository,
} from "@/src/services/availability/availabilityService";
import {
  DemoTenantRepository,
  TenantRepository,
} from "@/src/services/tenant/tenantRepository";

export interface AppRepositories {
  tenantRepository: TenantRepository;
  appointmentRepository: AppointmentRepository;
  availabilityRepository: AvailabilityRepository;
}

export function createRepositories(): AppRepositories {
  const tenantRepository = new DemoTenantRepository();
  const appointmentRepository = new DemoAppointmentRepository(tenantRepository);
  const availabilityRepository = new DemoAvailabilityRepository(
    tenantRepository,
    appointmentRepository,
  );

  return {
    tenantRepository,
    appointmentRepository,
    availabilityRepository,
  };
}

export const repositories = createRepositories();
