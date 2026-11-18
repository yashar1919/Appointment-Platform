import { useEffect, useRef, useState, type RefObject } from "react";
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Minus,
  Plus,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/src/components/ui/Button";
import {
  YASAMAN_BOOK_DOWNLOAD_NAME,
  YASAMAN_BOOK_PDF_URL,
} from "@/src/features/book/constants/bookConstants";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 1;
const ZOOM_STEP = 0.25;
const PAGE_ASPECT_RATIO = 1.414;

interface BookReaderProps {
  fileUrl: string;
  downloadName: string;
}

interface PdfLoadResult {
  numPages: number;
}

interface LazyPageProps {
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  rootRef: RefObject<HTMLDivElement | null>;
  onCenterVisible: (pageNumber: number) => void;
  registerPage: (pageNumber: number, element: HTMLDivElement | null) => void;
}

function toPersianNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function SkeletonPage({ height }: { height: number }) {
  return (
    <div
      aria-hidden="true"
      className="w-full animate-pulse rounded-lg bg-[#21242c]"
      style={{ height }}
    />
  );
}

function LazyPage({
  pageNumber,
  pageWidth,
  pageHeight,
  rootRef,
  onCenterVisible,
  registerPage,
}: LazyPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = pageRef.current;
    const root = rootRef.current;
    if (!element || !root) return;

    const renderObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShouldRender(true);
      },
      { root, rootMargin: "200% 0px" },
    );

    const centerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onCenterVisible(pageNumber);
      },
      { root, rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    renderObserver.observe(element);
    centerObserver.observe(element);

    return () => {
      renderObserver.disconnect();
      centerObserver.disconnect();
    };
  }, [onCenterVisible, pageNumber, rootRef]);

  return (
    <div
      ref={(element) => {
        pageRef.current = element;
        registerPage(pageNumber, element);
      }}
      data-page-number={pageNumber}
      className="mx-auto w-fit max-w-none shrink-0 py-3 first:pt-0 last:pb-0"
      style={{
        minHeight: pageHeight,
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${pageHeight}px`,
      }}
    >
      {shouldRender ? (
        <Page
          pageNumber={pageNumber}
          width={pageWidth}
          devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
          canvasBackground="#ffffff"
          renderTextLayer
          renderAnnotationLayer
          loading={<SkeletonPage height={pageHeight} />}
        />
      ) : (
        <SkeletonPage height={pageHeight} />
      )}
    </div>
  );
}

export function BookReader({ fileUrl, downloadName }: BookReaderProps) {
  const [isIOS] = useState(isIOSDevice);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setPageInput] = useState("1");
  const [scale, setScale] = useState(DEFAULT_ZOOM);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const updateWidth = () => setContainerWidth(element.clientWidth);
    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const horizontalPadding = window.innerWidth < 640 ? 20 : 48;
  const basePageWidth = Math.min(
    Math.max(containerWidth - horizontalPadding, 1),
    Math.min(window.innerWidth - horizontalPadding, 900),
  );
  const pageWidth = Math.round(basePageWidth * scale);
  const pageHeight = Math.round(pageWidth * PAGE_ASPECT_RATIO);

  const centerPageHorizontally = (pageNumber: number) => {
    const container = scrollContainerRef.current;
    const page = pageRefs.current[pageNumber];
    if (!container || !page) return;

    const containerRect = container.getBoundingClientRect();
    const pageRect = page.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const pageCenter = pageRect.left + pageRect.width / 2;

    container.scrollLeft += pageCenter - containerCenter;
  };

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element || !numPages || !pageWidth) return;

    let secondFrameId = 0;
    const frameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        centerPageHorizontally(currentPage);
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(secondFrameId);
    };
  }, [containerWidth, numPages, pageWidth]);

  const handleDocumentLoad = ({ numPages: totalPages }: PdfLoadResult) => {
    setNumPages(totalPages);
    setCurrentPage(1);
    setPageInput("1");
    setIsLoading(false);
    setError(null);
  };

  const handleDocumentError = () => {
    setIsLoading(false);
    setError("بارگذاری کتاب انجام نشد. لطفاً دوباره تلاش کنید.");
  };

  const handleCenterVisible = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setPageInput(String(pageNumber));
  };

  const registerPage = (pageNumber: number, element: HTMLDivElement | null) => {
    pageRefs.current[pageNumber] = element;
  };

  const changeZoom = (direction: -1 | 1) => {
    setScale((currentScale) =>
      Math.max(
        MIN_ZOOM,
        Number((currentScale + direction * ZOOM_STEP).toFixed(2)),
      ),
    );
  };

  if (isIOS) {
    return (
      <section
        aria-label="دسترسی به کتاب"
        className="relative overflow-hidden rounded-3xl border border-[#3b3a36] bg-[linear-gradient(145deg,#191a1d_0%,#111216_55%,#191611_100%)] p-6 text-center shadow-2xl sm:p-10"
        dir="rtl"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-(--theme-primary)/10 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-xl flex-col items-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-(--theme-primary)/25 bg-(--theme-primary)/10 text-(--theme-primary)">
            <BookOpen className="h-8 w-8" strokeWidth={1.6} />
          </div>
          {/* <p className="mb-2 text-xs font-medium tracking-[0.18em] text-(--theme-primary)">
            کتاب الکترونیکی
          </p> */}
          <h1 className="text-xl font-bold text-[#f7f4ed] sm:text-2xl">
            پوست، از شناخت تا درمان
          </h1>
          <p className="mt-1 text-xs font-medium text-(--theme-primary)">
            <span className="text-stone-500">نویسنده:</span> یاسمن رئیسی
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#b8b2a7]">
            برای مطالعه راحت‌تر در آیفون یا آیپد، کتاب را در مرورگر باز کنید یا
            فایل آن را دریافت کنید.
          </p>

          <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="مشاهده در مرورگر"
              title="مشاهده در مرورگر"
              className="flex min-h-11 px-3 min-w-11 w-full items-center justify-center rounded-xl border border-[#2d313b] text-[#c5baa9] transition-colors hover:bg-[#21242c] hover:text-[#f7f4ed]"
            >
              <div className="flex gap-2">
                <span className="text-sm">مشاهده در مرورگر</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </a>
            <a
              href={fileUrl}
              download={downloadName}
              aria-label="دانلود فایل کتاب"
              title="دانلود فایل کتاب"
              className="flex min-h-11 px-3 min-w-11 w-full items-center justify-center rounded-xl bg-(--theme-primary) text-[#0b0c0f] transition-colors hover:bg-(--theme-primary-light)"
            >
              <div className="flex gap-2">
                <span className="text-sm">دانلود فایل کتاب</span>
                <Download className="h-4 w-4" />
              </div>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="خواندن کتاب" className="w-full space-y-4" dir="rtl">
      <header className="rounded-2xl border border-[#2d313b] bg-[#14161c] p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-right">
              <div className="rounded-xl bg-[#a09a8e]/10 p-2.5">
                <FileText className="h-6 w-6 text-(--theme-primary)" />
              </div>
              <div>
                <h1 className="text-sm min-[310px]:text-lg font-bold text-[#f7f4ed]">
                  پوست، از شناخت تا درمان
                </h1>
                <p className="mt-1 text-xs text-[#a09a8e] flex flex-col gap-1">
                  نویسنده: یاسمن رئیسی
                  <span className="text-mist-500 text-[10px]">
                    برای مطالعه، صفحات را اسکرول کنید.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2d313b] pt-3">
            <div className="flex flex-col min-[380px]:flex-row items-center gap-2 w-full md:w-1/2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="مشاهده در مرورگر"
                title="مشاهده در مرورگر"
                className="flex min-h-11 px-3 min-w-11 w-full items-center justify-center rounded-xl border border-[#2d313b] text-[#c5baa9] transition-colors hover:bg-[#21242c] hover:text-[#f7f4ed]"
              >
                <div className="flex gap-2">
                  <span className="text-sm">مشاهده در مرورگر</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
              <a
                href={fileUrl}
                download={downloadName}
                aria-label="دانلود فایل کتاب"
                title="دانلود فایل کتاب"
                className="flex min-h-11 px-3 min-w-11 w-full items-center justify-center rounded-xl bg-(--theme-primary) text-[#0b0c0f] transition-colors hover:bg-(--theme-primary-light)"
              >
                <div className="flex gap-2">
                  <span className="text-sm">دانلود فایل کتاب</span>
                  <Download className="h-4 w-4" />
                </div>
              </a>
            </div>
            <div
              className="flex items-center justify-between w-full md:w-1/3 gap-2 border-t border-[#2d313b] md:border-none md:pt-0 pt-3"
              dir="ltr"
            >
              <Button
                type="button"
                variant="secondary"
                //size="icon"
                className="min-h-8 min-w-11 max-w-20 w-1/4 rounded-xl h-10 bg-stone-800/20 hover:bg-stone-900"
                aria-label="کوچک‌نمایی"
                title="کوچک‌نمایی"
                disabled={scale === MIN_ZOOM}
                onClick={() => changeZoom(-1)}
              >
                <Minus className="h-5.5 w-5.5 text-stone-300" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="min-h-8 min-w-11 text-xl font-light tracking-widest w-1/3"
                aria-label="بازنشانی زوم"
                title="بازنشانی زوم"
                onClick={() => setScale(DEFAULT_ZOOM)}
              >
                {Math.round(scale * 100)} %
              </Button>
              <Button
                type="button"
                variant="secondary"
                //size="icon"
                className="min-h-8 min-w-11 max-w-20 w-1/4 rounded-xl h-10 bg-stone-800/20 hover:bg-stone-900"
                aria-label="بزرگ‌نمایی"
                title="بزرگ‌نمایی"
                onClick={() => changeZoom(1)}
              >
                <Plus className="h-5.5 w-5.5 text-stone-300" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          dir="ltr"
          className="book-scroll-container max-h-[75vh] min-h-[60vh] w-full overflow-y-auto overflow-x-auto rounded-2xl border border-[#2d313b] bg-[#0b0c0f] p-2.5 shadow-2xl [touch-action:pan-x_pan-y_pinch-zoom] sm:p-6"
        >
          {isLoading && (
            <div className="space-y-4">
              <SkeletonPage height={Math.max(pageHeight, 420)} />
              <SkeletonPage height={Math.max(pageHeight, 420)} />
            </div>
          )}

          {error ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm leading-7 text-red-300">{error}</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setRetryKey((current) => current + 1);
                }}
              >
                تلاش دوباره
              </Button>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-(--theme-primary) hover:text-(--theme-primary-light)"
              >
                باز کردن فایل در تب جدید
              </a>
            </div>
          ) : (
            <Document
              key={retryKey}
              file={fileUrl}
              onLoadSuccess={handleDocumentLoad}
              onLoadError={handleDocumentError}
              loading={null}
              error={null}
            >
              {numPages !== null && containerWidth > 0 && (
                <div
                  className="flex w-max min-w-full flex-col items-center"
                  style={{
                    minWidth: Math.max(
                      pageWidth + horizontalPadding,
                      containerWidth - horizontalPadding,
                    ),
                  }}
                >
                  {Array.from({ length: numPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <LazyPage
                        key={pageNumber}
                        pageNumber={pageNumber}
                        pageWidth={pageWidth}
                        pageHeight={pageHeight}
                        rootRef={scrollContainerRef}
                        onCenterVisible={handleCenterVisible}
                        registerPage={registerPage}
                      />
                    );
                  })}
                </div>
              )}
            </Document>
          )}
        </div>

        {isLoading && !error && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-20 flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-[#2d313b] bg-[#0b0c0f]/90 text-center backdrop-blur-sm"
          >
            <div
              aria-hidden="true"
              className="h-10 w-10 animate-spin rounded-full border-2 border-[#2d313b] border-t-(--theme-primary)"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#f7f4ed]">
                در حال آماده‌سازی کتاب...
              </p>
              <p className="text-xs text-[#a09a8e]">لطفاً چند لحظه صبر کنید</p>
            </div>
          </div>
        )}

        {numPages !== null && !error && !isLoading && (
          <div
            dir="rtl"
            className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-2xl border border-[#2d313b]/80 bg-[#14161c]/90 px-4 py-2 text-sm text-[#f7f4ed] shadow-xl backdrop-blur-md pb-1"
          >
            صفحه {toPersianNumber(currentPage)} از {toPersianNumber(numPages)}
          </div>
        )}
      </div>
    </section>
  );
}

export function DefaultBookReader() {
  return (
    <BookReader
      fileUrl={YASAMAN_BOOK_PDF_URL}
      downloadName={YASAMAN_BOOK_DOWNLOAD_NAME}
    />
  );
}
