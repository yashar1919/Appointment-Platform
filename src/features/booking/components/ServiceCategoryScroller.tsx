import { useRef, useEffect } from "react";
import { ServiceCategory } from "@/src/types/domain";
import { cn } from "@/src/lib/utils/cn";

interface ServiceCategoryScrollerProps {
  categories: ServiceCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function ServiceCategoryScroller({
  categories,
  activeCategoryId,
  onSelectCategory,
}: ServiceCategoryScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active category into view
  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategoryId]);

  return (
    <div className="w-full relative py-2">
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              ref={isActive ? activeBtnRef : null}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "min-h-11 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0 flex items-center gap-1.5",
                isActive
                  ? "bg-[var(--theme-primary)] text-[#0b0c0f] font-bold shadow-[0_2px_12px_rgb(var(--theme-primary-rgb)_/_0.25)]"
                  : "bg-[#181a22] text-[#b5ada0] hover:text-[#f7f4ed] hover:bg-[#222530] border border-[#2d313b]/60",
              )}
            >
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
