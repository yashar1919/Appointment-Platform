import { Download, FileText } from "lucide-react";
import {
  YASAMAN_BOOK_DOWNLOAD_NAME,
  YASAMAN_BOOK_PDF_URL,
} from "@/src/features/book/constants/bookConstants";

export function BookReader() {
  return (
    <section aria-label="خواندن کتاب" className="w-full space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14161c] p-4 rounded-2xl border border-(--theme-primary)/20">
        <div className="flex items-center gap-3 text-right">
          <div className="p-2 rounded-xl bg-(--theme-primary)/10">
            <FileText className="h-6 w-6 text-(--theme-primary)" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#f7f4ed]">
              کتاب یاسمن رئیسی
            </h1>
            <p className="text-xs text-[#a09a8e] mt-1">
              برای مطالعه، صفحات را اسکرول کنید یا زوم نمایید.
            </p>
          </div>
        </div>

        <a
          href={YASAMAN_BOOK_PDF_URL}
          download={YASAMAN_BOOK_DOWNLOAD_NAME}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--theme-primary)/10 border border-(--theme-primary)/30 px-4 text-sm font-medium text-[#f7f4ed] transition-all hover:bg-(--theme-primary)/20 active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>ذخیره فایل PDF</span>
        </a>
      </div>

      <div className="w-full rounded-2xl border border-(--theme-primary)/20 bg-[#14161c] overflow-hidden shadow-2xl">
        <iframe
          src={`${YASAMAN_BOOK_PDF_URL}#toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full h-[70vh] sm:h-[80vh] border-0"
          title="کتاب یاسمن رئیسی"
          style={{ backgroundColor: "#14161c" }}
        />
      </div>

      <p className="text-center text-xs text-[#8e8779] mt-4">
        در صورتی که مرورگر شما از نمایش مستقیم PDF پشتیبانی نمی‌کند، از دکمه
        "ذخیره فایل PDF" در بالا استفاده کنید.
      </p>
    </section>
  );
}
