import { BusinessConfig } from "@/src/types/domain";
import { yasamanRaesiConfig } from "./yasamanRaesi";

export const DEMO_TENANTS: Record<string, BusinessConfig> = {
  "yasaman-raesi": yasamanRaesiConfig,
  "dr-ali": {
    ...yasamanRaesiConfig,
    id: "tenant-dr-ali-02",
    slug: "dr-ali",
    name: "کلینیک تخصصی پوست دکتر علی فرهمند",
    headline: "درمان‌های پیشرفته زیبایی و جوانسازی پوست با نظارت پزشک",
    description:
      "مرکز جامع لیزر، مزوتراپی، هایفوتراپی و پیلینگ شیمیایی تحت نظارت مستقیم پزشک متخصص پوست و مو.",
    phone: "09129876543",
    phoneDisplay: "۰۹۱۲ ۹۸۷ ۶۵۴۳",
    address: "تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۲۴، واحد ۳",
    city: "تهران",
  },
  "royal-lounge": {
    ...yasamanRaesiConfig,
    id: "tenant-royal-lounge-03",
    slug: "royal-lounge",
    name: "سالن زیبایی و اسپا رویال لانژ",
    headline: "آرامش، زیبایی و مراقبت اختصاصی از مو و پوست",
    description:
      "مجموعه‌ای فاخر برای ارائه جدیدترین متدهای رنگ و لایت، کراتین احیا و مراقبت‌های اسپا.",
    phone: "09121112233",
    phoneDisplay: "۰۹۱۲ ۱۱۱ ۲۲۳۳",
    address: "تهران، الهیه، مریم شرقی، مجتمع مدرن الهیه، طبقه ۳",
    city: "تهران",
  },
};

export function getTenantBySlug(slug?: string): BusinessConfig {
  if (!slug) return yasamanRaesiConfig;
  return DEMO_TENANTS[slug.toLowerCase()] || yasamanRaesiConfig;
}

export function getAllTenants(): BusinessConfig[] {
  return Object.values(DEMO_TENANTS);
}
