import { ArrowDown, Star, MapPin, Sparkles } from "lucide-react";
import { BusinessConfig } from "@/src/types/domain";
import { toPersianDigits } from "@/src/lib/formatting/persianNumbers";

interface BeautyHeroProps {
  business: BusinessConfig;
  onExploreServices: () => void;
}

export function BeautyHero({ business, onExploreServices }: BeautyHeroProps) {
  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-8 sm:pb-14 border-b border-[#2d313b]/40">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#cbb38d]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#8e6559]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text and Value Proposition */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-right">
            {/* Editorial Kicker & Location (No pills) */}
            <div className="flex justify-between lg:justify-start items-center gap-2 text-xs text-[#c5baa9] tracking-wide">
              <span className="text-[#cbb38d] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                آرایش دائم و طراحی آناتومیک چهره
              </span>
              <span aria-hidden="true" className="text-[#5a6070]">
                ·
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#9a9488]" />
                {business.city}،{" "}
                {business.locations[0]?.name.replace("شعبه مرکزی ", "")}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#f7f4ed] leading-[1.3] sm:leading-tight tracking-tight">
              {business.headline}
            </h1>

            {/* Editorial Description */}
            <p className="text-xs sm:text-base text-[#b5ada0] leading-relaxed max-w-xl font-normal">
              {business.description}
            </p>

            {/* Social Proof adjacency */}
            <div className="flex w-full md:w-9/10 md:mx-auto lg:mx-0 items-center text-center border-y text-xs text-[#a09a8e] py-3">
              <div className="flex flex-1 items-center justify-center gap-1.5 px-3 text-[#e5dfd5]">
                <div className="flex items-center text-[#cbb38d]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#f7f4ed] mr-1 hidden lg:block">
                  {toPersianDigits(business.rating)}
                </span>
              </div>
              <span className="flex flex-1 items-center justify-center border-r px-3">
                {toPersianDigits(business.reviewsCount)} تجربه موفق
              </span>
              <span className="flex flex-1 items-center justify-center border-r px-3 text-[#cbb38d]">
                رنگ‌های ایمن
              </span>
            </div>

            {/* Hero CTA Button */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreServices}
                className="inline-flex w-full lg:w-9/10 items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#cbb38d] hover:bg-[#ddc5a2] text-[#0b0c0f] font-bold text-sm transition-all duration-200 shadow-[0_4px_20px_-2px_rgba(203,179,141,0.35)] active:scale-98 min-h-12 cursor-pointer"
              >
                <span>انتخاب خدمت و رزرو آنلاین</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              <span className="text-xs text-[#8e8779] hidden sm:flex sm:gap-2 sm:items-center">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                </span>
                نوبت‌دهی آنی بدون نیاز به پیش‌پرداخت
              </span>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-[#cbb38d]/20 bg-[#161820] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8)] aspect-16/10 sm:aspect-4/3">
              <img
                src={business.coverImage}
                alt={business.name}
                referrerPolicy="no-referrer"
                className="w-full h-fit object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-transparent to-black/20" />

              {/* Subtle caption bottom */}
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between p-3 rounded-xl bg-[#0b0c0f]/80 backdrop-blur-md border border-[#cbb38d]/20">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#f7f4ed]">
                    {business.name}
                  </p>
                  <p className="text-[11px] text-[#cbb38d]">
                    طراحی هارمونی و فرم چهره بدون دگرگونی رنگ
                  </p>
                </div>
                <div className="text-left text-[11px] text-[#9a9488]">
                  مشاوره رایگان
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
