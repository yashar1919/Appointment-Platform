import { BusinessConfig } from "@/src/types/domain";
import logoImage from "@/src/assets/images/logo256x256-min.png";
import lipBlushImage from "@/src/assets/images/service_lip_blush_1790400872703.jpg";
import microbladingImage from "@/src/assets/images/service_microblading_1790400861725.jpg";
import eyelinerImage from "@/src/assets/images/service_permanent_eyeliner_1790400882769.jpg";
import yasamanImage from "@/src/assets/images/yasaman1.jpg";

export const yasamanRaesiConfig: BusinessConfig = {
  id: "tenant-yasaman-raesi-01",
  slug: "yasaman-raesi",
  name: "آکادمی تخصصی یاسمن رئیسی",
  headline: "زیبایی ماندگار، با ظرافتی طبیعی",
  description:
    "ما با به‌روزترین متدهای جهانی، چهره‌ای طبیعی و ماندگار برای شما خلق می‌کنیم.",
  logo: logoImage,
  coverImage: yasamanImage,
  phone: "09128777749",
  phoneDisplay: "۰۹۱۲ ۸۷۷ ۷۷۷۴۹",
  instagram: "yasamanraesi.beauty",
  telegram: "yasamanraesi",
  address:
    "شیراز، معالی آباد، بعد از خیابان پزشکان، ساختمان اوتانا 1، طبقه 2، واحد 201",
  city: "شیراز",
  locale: "fa-IR",
  timezone: "Asia/Tehran",
  currency: "تومان",
  currencySymbol: "تومان",
  rating: 4.95,
  reviewsCount: 384,

  theme: {
    palette: "gold",
  },

  booking: {
    requireStaffSelection: true,
    allowCustomerNotes: true,
    allowCancellation: true,
    allowRescheduling: true,
    minNoticeHours: 12,
    maxAdvanceDays: 30,
    allowAnyStaff: true,
  },

  categories: [
    { id: "all", name: "همه خدمات", slug: "all" },
    {
      id: "brows",
      name: "ابرو",
      slug: "brows",
      description: "میکروبلیدینگ، نانوبروز و فیبروز تار به تار",
    },
    {
      id: "lips",
      name: "لب",
      slug: "lips",
      description: "شیدینگ لب روسی و لیپ بلش مخملی",
    },
    {
      id: "eyes",
      name: "چشم",
      slug: "eyes",
      description: "بن مژه نامرئی و خط چشم مینیاتوری",
    },
    {
      id: "care",
      name: "ترمیم و ریموو",
      slug: "care",
      description: "اصلاح بد رنگی و خنثی‌سازی تخصصی",
    },
    {
      id: "consultation",
      name: "مشاوره",
      slug: "consultation",
      description: "طراحی آناتومیک و آنالیز هارمونی چهره",
    },
  ],

  services: [
    {
      id: "srv-microblading",
      categoryId: "brows",
      name: "میکروبلیدینگ فیبروز اختصاصی",
      description:
        "طراحی مویی و قرینه‌سازی متقارن ابرو با خطوط فوق‌العاده ظریف، متناسب با فرم استخوان‌بندی و چرخش طبیعی تارهای ابرو.",
      durationMinutes: 120,
      price: 4500000,
      isFeatured: true,
      isPopular: true,
      image: microbladingImage,
      includedItems: [
        "طراحی و متقارن‌سازی هندسی با کولیس دیجیتال",
        "استفاده از کیت یک‌بار مصرف استریل و اختصاصی",
        "پیگمنت فیبروز اصل بدون قرمزی و دگرگونی رنگ",
        "بی‌حسی موضعی بدون تغییر بافت پوست",
      ],
      careInstructions:
        "تا ۳ روز از شستشوی مستقیم با آب خودداری فرمایید و از بالم ترمیم‌کننده مخصوص آکادمی استفاده شود.",
    },
    {
      id: "srv-lip-blush",
      categoryId: "lips",
      name: "لیپ بلش و شیدینگ مخملی لب",
      description:
        "ایجاد رنگ طبیعی و شاداب، اصلاح تیرگی و فرم لب‌ها با تکنیک آبرنگی و گرادیانت ملایم بدون ایجاد خط دور غیرطبیعی.",
      durationMinutes: 100,
      price: 3800000,
      isFeatured: false,
      isPopular: true,
      image: lipBlushImage,
      includedItems: [
        "خنثی‌سازی اولیه پیگمنت تیرگی لب در صورت نیاز",
        "ترکیب رنگ سفارشی هماهنگ با ته‌رنگ پوست شما",
        "ماندگاری ۱۸ الی ۲۴ ماه با محوشدگی یکنواخت",
      ],
      careInstructions:
        "استفاده از ویتامین A چشمی روزی ۳ بار و پرهیز از نوشیدنی‌های خیلی داغ تا ۴۸ ساعت.",
    },
    {
      id: "srv-permanent-eyeliner",
      categoryId: "eyes",
      name: "بن مژه نامرئی و خط چشم مینیاتوری",
      description:
        "کاشت رنگ در بن مژه‌ها جهت ایجاد عمق، گیرایی و پرپشت نشان دادن مژه‌ها با مشکی‌ترین پیگمنت‌های آلمانی.",
      durationMinutes: 90,
      price: 3200000,
      isFeatured: false,
      isPopular: false,
      image: eyelinerImage,
      includedItems: [
        "قرینه‌سازی مینیاتوری و قرینه‌سازی زاویه چشم",
        "بدون پخش‌شدگی رنگ در بافت حساس پلک",
        "بی‌حسی پیشرفته بدون سوزش چشم",
      ],
    },
    {
      id: "srv-nanobrows",
      categoryId: "brows",
      name: "نانوبروز تلفیقی با دستگاه (Nano Brows)",
      description:
        "تکنیک پیشرفته و غیرتهاجمی با دستگاه نانو برای پوست‌های چرب با تارهای نانو بسیار سبک و دوام فوق‌العاده بالا.",
      durationMinutes: 130,
      price: 4800000,
      isFeatured: true,
      isPopular: false,
      image: microbladingImage,
      includedItems: [
        "مناسب انواع پوست مخصوصاً پوست‌های چرب و منافذدار",
        "بدون ایجاد اسکار و آسیب به ریشه تارهای موی طبیعی",
      ],
    },
    {
      id: "srv-tattoo-neutralize",
      categoryId: "care",
      name: "خنثی‌سازی و اصلاح بدرنگی تاتو قدیمی",
      description:
        "تبدیل پیگمنت‌های دودی، بنفش، خاکستری و قرمز تاتوهای قدیمی به تناژ نچرال و گرم پیش از طراحی مجدد.",
      durationMinutes: 75,
      price: 2600000,
      isFeatured: false,
      isPopular: false,
      image: lipBlushImage,
    },
    {
      id: "srv-face-consultation",
      categoryId: "consultation",
      name: "مشاوره اختصاصی و طراحی آزمایشی چهره",
      description:
        "۳۰ دقیقه جلسه حضوری جهت تست فرم‌های مناسب صورت، انتخاب پالت رنگ متناسب با پیگمنت طبیعی پوست و رفع سوالات.",
      durationMinutes: 30,
      price: 500000,
      isFeatured: false,
      isPopular: false,
      image: yasamanImage,
      includedItems: [
        "طراحی غیرماندگار موقت برای مشاهده نتیجه احتمالی",
        "هزینه در صورت انجام خدمت در فاکتور کسر می‌گردد",
      ],
    },
  ],

  staff: [
    {
      id: "staff-yasaman",
      name: "یاسمن رئیسی",
      role: "مستر رسمی آکادمی فی اروپا و بنیان‌گذار آکادمی",
      avatar: yasamanImage,
      bio: "بیش از ۹ سال سابقه تخصصی در زمینه میکروبلیدینگ و میکروپیگمنتیشن با بیش از ۶,۰۰۰ پیگمنت‌گذاری موفق در ایران و دبی.",
      experienceYears: 9,
      rating: 4.98,
      specialties: ["میکروبلیدینگ فیبروز", "نانوبروز تخصصی", "لیپ بلش مخملی"],
      isAvailable: true,
    },
    {
      id: "staff-nastaran",
      name: "نسترن کمالی",
      role: "آرتیست ارشد آرایش دائم و میکروپیگمنتیشن",
      avatar: microbladingImage,
      bio: "فارغ‌التحصیل آکادمی S-Brows، متخصص در پیاده‌سازی خطوط تار به تار فوق‌العاده ظریف و شیدینگ سایه‌ای.",
      experienceYears: 6,
      rating: 4.92,
      specialties: ["نانوبروز", "بن مژه مینیاتوری", "طراحی قرینه"],
      isAvailable: true,
    },
    {
      id: "staff-mona",
      name: "مونا شایسته",
      role: "متخصص شیدینگ و ترکیب رنگ ارگانیک لب",
      avatar: lipBlushImage,
      bio: "استاد ترکیب رنگ و خنثی‌سازی پیگمنت‌های دودی، طراح لب‌های آمبره طبیعی بدون کادربندی تیز.",
      experienceYears: 5,
      rating: 4.9,
      specialties: ["لیپ بلش روسی", "خنثی‌سازی تیره", "ترمیم فرم لب"],
      isAvailable: true,
    },
  ],

  locations: [
    {
      id: "loc-zaferanieh",
      name: "شعبه مرکزی معالی آباد",
      address:
        "شیراز، معالی آباد، بعد از خیابان پزشکان، ساختمان اوتانا 1، طبقه 2، واحد 201",
      city: "تهران",
      postalCode: "۱۹۸۸۶۱۴۳۲۱",
      directions:
        "دارای پارکینگ اختصاصی مشتریان و دسترسی آسان از طریق خیابان ولیعصر",
    },
  ],

  workingHours: {
    openTime: "10:00",
    closeTime: "20:00",
    workingDays: [0, 1, 2, 3, 4, 6], // All days except Friday (5)
    slotDurationMinutes: 60,
  },
};
