import { Download, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInstallPrompt } from "@/src/hooks/useInstallPrompt";
import { Button } from "@/src/components/ui/Button";

const DISMISSED_KEY = "pwa-install-dismissed-until";
const DISMISS_DURATION = 90 * 24 * 60 * 60 * 1000;

export function PWAInstallBanner() {
  const { isInstalled, isIOS, isInstallable, promptInstall } =
    useInstallPrompt();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInstalled || (!isInstallable && !isIOS)) return;

    const dismissedUntil = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    if (dismissedUntil > Date.now()) return;

    const timerId = window.setTimeout(() => setIsVisible(true), 3000);
    return () => window.clearTimeout(timerId);
  }, [isInstallable, isInstalled, isIOS]);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now() + DISMISS_DURATION));
    setIsVisible(false);
  };

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) setIsVisible(false);
  };

  if (!isVisible || isInstalled) return null;

  return (
    <aside
      role="dialog"
      aria-label="نصب اپلیکیشن رزرو آنلاین"
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(25rem,calc(100vw-3rem))] rounded-2xl border border-(--theme-primary)/30 bg-[#14161c]/95 p-4 text-right shadow-[0_16px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="بستن پیشنهاد نصب"
        className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-[#8e8779] transition-colors hover:bg-[#21242c] hover:text-[#f7f4ed] cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pl-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--theme-primary)/15 text-(--theme-primary)">
          {isIOS ? (
            <Share2 className="h-5 w-5" />
          ) : (
            <Download className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#f7f4ed]">
            دسترسی سریع‌تر به رزروها
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[#b5ada0]">
            {isIOS
              ? "از منوی Share گزینه Add to Home Screen را بزنید تا اپلیکیشن روی صفحه اصلی شما اضافه شود."
              : "این اپلیکیشن را روی دستگاه خود نصب کنید تا سریع‌تر به خدمات و نوبت‌ها دسترسی داشته باشید."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={dismiss}
          className="text-xs text-[#a09a8e]"
        >
          بعداً
        </Button>
        {!isIOS && isInstallable && (
          <Button
            type="button"
            size="sm"
            onClick={handleInstall}
            className="text-xs"
          >
            نصب اپلیکیشن
          </Button>
        )}
      </div>
    </aside>
  );
}
