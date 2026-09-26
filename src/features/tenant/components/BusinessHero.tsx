import { ArrowDown, MapPin, Sparkles, Star } from "lucide-react";
import { BusinessConfig } from "@/src/types/domain";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";

interface BusinessHeroProps {
  business: BusinessConfig;
  onExploreServices: () => void;
}

export function BusinessHero({
  business,
  onExploreServices,
}: BusinessHeroProps) {
  const hero = business.content?.hero;

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-8 sm:pb-14 border-b border-[#2d313b]/40">
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-(--theme-primary)/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-right">
            <div className="flex justify-between lg:justify-start items-center gap-2 text-xs text-[#c5baa9] tracking-wide">
              <span className="text-(--theme-primary) font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {hero?.eyebrow || business.name}
              </span>
              <span aria-hidden="true" className="text-[#5a6070]">
                ·
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#9a9488]" />
                {business.city}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#f7f4ed] leading-[1.3] sm:leading-tight">
              {business.headline}
            </h1>
            <p className="text-xs sm:text-base text-[#b5ada0] leading-relaxed max-w-xl">
              {business.description}
            </p>
            <div className="flex w-full items-center text-center border-y text-xs text-[#a09a8e] py-3">
              <div className="flex flex-1 items-center justify-center gap-1.5 px-3 text-[#e5dfd5]">
                <div className="flex items-center text-(--theme-primary)">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#f7f4ed]">
                  {toPersianDigits(business.rating)}
                </span>
              </div>
              <span className="flex flex-1 items-center justify-center border-r px-3">
                {toPersianDigits(business.reviewsCount)} تجربه ثبت‌شده
              </span>
            </div>
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreServices}
                className="inline-flex w-full lg:w-9/10 items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-(--theme-primary) text-[#0b0c0f] font-bold text-sm transition-all"
              >
                <span>{hero?.ctaLabel || "انتخاب خدمت و رزرو"}</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              {hero?.availabilityLabel && (
                <span className="text-xs text-[#8e8779]">
                  {hero.availabilityLabel}
                </span>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden border border-(--theme-primary)/20 bg-[#161820] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8)] aspect-16/10 sm:aspect-4/3">
              <img
                src={business.coverImage}
                alt={business.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-transparent to-black/20" />
              <div className="absolute bottom-3 right-3 left-3 p-3 rounded-xl bg-[#0b0c0f]/80 backdrop-blur-md border border-(--theme-primary)/20">
                <p className="text-xs font-bold text-[#f7f4ed]">
                  {business.name}
                </p>
                <p className="text-[11px] text-(--theme-primary)">
                  {business.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
