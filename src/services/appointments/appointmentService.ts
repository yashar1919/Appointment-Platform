import { Appointment, Customer } from "@/src/types/domain";
import { formatFullJalaliDate } from "@/src/lib/formatting/dateTime";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";
import { appointmentStorage } from "../storage/appointmentStorage";
import type { TenantRepository } from "@/src/services/tenant/tenantRepository";

export interface CreateAppointmentInput {
  tenantSlug: string;
  serviceId: string;
  staffId?: string;
  locationId?: string;
  date: string;
  time: string;
  customer: Customer;
}
export interface AppointmentRepository {
  create(input: CreateAppointmentInput): Promise<Appointment>;
  getById(
    tenantSlug: string,
    appointmentId: string,
  ): Promise<Appointment | null>;
  list(tenantSlug: string): Promise<Appointment[]>;
  cancel(tenantSlug: string, appointmentId: string): Promise<boolean>;
}
export class DemoAppointmentRepository implements AppointmentRepository {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const tenant = await this.tenantRepository.getTenant(input.tenantSlug);
    if (!tenant) throw new Error("Tenant not found");

    const service = tenant.services.find((item) => item.id === input.serviceId);
    if (!service) throw new Error("Service not found");

    const staff = input.staffId
      ? tenant.staff.find((item) => item.id === input.staffId)
      : undefined;
    if (input.staffId && (!staff || staff.active === false)) {
      throw new Error("Staff not found or unavailable");
    }
    if (staff && service.staffIds && !service.staffIds.includes(staff.id)) {
      throw new Error("Staff is not eligible for service");
    }
    const location = input.locationId
      ? tenant.locations.find((item) => item.id === input.locationId)
      : tenant.locations[0];
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceCode: `APT-${toPersianDigits(Math.floor(10000 + Math.random() * 90000))}`,
      tenantSlug: tenant.slug,
      businessName: tenant.name,
      businessPhone: tenant.phone,
      businessAddress: location?.address || tenant.address,
      service,
      staff,
      date: input.date,
      dateFormatted: formatFullJalaliDate(input.date),
      timeSlot: input.time,
      customer: input.customer,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      totalPrice: service.price,
      currency: tenant.currency,
    };
    return appointmentStorage.saveAppointment(appointment);
  }

  async getById(tenantSlug: string, appointmentId: string) {
    return appointmentStorage.getAppointmentById(appointmentId, tenantSlug);
  }

  async list(tenantSlug: string) {
    return appointmentStorage.getAppointments(tenantSlug);
  }

  async cancel(tenantSlug: string, appointmentId: string) {
    return appointmentStorage.cancelAppointment(appointmentId, tenantSlug);
  }
}
