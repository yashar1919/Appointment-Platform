import { BusinessConfig } from "@/src/types/domain";
import { getTenantBySlug } from "@/src/config/demo";

export interface TenantRepository {
  getTenant(slug: string): Promise<BusinessConfig | null>;
}

export class DemoTenantRepository implements TenantRepository {
  getTenant(slug: string): Promise<BusinessConfig | null> {
    return Promise.resolve(getTenantBySlug(slug));
  }
}
