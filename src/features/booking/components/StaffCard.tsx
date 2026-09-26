import { Star, Check, Sparkles } from "lucide-react";
import { Staff } from "@/src/types/domain";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";
import { cn } from "@/src/lib/utils/cn";

interface StaffCardProps {
  staff: Staff;
  isSelected: boolean;
  onSelect: (staff: Staff) => void;
}

export function StaffCard({ staff, isSelected, onSelect }: StaffCardProps) {
  return (
    <div
      onClick={() => onSelect(staff)}
      className={cn(
        "group relative p-4 rounded-2xl bg-[#14161c] border transition-all duration-200 cursor-pointer text-right flex flex-col justify-between",
        isSelected
          ? "border-[var(--theme-primary)] ring-2 ring-[var(--theme-primary)]/30 bg-[#1a1d25] shadow-[0_4px_20px_rgb(var(--theme-primary-rgb)_/_0.15)]"
          : "border-[#2d313b]/80 hover:border-[var(--theme-primary)]/40 hover:bg-[#181b22]",
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* Avatar Slot */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--theme-primary)]/30 bg-[#21242c] shrink-0">
            <img
              src={staff.avatar}
              alt={staff.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Name & Role */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm sm:text-base font-bold text-[#f7f4ed] truncate">
                {staff.name}
              </h4>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-[#0b0c0f] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-3" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-[var(--theme-primary)] font-medium truncate mt-0.5">
              {staff.role}
            </p>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-[#a09a8e] leading-relaxed line-clamp-2">
          {staff.bio}
        </p>

        {/* Specialties */}
        {staff.specialties && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {staff.specialties.map((spec, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-[#21242c] text-[#ded8cb]"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info: Rating & Experience */}
      <div className="mt-4 pt-3 border-t border-[#262934] flex items-center justify-between text-xs text-[#8e8779]">
        {staff.rating && (
          <div className="flex items-center gap-1 text-[#e5dfd5]">
            <Star className="w-3.5 h-3.5 fill-[var(--theme-primary)] text-[var(--theme-primary)]" />
            <span className="font-semibold text-[#f7f4ed]">
              {toPersianDigits(staff.rating)}
            </span>
          </div>
        )}

        {staff.experienceYears && (
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-[var(--theme-primary)]" />
            {toPersianDigits(staff.experienceYears)} سال تجربه تخصصی
          </span>
        )}
      </div>
    </div>
  );
}
