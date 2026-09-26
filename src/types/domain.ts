export type AppointmentStatus =
  | "confirmed"
  | "cancelled"
  | "completed"
  | "pending";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  slug?: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  image: string;
  active?: boolean;
  sortOrder?: number;
  staffIds?: string[];
  includedItems?: string[];
  careInstructions?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  experienceYears?: number;
  rating?: number;
  specialties?: string[];
  isAvailable?: boolean;
  active?: boolean;
  serviceIds?: string[];
}

export interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  directions?: string;
  phone?: string;
  workingHours?: WorkingHours;
}

export interface WorkingHours {
  openTime: string; // e.g. "10:00"
  closeTime: string; // e.g. "20:00"
  workingDays: number[]; // 0=Sunday, 6=Saturday (in Iranian calendar: Saturday=6, etc.)
  slotDurationMinutes: number; // e.g. 30 or 60
}

export type ThemePalette =
  | "gold"
  | "sky"
  | "amber"
  | "rose"
  | "teal"
  | "lime"
  | "indigo"
  | "violet"
  | "fuchsia";

export interface TenantTheme {
  palette: ThemePalette;
  fontFamily?: string;
}

export interface TenantBookingConfig {
  requireStaffSelection: boolean;
  allowCustomerNotes: boolean;
  allowCancellation: boolean;
  allowRescheduling: boolean;
  minNoticeHours: number;
  maxAdvanceDays: number;
  allowAnyStaff: boolean;
  flow?: BookingFlowDefinition;
  customerFields?: CustomerFieldConfig[];
}

export interface BookingFlowDefinition {
  showServiceSelection?: boolean;
  showStaffSelection?: boolean;
  showDateSelection?: boolean;
  showTimeSelection?: boolean;
  showCustomerDetails?: boolean;
  showReview?: boolean;
  allowServiceSearch?: boolean;
  allowCategoryNavigation?: boolean;
}

export type CustomerFieldName = "fullName" | "phone" | "email" | "notes";

export interface CustomerFieldConfig {
  name: CustomerFieldName;
  required: boolean;
  label?: string;
  helpText?: string;
  placeholder?: string;
}

export interface TenantLocalization {
  locale: string;
  timezone: string;
  currency: string;
  currencySymbol: string;
  direction: "rtl" | "ltr";
  phoneCountry?: string;
}

export interface TenantContent {
  hero?: {
    eyebrow?: string;
    ctaLabel?: string;
    availabilityLabel?: string;
  };
  labels?: {
    servicesTitle?: string;
    servicesDescription?: string;
    staffTitle?: string;
    staffDescription?: string;
    historyDescription?: string;
  };
  policies?: {
    payment?: string;
    cancellation?: string;
    arrival?: string;
    privacy?: string;
  };
  contact?: {
    infoTitle?: string;
    socialLabel?: string;
  };
}

export interface BusinessConfig {
  id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  logo: string;
  coverImage: string;
  phone: string;
  phoneDisplay: string;
  instagram?: string;
  telegram?: string;
  address: string;
  city: string;
  locale: string;
  timezone: string;
  currency: string;
  currencySymbol: string;
  rating: number;
  reviewsCount: number;

  theme: TenantTheme;
  booking: TenantBookingConfig;
  localization?: TenantLocalization;
  content?: TenantContent;

  categories: ServiceCategory[];
  services: Service[];
  staff: Staff[];
  locations: BusinessLocation[];
  workingHours: WorkingHours;
}

export interface Customer {
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g. "10:00"
  period: "morning" | "afternoon" | "evening";
  isAvailable: boolean;
}

export interface AvailableDay {
  dateString: string; // YYYY-MM-DD
  dayOfWeekName: string; // e.g. شنبه
  dayNumber: string; // e.g. ۲۸
  monthName: string; // e.g. شهریور
  isToday: boolean;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  referenceCode: string;
  tenantSlug: string;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  service: Service;
  staff?: Staff;
  date: string; // YYYY-MM-DD
  dateFormatted: string; // e.g. دوشنبه ۲۸ شهریور ۱۴۰۵
  timeSlot: string; // e.g. ۱۶:۳۰
  customer: Customer;
  createdAt: string;
  status: AppointmentStatus;
  totalPrice: number;
  currency: string;
}
