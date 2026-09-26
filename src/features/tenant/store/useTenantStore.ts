import { create } from "zustand";
import { BusinessConfig } from "@/src/types/domain";
import { getTenantBySlug } from "@/src/config/demo";

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
    set({ isLoading: true, error: null });
    try {
      // In the future this will be: const res = await fetch(`/api/v1/public/${slug}`);
      const tenant = getTenantBySlug(slug);
      if (!tenant) {
        set({ error: "کسب‌وکار مورد نظر یافت نشد.", isLoading: false });
        return null;
      }
      set({ currentTenant: tenant, isLoading: false });
      return tenant;
    } catch {
      set({ error: "خطا در بارگذاری اطلاعات کسب‌وکار.", isLoading: false });
      return null;
    }
  },
}));
