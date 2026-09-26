import { BusinessConfig } from "@/src/types/domain";
import { yasamanRaesiConfig } from "./yasamanRaesi";
import { luxuryCutConfig } from "./luxuryCut";
import { novaClinicConfig } from "./novaClinic";

export const DEMO_TENANTS: Record<string, BusinessConfig> = {
  "yasaman-raesi": yasamanRaesiConfig,
  "luxury-cut": luxuryCutConfig,
  "nova-clinic": novaClinicConfig,
};

export function getTenantBySlug(slug: string): BusinessConfig | null {
  return DEMO_TENANTS[slug.toLowerCase()] || null;
}

export function getAllTenants(): BusinessConfig[] {
  return Object.values(DEMO_TENANTS);
}
