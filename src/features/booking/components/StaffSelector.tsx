import { Users, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Staff } from "@/src/types/domain";
import { StaffCard } from "./StaffCard";
import { cn } from "@/src/lib/utils/cn";

interface StaffSelectorProps {
  staffList: Staff[];
  selectedStaff: Staff | null;
  allowAnyStaff: boolean;
  allowAnyStaffOption: boolean;
  onSelectStaff: (staff: Staff | null, anyStaff?: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function StaffSelector({
  staffList,
  selectedStaff,
  allowAnyStaff,
  allowAnyStaffOption,
  onSelectStaff,
  onContinue,
  onBack,
}: StaffSelectorProps) {
  const isSelected = selectedStaff !== null || allowAnyStaff;

  return (
    <div className="space-y-6 text-right">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f7f4ed]">
          انتخاب ارائه‌دهنده خدمت
        </h2>
        <p className="text-xs sm:text-sm text-[#a09a8e]">
          ارائه‌دهنده مورد نظر خود را انتخاب کنید یا اولین زمان خالی را رزرو
          کنید.
        </p>
      </div>

      {/* Any Staff Option Card */}
      {allowAnyStaffOption && (
        <div
          onClick={() => onSelectStaff(null, true)}
          className={cn(
            "p-4 rounded-2xl bg-[#14161c] border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4",
            allowAnyStaff
              ? "border-(--theme-primary) ring-2 ring-(--theme-primary)/30 bg-[#1a1d25]"
              : "border-[#2d313b]/80 hover:border-(--theme-primary)/40 hover:bg-[#181b22]",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#21242c] border border-(--theme-primary)/20 flex items-center justify-center text-(--theme-primary)">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#f7f4ed]">
                اولین متخصص در دسترس (پیشنهاد هوشمند)
              </h4>
              <p className="text-xs text-[#a09a8e] mt-0.5">
                مناسب‌ترین و زودترین نوبت ممکن برای شما در نظر گرفته می‌شود.
              </p>
            </div>
          </div>

          {allowAnyStaff && (
            <div className="w-6 h-6 rounded-full bg-(--theme-primary) text-[#0b0c0f] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-3" />
            </div>
          )}
        </div>
      )}

      {/* Individual Staff Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => (
          <StaffCard
            key={staff.id}
            staff={staff}
            isSelected={!allowAnyStaff && selectedStaff?.id === staff.id}
            onSelect={(s) => onSelectStaff(s, false)}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between gap-3 border-t border-[#262934]">
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 px-5 py-2 rounded-xl border border-[#2d313b] hover:bg-[#21242c] text-xs sm:text-sm font-medium text-[#ded8cb] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            مرحله قبل
          </span>
        </button>

        <button
          type="button"
          disabled={!isSelected}
          onClick={onContinue}
          className="min-h-12 px-5 py-2 rounded-xl bg-(--theme-primary) hover:bg-(--theme-primary-light) disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-[#0b0c0f] transition-all shadow-[0_4px_16px_rgb(var(--theme-primary-rgb)/0.25)] cursor-pointer"
        >
          <span className="flex items-center gap-2">
            مرحله بعد
            <ArrowLeft className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
