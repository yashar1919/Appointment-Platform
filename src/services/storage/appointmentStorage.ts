import { Appointment } from "@/src/types/domain";

const APPOINTMENTS_STORAGE_KEY = "yasaman_booking_appointments_v1";

export const appointmentStorage = {
  saveAppointment(appointment: Appointment): Appointment {
    try {
      const existing = appointmentStorage.getAppointments();
      const updated = [
        appointment,
        ...existing.filter((a) => a.id !== appointment.id),
      ];
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      return appointment;
    } catch (e) {
      console.error("Failed to save appointment to storage:", e);
      return appointment;
    }
  },

  getAppointments(tenantSlug?: string): Appointment[] {
    try {
      const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (!data) return [];
      const parsed: Appointment[] = JSON.parse(data);
      if (!tenantSlug) return parsed;
      return parsed.filter((a) => a.tenantSlug === tenantSlug);
    } catch (e) {
      console.error("Failed to load appointments from storage:", e);
      return [];
    }
  },

  getAppointmentById(id: string): Appointment | null {
    try {
      const appointments = appointmentStorage.getAppointments();
      return appointments.find((a) => a.id === id) || null;
    } catch (e) {
      console.error("Failed to get appointment by id:", e);
      return null;
    }
  },

  cancelAppointment(id: string): boolean {
    try {
      const appointments = appointmentStorage.getAppointments();
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status: "cancelled" as const } : a,
      );
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error("Failed to cancel appointment in storage:", e);
      return false;
    }
  },

  clearAppointments(): void {
    try {
      localStorage.removeItem(APPOINTMENTS_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear appointments from storage:", e);
    }
  },
};
