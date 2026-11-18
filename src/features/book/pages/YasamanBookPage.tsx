import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BookReader } from "@/src/features/book/components/BookReader";
import {
  YASAMAN_BOOK_DOWNLOAD_NAME,
  YASAMAN_BOOK_PDF_URL,
} from "@/src/features/book/constants/bookConstants";

export default function YasamanBookPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0f] text-[#f7f4ed]" dir="rtl">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-[#c5baa9] transition-colors hover:text-[#f7f4ed]"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به صفحه رزرو
          </Link>
        </div>

        <BookReader
          fileUrl={YASAMAN_BOOK_PDF_URL}
          downloadName={YASAMAN_BOOK_DOWNLOAD_NAME}
        />
      </div>
    </main>
  );
}
