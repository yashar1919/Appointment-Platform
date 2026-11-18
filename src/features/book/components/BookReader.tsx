import { useEffect, useRef, useState, type RefObject } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Minus,
  Plus,
  RotateCcw,
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

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
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

  const goToPage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!numPages) return;

    const requestedPage = Number.parseInt(normalizeDigits(pageInput), 10);
    if (
      !Number.isInteger(requestedPage) ||
      requestedPage < 1 ||
      requestedPage > numPages
    ) {
      setPageInput(String(currentPage));
      return;
    }

    pageRefs.current[requestedPage]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
                <h1 className="text-lg font-bold text-[#f7f4ed]">
                  کتاب یاسمن رئیسی
                </h1>
                <p className="mt-1 text-xs text-[#a09a8e]">
                  برای مطالعه، صفحات را اسکرول کنید.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="باز کردن در تب جدید"
                title="باز کردن در تب جدید"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#2d313b] text-[#c5baa9] transition-colors hover:bg-[#21242c] hover:text-[#f7f4ed]"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={fileUrl}
                download={downloadName}
                aria-label="دانلود PDF"
                title="دانلود PDF"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-(--theme-primary) text-[#0b0c0f] transition-colors hover:bg-(--theme-primary-light)"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2d313b] pt-3">
            <div className="flex items-center gap-2" dir="ltr">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="min-h-11 min-w-11"
                aria-label="کوچک‌نمایی"
                title="کوچک‌نمایی"
                disabled={scale === MIN_ZOOM}
                onClick={() => changeZoom(-1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11 text-xs"
                aria-label="بازنشانی زوم"
                title="بازنشانی زوم"
                onClick={() => setScale(DEFAULT_ZOOM)}
              >
                {Math.round(scale * 100)}%
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="min-h-11 min-w-11"
                aria-label="بزرگ‌نمایی"
                title="بزرگ‌نمایی"
                onClick={() => changeZoom(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <button
                type="button"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[#c5baa9] transition-colors hover:bg-[#21242c] hover:text-[#f7f4ed]"
                aria-label="بازنشانی صفحه"
                title="بازنشانی صفحه"
                onClick={() => {
                  setScale(DEFAULT_ZOOM);
                  scrollContainerRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {numPages !== null && (
              <form className="flex items-center gap-2" onSubmit={goToPage}>
                <label
                  htmlFor="book-page-number"
                  className="text-xs text-[#a09a8e]"
                >
                  رفتن به صفحه
                </label>
                <input
                  id="book-page-number"
                  value={pageInput}
                  onChange={(event) => setPageInput(event.target.value)}
                  inputMode="numeric"
                  className="h-11 w-14 rounded-xl border border-[#2d313b] bg-[#0b0c0f] text-center text-sm text-[#f7f4ed] outline-none focus:border-(--theme-primary)"
                  aria-label="شماره صفحه"
                />
                <span className="text-xs text-[#a09a8e]">
                  از {toPersianNumber(numPages)}
                </span>
              </form>
            )}
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
            className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-2xl border border-[#2d313b]/80 bg-[#14161c]/90 px-4 py-2 text-sm text-[#f7f4ed] shadow-xl backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
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
