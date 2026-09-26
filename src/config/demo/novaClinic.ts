import { BusinessConfig } from "@/src/types/domain";

const clinicImage =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80";
const doctorImage =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80";

export const novaClinicConfig: BusinessConfig = {
  id: "tenant-nova-clinic-03",
  slug: "nova-clinic",
  name: "Nova Clinic",
  headline: "Time to talk about your health",
  description:
    "A calm, appointment-first clinic experience for consultations and follow-up visits.",
  logo: clinicImage,
  coverImage: clinicImage,
  phone: "+44 20 7946 0280",
  phoneDisplay: "+44 20 7946 0280",
  address: "42 King Street, London",
  city: "London",
  locale: "en-GB",
  timezone: "Europe/London",
  currency: "GBP",
  currencySymbol: "£",
  rating: 4.7,
  reviewsCount: 89,
  theme: { palette: "teal", fontFamily: "Inter, sans-serif" },
  localization: {
    locale: "en-GB",
    timezone: "Europe/London",
    currency: "GBP",
    currencySymbol: "£",
    direction: "ltr",
    phoneCountry: "GB",
  },
  content: {
    hero: {
      eyebrow: "Consultations and follow-ups",
      ctaLabel: "Book an appointment",
      availabilityLabel: "Appointments available this week",
    },
    labels: {
      servicesTitle: "Choose an appointment type",
      servicesDescription:
        "Select the consultation that best matches your visit.",
      staffTitle: "Choose a clinician",
      staffDescription:
        "Select a clinician or request the earliest available appointment.",
      historyDescription: "Your appointments at Nova Clinic",
    },
    policies: {
      payment: "Payment is collected at the clinic after your visit.",
      cancellation:
        "Please contact the clinic at least 24 hours before changing an appointment.",
      arrival: "Bring any documents relevant to your appointment.",
      privacy: "Your details are used only to arrange this appointment.",
    },
    contact: { infoTitle: "Clinic details", socialLabel: "Visit our website" },
  },
  booking: {
    requireStaffSelection: false,
    allowCustomerNotes: true,
    allowCancellation: true,
    allowRescheduling: true,
    minNoticeHours: 24,
    maxAdvanceDays: 30,
    allowAnyStaff: true,
    flow: {
      showServiceSelection: true,
      showStaffSelection: false,
      showDateSelection: true,
      showTimeSelection: true,
      showCustomerDetails: true,
      showReview: true,
      allowServiceSearch: true,
      allowCategoryNavigation: false,
    },
  },
  categories: [
    { id: "consultations", name: "Consultations", slug: "consultations" },
    { id: "follow-up", name: "Follow-up", slug: "follow-up" },
  ],
  services: [
    {
      id: "general-consultation",
      slug: "general-consultation",
      categoryId: "consultations",
      name: "General Consultation",
      description:
        "A scheduled conversation to understand your appointment needs.",
      durationMinutes: 30,
      price: 75,
      image: clinicImage,
      active: true,
      isFeatured: true,
      staffIds: ["dr-lee", "dr-patel"],
    },
    {
      id: "skin-assessment",
      slug: "skin-assessment",
      categoryId: "consultations",
      name: "Skin Assessment",
      description:
        "A structured assessment and discussion of suitable next steps.",
      durationMinutes: 45,
      price: 110,
      image: doctorImage,
      active: true,
      staffIds: ["dr-patel"],
    },
    {
      id: "follow-up",
      slug: "follow-up",
      categoryId: "follow-up",
      name: "Follow-up Consultation",
      description: "A focused follow-up appointment for an existing care plan.",
      durationMinutes: 20,
      price: 50,
      image: doctorImage,
      active: true,
      staffIds: ["dr-lee", "dr-patel"],
    },
  ],
  staff: [
    {
      id: "dr-lee",
      name: "Dr. Morgan Lee",
      role: "Consulting Clinician",
      avatar: doctorImage,
      bio: "Provides clear, appointment-focused consultations.",
      rating: 4.8,
      experienceYears: 11,
      isAvailable: true,
      active: true,
      serviceIds: ["general-consultation", "follow-up"],
    },
    {
      id: "dr-patel",
      name: "Dr. Asha Patel",
      role: "Consulting Clinician",
      avatar: clinicImage,
      bio: "Offers structured consultations and skin assessments.",
      rating: 4.7,
      experienceYears: 9,
      isAvailable: true,
      active: true,
      serviceIds: ["general-consultation", "skin-assessment", "follow-up"],
    },
  ],
  locations: [
    {
      id: "nova-london",
      name: "King Street Clinic",
      address: "42 King Street, London",
      city: "London",
      phone: "+44 20 7946 0280",
    },
  ],
  workingHours: {
    openTime: "08:30",
    closeTime: "17:30",
    workingDays: [1, 2, 3, 4, 5],
    slotDurationMinutes: 30,
  },
};
