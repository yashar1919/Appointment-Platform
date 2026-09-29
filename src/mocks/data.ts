import { yasamanRaesiConfig } from "@/src/config/demo/yasamanRaesi";

export const mockTenant = {
  id: yasamanRaesiConfig.id,
  name: yasamanRaesiConfig.name,
  slug: yasamanRaesiConfig.slug,
  description: yasamanRaesiConfig.description,
  address: yasamanRaesiConfig.address,
  phone: yasamanRaesiConfig.phone,
};

export const mockServices = yasamanRaesiConfig.services.map((service) => ({
  ...service,
  category_id: service.categoryId,
  duration_minutes: service.durationMinutes,
  is_featured: service.isFeatured,
  is_popular: service.isPopular,
}));

export const mockStaff = yasamanRaesiConfig.staff.map((staff) => ({
  ...staff,
  experience_years: staff.experienceYears,
  is_available: staff.isAvailable,
}));

export const mockLocations = yasamanRaesiConfig.locations.map((location) => ({
  ...location,
  postal_code: location.postalCode,
  working_hours: yasamanRaesiConfig.workingHours,
}));

export const mockBookingSuccess = {
  reference_code: "YAS-2026-482731",
  message: "نوبت شما با موفقیت ثبت شد.",
};
