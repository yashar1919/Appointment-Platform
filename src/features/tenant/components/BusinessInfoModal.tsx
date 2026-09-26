import {
  MapPin,
  Clock,
  Phone,
  Instagram,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Dialog } from "@/src/components/ui/Dialog";
import { BusinessConfig } from "@/src/types/domain";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";

interface BusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessConfig;
}

export function BusinessInfoModal({
  isOpen,
  onClose,
  business,
}: BusinessInfoModalProps) {
  const location = business.locations[0];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={business.name}
      description={business.headline}
    >
      <div className="space-y-5 text-sm text-[#ded8cb]">
        {/* Address and directions */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1a1d24] border border-[#2d313b]">
          <MapPin className="w-5 h-5 text-(--theme-primary) shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#f7f4ed] text-xs">
              آدرس و موقعیت
            </h4>
            <p className="text-xs leading-relaxed text-[#b5ada0]">
              {business.address}
            </p>
            {location?.directions && (
              <p className="text-[11px] text-[#8e8779] mt-1">
                {location.directions}
              </p>
            )}
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1a1d24] border border-[#2d313b]">
          <Clock className="w-5 h-5 text-(--theme-primary) shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#f7f4ed] text-xs">
              ساعات کاری و پذیرش
            </h4>
            <p className="text-xs text-[#b5ada0]">
              شنبه تا پنج‌شنبه از ساعت{" "}
              {toPersianDigits(business.workingHours.openTime)} الی{" "}
              {toPersianDigits(business.workingHours.closeTime)} (جمعه‌ها تعطیل)
            </p>
            <p className="text-[11px] text-[#8e8779]">
              حداقل زمان اطلاع جهت جابجایی یا کنسلی:{" "}
              {toPersianDigits(business.booking.minNoticeHours)} ساعت قبل
            </p>
          </div>
        </div>

        {/* Hygiene and Safety protocols */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1a1d24] border border-[#2d313b]">
          <ShieldCheck className="w-5 h-5 text-(--theme-primary) shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#f7f4ed] text-xs">
              پروتکل‌های بهداشتی استریل
            </h4>
            <p className="text-xs text-[#b5ada0] leading-relaxed">
              تمامی پک‌های بلیدینگ، تیغه‌های نانو و سری‌های دستگاه به صورت
              یک‌بار مصرف و در حضور زیباجو آنباکس می‌گردند.
            </p>
          </div>
        </div>

        {/* Contact Links */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={`tel:${business.phone}`}
            className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#21242c] hover:bg-[#2c303b] border border-(--theme-primary)/20 text-xs font-medium text-[#f7f4ed] transition-colors"
          >
            <Phone className="w-4 h-4 text-(--theme-primary)" />
            <span className="flex items-center gap-1">
              تماس:
              <span dir="ltr" className="inline-block">
                {business.phoneDisplay}
              </span>
            </span>
          </a>

          {business.instagram && (
            <a
              href={`https://instagram.com/${business.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#21242c] hover:bg-[#2c303b] border border-(--theme-primary)/20 text-xs font-medium text-[#f7f4ed] transition-colors"
            >
              <Instagram className="w-4 h-4 text-(--theme-primary)" />
              <span>اینستاگرام آکادمی</span>
            </a>
          )}
        </div>

        <div className="text-center pt-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-(--theme-primary)/80">
            <Sparkles className="w-3.5 h-3.5" />
            مجوز رسمی وزارت بهداشت و سرتیفیکیت فیبروز اروپا
          </span>
        </div>
      </div>
    </Dialog>
  );
}
