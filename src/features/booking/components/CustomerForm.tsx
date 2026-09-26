import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, Mail, FileText, ShieldAlert } from "lucide-react";
import { customerFormSchema, CustomerFormData } from "../schemas/bookingSchema";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Customer } from "@/src/types/domain";

interface CustomerFormProps {
  initialData?: Customer | null;
  onSubmitCustomer: (customer: Customer) => void;
  onBack: () => void;
}

export function CustomerForm({
  initialData,
  onSubmitCustomer,
  onBack,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      notes: initialData?.notes || "",
    },
  });

  const onSubmit = (data: CustomerFormData) => {
    onSubmitCustomer({
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-right">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[#f7f4ed]">
          مشخصات تماس و رزرو
        </h2>
        <p className="text-xs sm:text-sm text-[#a09a8e]">
          پیامک تایید نوبت، آدرس دقیق آکادمی و توصیه‌های قبل از مراجعه به این
          شماره ارسال خواهد شد.
        </p>
      </div>

      <div className="space-y-4 bg-[#14161c] p-4 sm:p-6 rounded-2xl border border-[#2d313b]">
        {/* Full Name */}
        <div className="space-y-1">
          <Input
            label="نام و نام خانوادگی"
            required
            placeholder="مثال: سارا محمدی"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>

        {/* Mobile Phone */}
        <div className="space-y-1">
          <Input
            label="شماره تلفن همراه (جهت دریافت پیامک تایید)"
            required
            type="tel"
            dir="ltr"
            placeholder="09121234567"
            className="text-left font-mono"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        {/* Email (Optional) */}
        <div className="space-y-1">
          <Input
            label="آدرس ایمیل (اختیاری)"
            type="email"
            dir="ltr"
            placeholder="name@example.com"
            className="text-left"
            error={errors.email?.message}
            helperText="جهت دریافت فاکتور رسمی و فایل نکات مراقبتی"
            {...register("email")}
          />
        </div>

        {/* Notes (Optional) */}
        <div className="space-y-1">
          <Textarea
            label="توضیحات، سابقه تاتو یا داروی خاص (اختیاری)"
            rows={3}
            placeholder="در صورت داشتن تاتوی قدیمی، حساسیت پوستی، بارداری یا مصرف داروهای خاص، لطفاً اینجا یادداشت فرمایید."
            error={errors.notes?.message}
            {...register("notes")}
          />
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1b1e28] text-xs text-[#a09a8e]">
          <ShieldAlert className="w-4 h-4 text-[#cbb38d] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            اطلاعات شما کاملاً محرمانه بوده و تنها برای هماهنگی و مشاوره نوبت
            استفاده خواهد شد.
          </p>
        </div>
      </div>

      {/* Navigation actions */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 px-5 py-2.5 rounded-xl border border-[#2d313b] hover:bg-[#21242c] text-xs sm:text-sm font-medium text-[#ded8cb] transition-colors cursor-pointer"
        >
          مرحله قبل (زمان)
        </button>

        <button
          type="submit"
          className="min-h-12 px-7 py-2.5 rounded-xl bg-[#cbb38d] hover:bg-[#ddc5a2] text-xs sm:text-sm font-bold text-[#0b0c0f] transition-all shadow-[0_4px_16px_rgba(203,179,141,0.25)] cursor-pointer"
        >
          بررسی و تایید نهایی
        </button>
      </div>
    </form>
  );
}
