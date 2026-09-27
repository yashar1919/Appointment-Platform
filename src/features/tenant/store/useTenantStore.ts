import { create } from "zustand";
import { BusinessConfig } from "@/src/types/domain";
import { repositories } from "@/src/services/repositories";

interface TenantState {
  currentTenant: BusinessConfig | null;
  isLoading: boolean;
  error: string | null;
  loadTenant: (slug: string) => Promise<BusinessConfig | null>;
}

export const useTenantStore = create<TenantState>((set) => ({
  currentTenant: null,
  isLoading: false,
  error: null,

  loadTenant: async (slug: string) => {
    set({ currentTenant: null, isLoading: true, error: null });
    try {
      const tenant = await repositories.tenantRepository.getTenant(slug);
      if (!tenant) {
        set({
          currentTenant: null,
          error: "کسب‌وکار مورد نظر یافت نشد.",
          isLoading: false,
        });
        return null;
      }
      set({ currentTenant: tenant, isLoading: false });
      return tenant;
    } catch {
      set({
        currentTenant: null,
        error: "خطا در بارگذاری اطلاعات کسب‌وکار.",
        isLoading: false,
      });
      return null;
    }
  },
}));
