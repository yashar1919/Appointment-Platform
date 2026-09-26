import { toPersianDigits } from "./persianNumbers";
import { AvailableDay, TimeSlot } from "@/src/types/domain";

const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export function getJalaliDateParts(date: Date): {
  day: string;
  month: string;
  year: string;
  weekday: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const parts = formatter.formatToParts(date);
    let day = "";
    let month = "";
    let year = "";
    let weekday = "";

    for (const part of parts) {
      if (part.type === "day") day = part.value;
      if (part.type === "month") month = part.value;
      if (part.type === "year") year = part.value;
      if (part.type === "weekday") weekday = part.value;
    }

    return { day, month, year, weekday };
  } catch {
    // Fallback if Intl is unavailable
    const day = toPersianDigits(date.getDate());
    const month = JALALI_MONTH_NAMES[date.getMonth() % 12];
    const year = toPersianDigits(1405);
    const weekday = "شنبه";
    return { day, month, year, weekday };
  }
}

export function formatFullJalaliDate(dateString: string): string {
  const date = new Date(dateString);
  const { weekday, day, month, year } = getJalaliDateParts(date);
  return `${weekday} ${day} ${month} ${year}`;
}

export function formatShortJalaliDate(dateString: string): string {
  const date = new Date(dateString);
  const { weekday, day, month } = getJalaliDateParts(date);
  return `${weekday}، ${day} ${month}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${toPersianDigits(minutes)} دقیقه`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${toPersianDigits(hours)} ساعت`;
  }
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(remainingMinutes)} دقیقه`;
}

export function getNextDays(
  count: number = 14,
  blockedDays: number[] = [5],
): AvailableDay[] {
  // 5 in JS Date getDay() is Friday (جمعه) which is the Iranian weekend
  const days: AvailableDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const parts = getJalaliDateParts(d);
    const isFriday = d.getDay() === 5;
    const isBlocked = blockedDays.includes(d.getDay());

    days.push({
      dateString,
      dayOfWeekName: parts.weekday,
      dayNumber: parts.day,
      monthName: parts.month,
      isToday: i === 0,
      isAvailable: !isFriday && !isBlocked,
    });
  }

  return days;
}

export function generateDailyTimeSlots(): TimeSlot[] {
  return [
    {
      id: "10:00",
      time: toPersianDigits("10:00"),
      period: "morning",
      isAvailable: true,
    },
    {
      id: "11:00",
      time: toPersianDigits("11:00"),
      period: "morning",
      isAvailable: true,
    },
    {
      id: "12:00",
      time: toPersianDigits("12:00"),
      period: "morning",
      isAvailable: false,
    },
    {
      id: "13:00",
      time: toPersianDigits("13:00"),
      period: "morning",
      isAvailable: true,
    },
    {
      id: "15:00",
      time: toPersianDigits("15:00"),
      period: "afternoon",
      isAvailable: true,
    },
    {
      id: "16:00",
      time: toPersianDigits("16:00"),
      period: "afternoon",
      isAvailable: true,
    },
    {
      id: "17:00",
      time: toPersianDigits("17:00"),
      period: "afternoon",
      isAvailable: false,
    },
    {
      id: "18:00",
      time: toPersianDigits("18:00"),
      period: "evening",
      isAvailable: true,
    },
    {
      id: "19:00",
      time: toPersianDigits("19:00"),
      period: "evening",
      isAvailable: true,
    },
    {
      id: "20:00",
      time: toPersianDigits("20:00"),
      period: "evening",
      isAvailable: true,
    },
  ];
}
