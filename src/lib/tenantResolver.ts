export const getTenantSlugFromHostname = (): string => {
  const hostname = window.location.hostname;

  // ۱. محیط لوکال
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "yasaman-raesi";
  }

  // ۲. آدرس‌های پیش‌فرض Vercel (برای زمانی که دامنه اصلی هنوز کامل ست نشده)
  if (hostname.includes("vercel.app")) {
    return "yasaman-raesi";
  }

  const parts = hostname.split(".");

  // ۳. دامنه اصلی (unitimely.ir) یا www.unitimely.ir
  if (parts.length <= 2 || parts[0] === "www") {
    return "yasaman-raesi";
  }

  // ۴. ساب‌دامین واقعی (مثلاً yasaman-raesi.unitimely.ir)
  return parts[0];
};
