import { BusinessConfig } from "@/src/types/domain";
import { luxuryCutConfig } from "./demo/luxuryCut";
import { novaClinicConfig } from "./demo/novaClinic";
import { univisionStudioConfig } from "./demo/univisionStudio";
import { yasamanRaesiConfig } from "./demo/yasamanRaesi";

const tenantConfigs: Record<string, BusinessConfig> = {
  "yasaman-raesi": yasamanRaesiConfig,
  "luxury-cut": luxuryCutConfig,
  "nova-clinic": novaClinicConfig,
  "univision-studio": univisionStudioConfig,
};

export function getTenantConfig(slug: string): BusinessConfig | null {
  return tenantConfigs[slug.toLowerCase()] || null;
}
