import { Routes, Route } from "react-router-dom";
import { BookingPage } from "@/src/pages/BookingPage";
import { BookingSuccessPage } from "@/src/pages/BookingSuccessPage";
import { TenantNotFoundPage } from "@/src/pages/TenantNotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<TenantNotFoundPage />} />
      <Route path="/booking/:tenantSlug" element={<BookingPage />} />
      <Route
        path="/booking/:tenantSlug/success/:appointmentId"
        element={<BookingSuccessPage />}
      />
      <Route path="*" element={<TenantNotFoundPage />} />
    </Routes>
  );
}
