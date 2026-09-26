import { Appointment } from "@/src/types/domain";

const APPOINTMENTS_STORAGE_KEY = "appointments";

const getStorageKey = (tenantSlug: string) =>
  `${APPOINTMENTS_STORAGE_KEY}:${tenantSlug}`;

export const appointmentStorage = {
  saveAppointment(appointment: Appointment): Appointment {
    try {
      const existing = appointmentStorage.getAppointments(
        appointment.tenantSlug,
      );
      const updated = [
        appointment,
        ...existing.filter((a) => a.id !== appointment.id),
      ];
      localStorage.setItem(
        getStorageKey(appointment.tenantSlug),
        JSON.stringify(updated),
      );
      return appointment;
    } catch (e) {
      console.error("Failed to save appointment to storage:", e);
      return appointment;
    }
  },

  getAppointments(tenantSlug: string): Appointment[] {
    try {
      const data = localStorage.getItem(getStorageKey(tenantSlug));
      if (!data) return [];
      const parsed: Appointment[] = JSON.parse(data);
      return parsed.filter((a) => a.tenantSlug === tenantSlug);
    } catch (e) {
      console.error("Failed to load appointments from storage:", e);
      return [];
    }
  },

  getAppointmentById(id: string, tenantSlug: string): Appointment | null {
    try {
      const appointments = appointmentStorage.getAppointments(tenantSlug);
      return appointments.find((a) => a.id === id) || null;
    } catch (e) {
      console.error("Failed to get appointment by id:", e);
      return null;
    }
  },

  cancelAppointment(id: string, tenantSlug: string): boolean {
    try {
      const appointments = appointmentStorage.getAppointments(tenantSlug);
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as const } : a,
      );
      localStorage.setItem(getStorageKey(tenantSlug), JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error("Failed to cancel appointment in storage:", e);
      return false;
    }
  },

  clearAppointments(tenantSlug: string): void {
    try {
      localStorage.removeItem(getStorageKey(tenantSlug));
    } catch (e) {
      console.error("Failed to clear appointments from storage:", e);
    }
  },
};
