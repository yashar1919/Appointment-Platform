import { Appointment, Customer, Service, Staff } from "@/src/types/domain";
import { fetchApi } from "../api/httpClient";
import type { TenantRepository } from "@/src/services/tenant/tenantRepository";
import { formatFullJalaliDate } from "@/src/lib/formatting/dateTime";

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
  lookup(
    tenantSlug: string,
    referenceCode: string,
    phone: string,
  ): Promise<Appointment | null>;
  cancel(tenantSlug: string, appointment: Appointment): Promise<boolean>;
}

function cleanupLocalStorage(): void {
  try {
    const localData = localStorage.getItem("local_appointments_cache");
    if (!localData) return;

    const appointments: unknown = JSON.parse(localData);
    if (!Array.isArray(appointments)) return;

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const filtered = appointments.filter((appointment) => {
      if (!appointment || typeof appointment !== "object") return false;

      const createdAt = (appointment as { createdAt?: unknown }).createdAt;
      const timestamp = new Date(String(createdAt)).getTime();
      return Number.isFinite(timestamp) && timestamp > oneDayAgo;
    });

    localStorage.setItem("local_appointments_cache", JSON.stringify(filtered));
  } catch (error) {
    console.warn("Failed to cleanup localStorage", error);
  }
}

cleanupLocalStorage();

// تابع کمکی برای تبدیل پاسخ تخت بک‌اند به آبجکت تو در توی فرانت‌اند
function mapBackendToDomainAppointment(
  backendData: any,
  tenantData: any,
  input?: CreateAppointmentInput,
): Appointment {
  const serviceId = input?.serviceId || backendData.service_id;
  const service = tenantData?.services?.find(
    (s: any) => s.id === serviceId,
  ) || { name: "Unknown", price: 0, durationMinutes: 0 };

  const staffId = input?.staffId || backendData.staff_id;
  const staff = staffId
    ? tenantData?.staff?.find((s: any) => s.id === staffId)
    : undefined;

  const dateObj = new Date(backendData.starts_at);
  const dateStr = dateObj.toISOString().split("T")[0];
  const timeStr = dateObj.toTimeString().slice(0, 5);
  const customer = input?.customer || {
    fullName: backendData.customer_name || "",
    phone: backendData.customer_phone || "",
    email: backendData.customer_email || undefined,
    notes: backendData.customer_notes || undefined,
  };

  return {
    // استفاده از reference به عنوان id موقت برای جلوگیری از کرش صفحه Success
    id: backendData.id || backendData.reference,
    referenceCode: backendData.reference_code || backendData.reference,
    tenantSlug: input?.tenantSlug || tenantData?.slug,
    businessName: tenantData?.name || "Business",
    businessPhone: tenantData?.phone || "",
    businessAddress: tenantData?.address || "",
    service: service as Service,
    staff: staff as Staff | undefined,
    date: dateStr,
    dateFormatted: formatFullJalaliDate(dateStr),
    timeSlot: timeStr,
    customer,
    createdAt: backendData.created_at || new Date().toISOString(),
    status: (backendData.status || "confirmed").toLowerCase() as any,
    totalPrice: Number(backendData.service_price ?? service.price),
    currency: tenantData?.currency || "IRR",
  };
}

export class HttpAppointmentRepository implements AppointmentRepository {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const tenantData = await this.tenantRepository.getTenant(input.tenantSlug);
    if (!tenantData) throw new Error("Tenant not found");

    // ✅ ساخت یک رشته‌ی ISO استاندارد و تمیز (بدون کاراکتر اضافه)
    // input.date = "2026-10-15", input.time = "10:00"
    // نتیجه: "2026-10-15T10:00:00.000Z"
    const cleanStartsAt = new Date(
      `${input.date}T${input.time}:00`,
    ).toISOString();

    const payload = {
      service_id: input.serviceId,
      staff_id: input.staffId || null,
      location_id: input.locationId || tenantData.locations[0]?.id || null,
      starts_at: cleanStartsAt, // ✅ ارسال فرمت کاملاً استاندارد به بک‌اند
      customer_name: input.customer.fullName,
      customer_phone: input.customer.phone,
      customer_email: input.customer.email || "",
    };

    const responseData = await fetchApi<any>(
      `/${input.tenantSlug}/appointments`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    const mappedAppointment = mapBackendToDomainAppointment(
      responseData,
      tenantData,
      input,
    );

    // ذخیره در localStorage برای صفحه Success
    try {
      const existing = JSON.parse(
        localStorage.getItem("local_appointments_cache") || "[]",
      );
      existing.push(mappedAppointment);
      localStorage.setItem(
        "local_appointments_cache",
        JSON.stringify(existing),
      );
    } catch (e) {
      console.warn("Failed to cache appointment locally", e);
    }

    return mappedAppointment;
  }

  async getById(
    tenantSlug: string,
    appointmentId: string,
  ): Promise<Appointment | null> {
    // 🔥 FIX 1: اگر آیدی شبیه کد رهگیری است (با APT شروع می‌شود)، اول کش محلی را چک کن
    if (appointmentId.startsWith("APT-")) {
      try {
        const localData = localStorage.getItem("local_appointments_cache");
        if (localData) {
          const localAppointments = JSON.parse(localData);
          const found = localAppointments.find(
            (a: any) =>
              a.referenceCode === appointmentId && a.tenantSlug === tenantSlug,
          );
          if (found) return found;
        }
      } catch (e) {
        console.warn("Failed to read local cache", e);
      }
    }

    // 🔥 FIX 2: جستجو در لیست (با چک کردن هم id و هم referenceCode)
    const appointments = await this.list(tenantSlug);
    return (
      appointments.find(
        (a) => a.id === appointmentId || a.referenceCode === appointmentId,
      ) || null
    );
  }

  async list(tenantSlug: string): Promise<Appointment[]> {
    try {
      const localData = localStorage.getItem("local_appointments_cache");
      if (!localData) return [];

      const appointments: unknown = JSON.parse(localData);
      if (!Array.isArray(appointments)) return [];

      return appointments.filter((appointment): appointment is Appointment =>
        Boolean(
          appointment &&
          typeof appointment === "object" &&
          (appointment as Appointment).tenantSlug === tenantSlug,
        ),
      );
    } catch (error) {
      console.warn("Failed to read cached appointments", error);
      return [];
    }
  }

  async lookup(
    tenantSlug: string,
    referenceCode: string,
    phone: string,
  ): Promise<Appointment | null> {
    try {
      // ✅ اصلاح حیاتی: استفاده از snake_case دقیقاً مطابق با Pydantic Schema بک‌اند
      const payload = {
        reference_code: referenceCode,
        customer_phone: phone,
      };

      const responseData = await fetchApi<any>(
        `/${tenantSlug}/appointments/lookup`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      // دریافت اطلاعات tenant برای تکمیل مپینگ
      const tenantData = await this.tenantRepository.getTenant(tenantSlug);

      // مپینگ پاسخ تخت بک‌اند به اینترفیس Appointment فرانت‌اند
      const dateObj = new Date(responseData.starts_at);
      const dateStr = dateObj.toISOString().split("T")[0];
      const timeStr = dateObj.toTimeString().slice(0, 5);

      return {
        id: responseData.id || responseData.reference,
        referenceCode: responseData.reference_code || responseData.reference,
        tenantSlug: tenantSlug,
        businessName: tenantData?.name || "Business",
        businessPhone: tenantData?.phone || "",
        businessAddress: tenantData?.address || "",
        // بک‌اند معمولاً در lookup فقط نام سرویس و قیمت را برمی‌گرداند
        service: {
          name: responseData.service_name || "خدمت نامشخص",
          price: responseData.service_price || 0,
          durationMinutes: responseData.service_duration_minutes || 0,
        } as any,
        staff: responseData.staff_name
          ? ({ name: responseData.staff_name } as any)
          : undefined,
        date: dateStr,
        dateFormatted: formatFullJalaliDate(dateStr),
        timeSlot: timeStr,
        customer: {
          fullName: responseData.customer_name || "مشتری",
          phone: responseData.customer_phone || phone,
        },
        createdAt: new Date().toISOString(),
        status: (responseData.status || "confirmed").toLowerCase() as any,
        totalPrice: responseData.service_price || 0,
        currency: tenantData?.currency || "IRR",
      };
    } catch (error: any) {
      console.error("Lookup failed:", error);
      // اگر بک‌اند 404 برگرداند (یافت نشد)، به جای کرش کردن، null برمی‌گردانیم
      if (
        error.message.includes("404") ||
        error.message.includes("NOT_FOUND")
      ) {
        return null;
      }
      throw error; // سایر خطاها (مثل 500) را پرتاب می‌کنیم
    }
  }

  async cancel(tenantSlug: string, appointment: Appointment): Promise<boolean> {
    try {
      await fetchApi<any>(`/${tenantSlug}/appointments/cancel`, {
        method: "POST",
        body: JSON.stringify({
          reference_code: appointment.referenceCode,
          customer_phone: appointment.customer.phone,
        }),
      });

      // Keep the appointment in history while reflecting its cancelled status.
      const localData = localStorage.getItem("local_appointments_cache");
      if (localData) {
        const localAppointments = JSON.parse(localData);
        const updatedAppointments = localAppointments.map((cached: any) =>
          cached.referenceCode === appointment.referenceCode
            ? { ...cached, status: "cancelled" }
            : cached,
        );
        localStorage.setItem(
          "local_appointments_cache",
          JSON.stringify(updatedAppointments),
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to cancel appointment", error);
      throw error;
    }
  }
}
