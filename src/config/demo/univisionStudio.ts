import { BusinessConfig } from "@/src/types/domain";
import logoImage from "@/src/assets/images/logo256x256-min.png";
import coverImage from "@/src/assets/images/staff-image/yasaman1.jpg";
import serviceImage from "@/src/assets/images/services-image/nano-brows.jpg";
import lipImage from "@/src/assets/images/service_lip_blush_1790400872703.jpg";
import detailImage from "@/src/assets/images/services-image/therapy2.jpg";
import yasamanImage from "@/src/assets/images/staff-image/yasaman3.jpeg";
import womenOneImage from "@/src/assets/images/staff-image/women1.jpg";
import womenFourImage from "@/src/assets/images/staff-image/women4.jpg";

export const univisionStudioConfig: BusinessConfig = {
  id: "tenant-univision-studio-04",
  slug: "univision-studio",
  name: "Univision Studio",
  headline: "زیبایی حرفه‌ای، تجربه‌ای متفاوت",
  description:
    "یک استودیوی تخصصی برای خدمات زیبایی، مراقبت و طراحی چهره با تمرکز بر کیفیت و رضایت شما.",
  logo: logoImage,
  coverImage,
  phone: "09120000000",
  phoneDisplay: "۰۹۱۲ ۰۰۰ ۰۰۰۰",
  instagram: "univision.studio",
  address: "شیراز، معالی‌آباد، ساختمان یونی‌ویژن، طبقه دوم",
  city: "شیراز",
  locale: "fa-IR",
  timezone: "Asia/Tehran",
  currency: "تومان",
  currencySymbol: "تومان",
  rating: 4.9,
  reviewsCount: 128,
  theme: { palette: "sky" },
  localization: {
    locale: "fa-IR",
    timezone: "Asia/Tehran",
    currency: "تومان",
    currencySymbol: "تومان",
    direction: "rtl",
    phoneCountry: "IR",
  },
  content: {
    hero: {
      eyebrow: "استودیوی تخصصی زیبایی",
      ctaLabel: "مشاهده خدمات",
      availabilityLabel: "پذیرش نوبت در این هفته",
    },
    labels: {
      servicesTitle: "انتخاب خدمت",
      servicesDescription:
        "خدمت مورد نظر خود را انتخاب کنید تا زمان‌های قابل رزرو را ببینید.",
      staffTitle: "انتخاب متخصص",
      staffDescription:
        "متخصص مورد نظر خود را انتخاب کنید یا اولین متخصص در دسترس را برگزینید.",
      historyDescription: "تاریخچه نوبت‌های شما در یونی‌ویژن استودیو",
    },
    policies: {
      payment: "پرداخت پس از دریافت خدمت در استودیو انجام می‌شود.",
      cancellation:
        "لطفاً برای تغییر یا لغو نوبت حداقل ۱۲ ساعت زودتر اطلاع دهید.",
      arrival: "لطفاً پنج دقیقه پیش از زمان نوبت در استودیو حضور داشته باشید.",
      privacy: "اطلاعات شما فقط برای هماهنگی و مدیریت نوبت استفاده می‌شود.",
    },
    contact: {
      infoTitle: "اطلاعات استودیو",
      socialLabel: "مشاهده صفحه اینستاگرام",
    },
  },
  booking: {
    requireStaffSelection: true,
    allowCustomerNotes: true,
    allowCancellation: true,
    allowRescheduling: true,
    minNoticeHours: 4,
    maxAdvanceDays: 30,
    allowAnyStaff: true,
    phoneValidation: "iranian",
    flow: {
      showServiceSelection: true,
      showStaffSelection: true,
      showDateSelection: true,
      showTimeSelection: true,
      showCustomerDetails: true,
      showReview: true,
      allowServiceSearch: true,
      allowCategoryNavigation: true,
    },
  },
  categories: [
    { id: "beauty", name: "خدمات زیبایی", slug: "beauty" },
    { id: "care", name: "مراقبت و مشاوره", slug: "care" },
  ],
  services: [
    {
      id: "univision-brow-design",
      categoryId: "beauty",
      name: "طراحی و اجرای نانوبروز",
      description:
        "طراحی اختصاصی ابرو و اجرای تارهای نانو با فرم متناسب با چهره و سبک طبیعی.",
      durationMinutes: 120,
      price: 4200000,
      isFeatured: true,
      isPopular: true,
      image: serviceImage,
      staffIds: ["univision-yasaman", "univision-nastaran"],
      includedItems: [
        "آنالیز فرم چهره و طراحی اختصاصی",
        "استفاده از تجهیزات استریل و یک‌بارمصرف",
        "ارائه مراقبت‌های پس از انجام خدمت",
      ],
    },
    {
      id: "univision-lip-blush",
      categoryId: "beauty",
      name: "لیپ بلش و شیدینگ لب",
      description:
        "ایجاد رنگی طبیعی و شاداب برای لب‌ها با تکنیک گرادیانت و اصلاح تناژ تیرگی.",
      durationMinutes: 100,
      price: 3600000,
      isPopular: true,
      image: lipImage,
      staffIds: ["univision-yasaman", "univision-mona"],
      includedItems: [
        "انتخاب رنگ متناسب با پوست",
        "طراحی فرم لب پیش از اجرا",
        "توضیحات کامل مراقبت پس از خدمت",
      ],
    },
    {
      id: "univision-consultation",
      categoryId: "care",
      name: "مشاوره تخصصی زیبایی",
      description:
        "جلسه مشاوره برای بررسی نیازهای شما، طراحی مسیر خدمات و پاسخ به پرسش‌های تخصصی.",
      durationMinutes: 30,
      price: 450000,
      image: detailImage,
      staffIds: ["univision-yasaman", "univision-nastaran", "univision-mona"],
    },
  ],
  staff: [
    {
      id: "univision-yasaman",
      name: "یاسمن رئیسی",
      role: "مدیر هنری و متخصص ارشد زیبایی",
      avatar: yasamanImage,
      bio: "متخصص طراحی طبیعی ابرو و خدمات زیبایی با تمرکز بر نتیجه ظریف و شخصی‌سازی‌شده.",
      experienceYears: 9,
      rating: 4.98,
      specialties: ["نانوبروز", "لیپ بلش", "طراحی چهره"],
      isAvailable: true,
    },
    {
      id: "univision-nastaran",
      name: "نسترن کمالی",
      role: "آرتیست ارشد آرایش دائم",
      avatar: womenFourImage,
      bio: "متخصص اجرای ظریف و طبیعی خدمات ابرو و طراحی فرم متناسب با چهره.",
      experienceYears: 6,
      rating: 4.92,
      specialties: ["نانوبروز", "طراحی ابرو", "مشاوره زیبایی"],
      isAvailable: true,
    },
    {
      id: "univision-mona",
      name: "مونا شایسته",
      role: "متخصص ترکیب رنگ و خدمات لب",
      avatar: womenOneImage,
      bio: "متخصص شیدینگ لب و ترکیب رنگ‌های طبیعی با رویکردی دقیق و شخصی‌سازی‌شده.",
      experienceYears: 5,
      rating: 4.9,
      specialties: ["لیپ بلش", "ترکیب رنگ", "مشاوره زیبایی"],
      isAvailable: true,
    },
  ],
  locations: [
    {
      id: "univision-shiraz",
      name: "Univision Studio",
      address: "شیراز، معالی‌آباد، ساختمان یونی‌ویژن، طبقه دوم",
      city: "شیراز",
      phone: "09120000000",
    },
  ],
  workingHours: {
    openTime: "10:00",
    closeTime: "20:00",
    workingDays: [0, 1, 2, 3, 4, 6],
    slotDurationMinutes: 60,
  },
};
