// import { Download, FileText } from "lucide-react";
// import {
//   YASAMAN_BOOK_DOWNLOAD_NAME,
//   YASAMAN_BOOK_PDF_URL,
// } from "@/src/features/book/constants/bookConstants";

// export function BookReader() {
//   return (
//     <section aria-label="خواندن کتاب" className="w-full space-y-4" dir="rtl">
//       <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14161c] p-4 rounded-2xl border border-(--theme-primary)/20">
//         <div className="flex items-center gap-3 text-right">
//           <div className="p-2 rounded-xl bg-(--theme-primary)/10">
//             <FileText className="h-6 w-6 text-(--theme-primary)" />
//           </div>
//           <div>
//             <h1 className="text-base sm:text-lg font-bold text-[#f7f4ed]">
//               کتاب یاسمن رئیسی
//             </h1>
//             <p className="text-xs text-[#a09a8e] mt-1">
//               برای مطالعه، صفحات را اسکرول کنید یا زوم نمایید.
//             </p>
//           </div>
//         </div>

//         <a
//           href={YASAMAN_BOOK_PDF_URL}
//           download={YASAMAN_BOOK_DOWNLOAD_NAME}
//           className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--theme-primary)/10 border border-(--theme-primary)/30 px-4 text-sm font-medium text-[#f7f4ed] transition-all hover:bg-(--theme-primary)/20 active:scale-95"
//         >
//           <Download className="h-4 w-4" />
//           <span>ذخیره فایل PDF</span>
//         </a>
//       </div>

//       <div className="w-full rounded-2xl border border-(--theme-primary)/20 bg-[#14161c] overflow-hidden shadow-2xl">
//         <iframe
//           src={`${YASAMAN_BOOK_PDF_URL}#toolbar=1&navpanes=0&scrollbar=1`}
//           className="w-full h-[70vh] sm:h-[80vh] border-0"
//           title="کتاب یاسمن رئیسی"
//           style={{ backgroundColor: "#14161c" }}
//         />
//       </div>

//       <p className="text-center text-xs text-[#8e8779] mt-4">
//         در صورتی که مرورگر شما از نمایش مستقیم PDF پشتیبانی نمی‌کند، از دکمه
//         "ذخیره فایل PDF" در بالا استفاده کنید.
//       </p>
//     </section>
//   );
// }

import { Download, FileText, ExternalLink } from "lucide-react";
import {
  YASAMAN_BOOK_DOWNLOAD_NAME,
  YASAMAN_BOOK_PDF_URL,
} from "@/src/features/book/constants/bookConstants";

export function BookReader() {
  return (
    <section className="w-full space-y-6" dir="rtl">
      {/* هدر کتاب */}
      <div className="bg-[#14161c] p-6 rounded-2xl border border-[#2d313b]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            <div className="p-3 rounded-xl bg-[#a09a8e]/10">
              <FileText className="h-8 w-8 text-[#a09a8e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#f7f4ed]">
                کتاب یاسمن رئیسی
              </h1>
              <p className="text-sm text-[#a09a8e] mt-1">
                برای مطالعه، صفحات را در کادر زیر اسکرول یا زوم کنید.
              </p>
            </div>
          </div>

          <a
            href={YASAMAN_BOOK_PDF_URL}
            download={YASAMAN_BOOK_DOWNLOAD_NAME}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14161c] border border-[#2d313b] px-5 py-3 text-sm font-medium text-[#f7f4ed] transition-all hover:bg-[#21242c]"
          >
            <Download className="h-4 w-4" />
            <span>دانلود PDF</span>
          </a>
        </div>
      </div>

      {/* نمایش‌دهنده PDF (iframe) */}
      <div className="w-full rounded-2xl border border-[#2d313b] bg-[#14161c] overflow-hidden shadow-2xl">
        <iframe
          src={`${YASAMAN_BOOK_PDF_URL}#toolbar=1&navpanes=0`}
          className="w-full h-[70vh] sm:h-[80vh] border-0"
          title="کتاب یاسمن رئیسی"
        />
      </div>

      {/* لینک کمکی برای مرورگرهای خاص */}
      <div className="flex justify-center pt-2">
        <a
          href={YASAMAN_BOOK_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2d313b] bg-[#14161c] text-[#f7f4ed] hover:bg-[#21242c] transition-colors text-sm font-medium"
        >
          <ExternalLink className="h-4 w-4" />
          <span>اگر نمایش داده نشد، اینجا کلیک کنید</span>
        </a>
      </div>
    </section>
  );
}
