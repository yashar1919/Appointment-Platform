import { Routes, Route, Navigate } from "react-router-dom";
import { BookingPage } from "@/src/pages/BookingPage";
import { BookingSuccessPage } from "@/src/pages/BookingSuccessPage";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/booking/yasaman-raesi" replace />}
      />
      <Route path="/booking/:tenantSlug" element={<BookingPage />} />
      <Route
        path="/booking/:tenantSlug/success/:appointmentId"
        element={<BookingSuccessPage />}
      />
      <Route
        path="*"
        element={<Navigate to="/booking/yasaman-raesi" replace />}
      />
    </Routes>
  );
}
