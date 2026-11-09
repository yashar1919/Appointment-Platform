import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BookReader } from "@/src/features/book/components/BookReader";
import { YASAMAN_TENANT_SLUG } from "@/src/features/book/constants/bookConstants";
import { getTenantSlugFromHostname } from "@/src/lib/tenantResolver";
import { TenantNotFoundPage } from "@/src/pages/TenantNotFoundPage";
import { useTenantStore } from "@/src/features/tenant/store/useTenantStore";

export default function YasamanBookPage() {
  const tenantSlug = getTenantSlugFromHostname();
  const { currentTenant, isLoading, loadTenant } = useTenantStore();

  useEffect(() => {
    if (tenantSlug === YASAMAN_TENANT_SLUG) {
      void loadTenant(tenantSlug);
    }
  }, [tenantSlug, loadTenant]);

  if (tenantSlug !== YASAMAN_TENANT_SLUG) {
    return <TenantNotFoundPage />;
  }

  if (isLoading || !currentTenant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0c0f] px-4 text-sm text-[#c5baa9]">
        در حال بارگذاری اطلاعات کسب‌وکار...
      </main>
    );
  }

  return (
    <main
      data-theme={currentTenant.theme.palette ?? "gold"}
      className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed]"
      dir={currentTenant.localization?.direction ?? "rtl"}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-[#c5baa9] transition-colors hover:text-(--theme-primary)"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به صفحه رزرو
          </Link>
        </div>

        <BookReader />
      </div>
    </main>
  );
}
