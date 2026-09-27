import { useLayoutEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRouter } from "@/src/app/router/AppRouter";
import { PWAInstallBanner } from "@/src/components/PWAInstallBanner";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    window.history.scrollRestoration = "manual";
    resetScroll();

    const frameId = window.requestAnimationFrame(resetScroll);
    const timeoutId = window.setTimeout(resetScroll, 0);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouter />
      <PWAInstallBanner />
    </BrowserRouter>
  );
}
