import { Link } from "react-router-dom";

export function TenantNotFoundPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed] flex items-center justify-center p-4 text-right">
      <section className="max-w-md w-full p-6 rounded-2xl bg-[#14161c] border border-[#2d313b] text-center space-y-4">
        <p className="text-xs text-(--theme-primary)">صفحه مورد نظر یافت نشد</p>
        <h1 className="text-xl font-bold">کسب‌وکار مورد نظر در دسترس نیست</h1>
        <p className="text-sm text-[#a09a8e] leading-relaxed">
          نشانی را بررسی کنید یا از لینک رزرو صحیح استفاده نمایید.
        </p>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center px-5 rounded-xl bg-(--theme-primary) text-[#0b0c0f] font-bold text-xs"
        >
          مشاهده دمو
        </Link>
      </section>
    </main>
  );
}
