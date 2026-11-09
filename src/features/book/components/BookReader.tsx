import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
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

interface PdfLoadResult {
  numPages: number;
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));
}

export function BookReader() {
  const readerRef = useRef<HTMLDivElement>(null);
  const [readerWidth, setReaderWidth] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [pageInputError, setPageInputError] = useState<string | null>(null);

  useEffect(() => {
    const element = readerRef.current;
    if (!element) return;

    const updateWidth = () => setReaderWidth(element.clientWidth);

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  function handleDocumentLoad({ numPages: totalPages }: PdfLoadResult) {
    setNumPages(totalPages);
    setPageNumber(1);
    setPageInput("1");
    setLoadError(false);
  }

  function handleDocumentError() {
    setLoadError(true);
  }

  function goToPage() {
    if (numPages === null) return;

    const parsedPage = Number.parseInt(normalizeDigits(pageInput).trim(), 10);
    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1 ||
      parsedPage > numPages
    ) {
      setPageInputError(`شماره صفحه باید بین ۱ تا ${numPages} باشد.`);
      return;
    }

    setPageNumber(parsedPage);
    setPageInput(String(parsedPage));
    setPageInputError(null);
  }

  function changePage(nextPage: number) {
    setPageNumber(nextPage);
    setPageInput(String(nextPage));
    setPageInputError(null);
  }

  const pageWidth = Math.max(Math.min(readerWidth - 24, 900), 280);
  const canGoPrevious = pageNumber > 1;
  const canGoNext = numPages !== null && pageNumber < numPages;

  return (
    <section aria-label="خواندن کتاب" className="w-full space-y-6" dir="rtl">
      <div className="rounded-2xl border border-[#2d313b] bg-[#14161c] p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 text-right">
            <div className="rounded-xl bg-[#a09a8e]/10 p-3">
              <FileText className="h-8 w-8 text-(--theme-primary)" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#f7f4ed]">
                کتاب یاسمن رئیسی
              </h1>
              <p className="mt-1 text-sm text-[#a09a8e]">
                صفحه موردنظر را با دکمه‌های پایین مطالعه کنید.
              </p>
            </div>
          </div>

          <a
            href={YASAMAN_BOOK_PDF_URL}
            download={YASAMAN_BOOK_DOWNLOAD_NAME}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2d313b] bg-[#14161c] px-5 py-3 text-sm font-medium text-[#f7f4ed] transition-all hover:bg-[#21242c]"
          >
            <Download className="h-4 w-4" />
            <span>دانلود PDF</span>
          </a>
        </div>
      </div>

      <div
        ref={readerRef}
        className="flex min-h-[60vh] w-full justify-center overflow-x-auto rounded-2xl border border-[#2d313b] bg-[#14161c] p-3 shadow-2xl sm:p-6"
      >
        {loadError ? (
          <div className="flex min-h-[50vh] items-center justify-center text-center text-sm leading-7 text-red-300">
            بارگذاری کتاب انجام نشد. لطفاً دوباره تلاش کنید یا فایل PDF را
            دانلود کنید.
          </div>
        ) : (
          <Document
            file={YASAMAN_BOOK_PDF_URL}
            onLoadSuccess={handleDocumentLoad}
            onLoadError={handleDocumentError}
            loading={
              <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#c5baa9]">
                در حال بارگذاری کتاب...
              </div>
            }
          >
            {readerWidth > 0 && (
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer
                loading={
                  <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#c5baa9]">
                    در حال آماده‌سازی صفحه...
                  </div>
                }
              />
            )}
          </Document>
        )}
      </div>

      {numPages !== null && !loadError && (
        <div
          className="flex flex-wrap items-center justify-center sm:justify-between gap-3 w-full sm:w-1/2 mx-auto"
          dir="ltr"
        >
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              aria-label="صفحه بعد"
              disabled={!canGoNext}
              onClick={() => changePage(pageNumber + 1)}
              size="sm"
              className="h-8 px-1.25 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="secondary"
              aria-label="صفحه قبل"
              disabled={!canGoPrevious}
              onClick={() => changePage(pageNumber - 1)}
              size="sm"
              className="h-8 px-1.25 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <span
              className="min-w-24 text-center text-xs text-[#c5baa9]"
              dir="rtl"
            >
              صفحه {pageNumber} از {numPages}
            </span>
          </div>

          <form
            className="flex items-center justify-center gap-2 w-auto sm:border-none border-t pt-3 sm:pt-0"
            dir="rtl"
            onSubmit={(event) => {
              event.preventDefault();
              goToPage();
            }}
          >
            <label
              htmlFor="book-page-number"
              className="text-xs text-[#c5baa9]"
            >
              رفتن به صفحه
            </label>
            <input
              id="book-page-number"
              value={pageInput}
              onChange={(event) => {
                setPageInput(event.target.value);
                setPageInputError(null);
              }}
              inputMode="numeric"
              aria-invalid={pageInputError !== null}
              aria-describedby={pageInputError ? "book-page-error" : undefined}
              className="w-11 rounded-md border border-[#2d313b] bg-[#14161c] pt-1 text-center text-sm text-[#f7f4ed] outline-none transition-colors focus:border-(--theme-primary)"
            />
            <span className="text-xs text-[#8e8779]">از {numPages}</span>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="px-6 h-7"
            >
              برو
            </Button>
          </form>
        </div>
      )}

      {pageInputError && (
        <p
          id="book-page-error"
          role="alert"
          className="text-center text-xs text-red-300"
        >
          {pageInputError}
        </p>
      )}
    </section>
  );
}
