import { Routes, Route } from "react-router-dom";
import { BookingPage } from "@/src/pages/BookingPage";
import { BookingSuccessPage } from "@/src/pages/BookingSuccessPage";
import { TenantNotFoundPage } from "@/src/pages/TenantNotFoundPage";
import { getTenantSlugFromHostname } from "@/src/lib/tenantResolver";
import YasamanBookPage from "@/src/features/book/pages/YasamanBookPage";

export function AppRouter() {
  return (
    <Routes>
      {/* Subdomain routing support */}
      <Route
        path="/"
        element={<BookingPage tenantSlug={getTenantSlugFromHostname()} />}
      />
      <Route path="/success/:id" element={<BookingSuccessPage />} />

      <Route path="/book" element={<YasamanBookPage />} />

      <Route path="*" element={<TenantNotFoundPage />} />
    </Routes>
  );
}
