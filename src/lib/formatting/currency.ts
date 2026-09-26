import { formatPersianNumber } from "./persianNumbers";

export function formatCurrency(
  amount: number,
  currency: string = "تومان",
): string {
  const formattedNumber = formatPersianNumber(amount);
  return `${formattedNumber} ${currency}`;
}
