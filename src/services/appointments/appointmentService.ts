import {
  Appointment,
  BusinessConfig,
  Customer,
  Service,
  Staff,
  TimeSlot,
} from "@/src/types/domain";
import { formatFullJalaliDate } from "@/src/lib/formatting/dateTime";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";
import { appointmentStorage } from "../storage/appointmentStorage";

export interface CreateAppointmentCommand {
  tenant: BusinessConfig;
  service: Service;
  staff: Staff | null;
  allowAnyStaff: boolean;
  date: string;
  timeSlot: TimeSlot;
  customer: Customer;
}

export interface AppointmentRepository {
  create(command: CreateAppointmentCommand): Appointment;
  getById(tenantSlug: string, appointmentId: string): Appointment | null;
  list(tenantSlug: string): Appointment[];
  cancel(tenantSlug: string, appointmentId: string): boolean;
}

export class DemoAppointmentRepository implements AppointmentRepository {
  create(command: CreateAppointmentCommand): Appointment {
    const { tenant, service, staff, allowAnyStaff, date, timeSlot, customer } =
      command;
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceCode: `APT-${toPersianDigits(Math.floor(10000 + Math.random() * 90000))}`,
      tenantSlug: tenant.slug,
      businessName: tenant.name,
      businessPhone: tenant.phone,
      businessAddress: tenant.address,
      service,
      staff: allowAnyStaff ? undefined : staff || undefined,
      date,
      dateFormatted: formatFullJalaliDate(date),
      timeSlot: timeSlot.time,
      customer,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      totalPrice: service.price,
      currency: tenant.currency,
    };
    return appointmentStorage.saveAppointment(appointment);
  }

  getById(tenantSlug: string, appointmentId: string) {
    return appointmentStorage.getAppointmentById(appointmentId, tenantSlug);
  }

  list(tenantSlug: string) {
    return appointmentStorage.getAppointments(tenantSlug);
  }

  cancel(tenantSlug: string, appointmentId: string) {
    return appointmentStorage.cancelAppointment(appointmentId, tenantSlug);
  }
}

export const appointmentService: AppointmentRepository =
  new DemoAppointmentRepository();
