import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { Service, ServiceCategory } from "@/src/types/domain";
import { ServiceCategoryScroller } from "./ServiceCategoryScroller";
import { FeaturedServiceCard } from "./FeaturedServiceCard";
import { ServiceCard } from "./ServiceCard";

interface ServiceGridProps {
  categories: ServiceCategory[];
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  currency?: string;
}

export function ServiceGrid({
  categories,
  services,
  selectedService,
  onSelectService,
  currency = "تومان",
}: ServiceGridProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCategory =
        activeCategoryId === "all" || srv.categoryId === activeCategoryId;
      const matchesSearch =
        searchQuery.trim() === "" ||
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategoryId, searchQuery]);

  // Featured service to highlight (only if in 'all' or matching category and no active search)
  const featuredService = useMemo(() => {
    if (searchQuery.trim() !== "") return null;
    return filteredServices.find((s) => s.isFeatured) || null;
  }, [filteredServices, searchQuery]);

  // Regular services (excluding the featured one if it's already highlighted at the top)
  const regularServices = useMemo(() => {
    if (!featuredService) return filteredServices;
    return filteredServices.filter((s) => s.id !== featuredService.id);
  }, [filteredServices, featuredService]);

  return (
    <section id="services" className="space-y-6">
      <div className="space-y-2 text-right">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f7f4ed]">
              انتخاب خدمت زیبایی
            </h2>
            <p className="text-xs sm:text-sm text-[#a09a8e] mt-1">
              خدمت مورد نظر خود را انتخاب کنید تا زمان و شرایط رزرو را مشاهده
              فرمایید.
            </p>
          </div>

          {/* Search Input for discovery */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی خدمت یا تکنیک..."
              className="w-full h-11 pr-10 pl-3 rounded-xl bg-[#14161c] border border-[#2d313b] text-xs text-[#f7f4ed] placeholder-[#717786] focus:outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
            />
            <Search className="w-4 h-4 text-[#717786] absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Tabs Scroller */}
        <ServiceCategoryScroller
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />
      </div>

      {/* Featured Service Card (if available) */}
      {featuredService && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--theme-primary)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خدمت منتخب و ویژه ماه</span>
          </div>
          <FeaturedServiceCard
            service={featuredService}
            isSelected={selectedService?.id === featuredService.id}
            onSelect={onSelectService}
            currency={currency}
          />
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedService?.id === service.id}
              onSelect={onSelectService}
              currency={currency}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#14161c] rounded-2xl border border-[#2d313b] space-y-3">
          <p className="text-sm font-semibold text-[#ded8cb]">
            خدمتی با مشخصات جستجوی شما یافت نشد.
          </p>
          <p className="text-xs text-[#8e8779]">
            لطفاً عبارت جستجو را تغییر داده یا دسته‌بندی دیگری را انتخاب نمایید.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategoryId("all");
            }}
            className="text-xs text-[var(--theme-primary)] hover:underline cursor-pointer"
          >
            مشاهده همه خدمات
          </button>
        </div>
      )}
    </section>
  );
}
