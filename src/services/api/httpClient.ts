import {
  mockBookingSuccess,
  mockLocations,
  mockServices,
  mockStaff,
} from "@/src/mocks/data";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1/public";

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

const MOCK_DELAY_MS = 800;

function getMockAppointment(body: Record<string, any> = {}) {
  const date = new Date();
  date.setDate(date.getDate() + 2);

  const dateString = date.toISOString().split("T")[0];
  const referenceCode =
    body.reference_code || body.reference || mockBookingSuccess.reference_code;

  return {
    id: "mock-appointment-1",
    reference: referenceCode,
    reference_code: referenceCode,
    starts_at: `${dateString}T10:00:00+03:30`,
    ends_at: `${dateString}T10:30:00+03:30`,
    service_id: body.service_id || "1",
    staff_id: body.staff_id || "1",
    service_name: "ویزیت اولیه",
    service_price: 150000,
    service_duration_minutes: 30,
    staff_name: "دکتر سارا احمدی",
    customer_name: body.customer_name || "مهمان عزیز",
    customer_phone: body.customer_phone || body.phone || "09120000000",
    status: "confirmed",
  };
}

async function getMockResponse<T>(
  endpoint: string,
  options: RequestInit,
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const path = endpoint.split("?")[0];
  const body = options.body ? JSON.parse(String(options.body)) : {};

  if (path.endsWith("/services")) return mockServices as T;
  if (path.endsWith("/staff")) return mockStaff as T;
  if (path.endsWith("/locations")) return mockLocations as T;

  if (path.endsWith("/availability")) {
    const query = new URLSearchParams(endpoint.split("?")[1] || "");
    const day = query.get("day") || new Date().toISOString().split("T")[0];

    return Array.from({ length: 8 }, (_, index) => {
      const hour = 9 + index;
      return {
        starts_at: `${day}T${String(hour).padStart(2, "0")}:00:00+03:30`,
        ends_at: `${day}T${String(hour + 1).padStart(2, "0")}:00:00+03:30`,
        is_available: index % 3 !== 1,
      };
    }) as T;
  }

  if (path.endsWith("/appointments/lookup")) {
    return getMockAppointment(body) as T;
  }

  if (path.endsWith("/appointments/cancel")) {
    return { status: "cancelled" } as T;
  }

  if (path.endsWith("/appointments")) {
    return {
      ...getMockAppointment(body),
      ...mockBookingSuccess,
    } as T;
  }

  return {} as T;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (USE_MOCK_DATA) {
    return getMockResponse<T>(endpoint, options);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        errorData.detail?.[0]?.msg ||
        `HTTP Error: ${response.status}`,
    );
    // نکته: اگر بک‌اند خطای 409 بدهد، این پیام به کاربر نمایش داده می‌شود.
  }

  return response.json();
}
