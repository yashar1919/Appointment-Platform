import { z } from "zod";

const IRANIAN_PHONE_REGEX = /^(?:0|\+98)?9\d{9}$/;
const INTERNATIONAL_PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export function createCustomerFormSchema(
  phoneValidation: "iranian" | "international" = "iranian",
) {
  return z.object({
    fullName: z
      .string()
      .min(3, {
        message:
          "لطفاً نام و نام خانوادگی خود را به صورت کامل (حداقل ۳ حرف) وارد کنید.",
      })
      .max(80, { message: "نام وارد شده طولانی‌تر از حد مجاز است." }),
    phone: z
      .string()
      .min(10, { message: "شماره موبایل الزامی است." })
      .refine(
        (val) => {
          // Normalize Persian/Arabic digits to Latin digits first
          const normalized = val
            .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
            .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
            .replace(/\s+/g, "")
            .replace(/-/g, "");
          return (
            phoneValidation === "international"
              ? INTERNATIONAL_PHONE_REGEX
              : IRANIAN_PHONE_REGEX
          ).test(normalized);
        },
        {
          message:
            phoneValidation === "international"
              ? "لطفاً یک شماره تلفن معتبر وارد فرمایید."
              : "لطفاً یک شماره موبایل معتبر (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.",
        },
      ),
    email: z
      .string()
      .email({ message: "فرمت آدرس ایمیل نامعتبر است." })
      .optional()
      .or(z.literal("")),
    notes: z
      .string()
      .max(500, { message: "توضیحات نمی‌تواند بیشتر از ۵۰۰ حرف باشد." })
      .optional(),
  });
}

export const customerFormSchema = createCustomerFormSchema();

export type CustomerFormData = z.infer<typeof customerFormSchema>;
