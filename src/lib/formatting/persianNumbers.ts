const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(
  value: string | number | undefined | null,
): string {
  if (value === undefined || value === null) return "";
  return String(value).replace(
    /[0-9]/g,
    (digit) => PERSIAN_DIGITS[parseInt(digit, 10)],
  );
}

export function formatPersianNumber(value: number): string {
  return toPersianDigits(value.toLocaleString("en-US"));
}

export function formatPhoneNumber(phone: string): string {
  // Format as e.g. ۰۹۱۲ ۳۴۵ ۶۷۸۹
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("09")) {
    const part1 = cleaned.substring(0, 4);
    const part2 = cleaned.substring(4, 7);
    const part3 = cleaned.substring(7, 11);
    return toPersianDigits(`${part1} ${part2} ${part3}`);
  }
  return toPersianDigits(phone);
}
