import { z } from "zod";

// Iranian mobile phone regex: 09 followed by 9 digits
const IRANIAN_PHONE_REGEX = /^(?:0|\+98)?9\d{9}$/;

export const customerFormSchema = z.object({
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
        return IRANIAN_PHONE_REGEX.test(normalized);
      },
      {
        message:
          "لطفاً یک شماره موبایل معتبر (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.",
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

export type CustomerFormData = z.infer<typeof customerFormSchema>;
