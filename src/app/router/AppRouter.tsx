import { Routes, Route } from "react-router-dom";
import { BookingPage } from "@/src/pages/BookingPage";
import { BookingSuccessPage } from "@/src/pages/BookingSuccessPage";
import { TenantNotFoundPage } from "@/src/pages/TenantNotFoundPage";
import { getTenantSlugFromHostname } from "@/src/lib/tenantResolver";
import { lazy, Suspense } from "react";

const YasamanBookPage = lazy(
  () => import("@/src/features/book/pages/YasamanBookPage"),
);

function BookRoute() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0b0c0f] text-sm text-[#c5baa9]">
          در حال بارگذاری کتاب...
        </main>
      }
    >
      <YasamanBookPage />
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Subdomain routing support */}
      <Route
        path="/"
        element={<BookingPage tenantSlug={getTenantSlugFromHostname()} />}
      />
      <Route path="/success/:id" element={<BookingSuccessPage />} />

      <Route path="/book" element={<BookRoute />} />

      <Route path="*" element={<TenantNotFoundPage />} />
    </Routes>
  );
}
