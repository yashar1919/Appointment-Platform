/**
 * نام tenant را از ساب‌دامین استخراج می‌کند.
 * مثال: yasaman-raesi.unitimely.ir -> 'yasaman-raesi'
 */
export const getTenantSlugFromHostname = (): string => {
  // Subdomain routing support
  const hostname = window.location.hostname;

  // حالت توسعه لوکال
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "yasaman-raesi";
  }

  const parts = hostname.split(".");

  // اگر دامنه اصلی (unitimely.ir) یا www باشد
  if (parts.length <= 2 || parts[0] === "www") {
    return "yasaman-raesi"; // fallback به tenant پیش‌فرض
  }

  // در غیر این صورت، بخش اول ساب‌دامین است
  return parts[0];
};
