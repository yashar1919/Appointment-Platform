import {
  BookingFlowDefinition,
  BookingStep,
  BusinessConfig,
} from "@/src/types/domain";

export const isFlowStepEnabled = (
  flow: BookingFlowDefinition | undefined,
  step: BookingStep,
): boolean => {
  if (step === "service") return flow?.showServiceSelection !== false;
  if (step === "staff") return flow?.showStaffSelection !== false;
  if (step === "datetime") {
    return (
      flow?.showDateSelection !== false || flow?.showTimeSelection !== false
    );
  }
  if (step === "customer") return flow?.showCustomerDetails !== false;
  return flow?.showReview !== false;
};

export function getFirstBookingStep(tenant: BusinessConfig): BookingStep {
  const flow = tenant.booking.flow;
  const steps: BookingStep[] = [
    "service",
    "staff",
    "datetime",
    "customer",
    "review",
  ];
  return (
    steps.find((step) => {
      if (!isFlowStepEnabled(flow, step)) return false;
      if (step === "staff") {
        return tenant.booking.requireStaffSelection && tenant.staff.length > 0;
      }
      return true;
    }) || "review"
  );
}

export function getNextBookingStep(
  tenant: BusinessConfig,
  currentStep: BookingStep,
): BookingStep | null {
  const flow = tenant.booking.flow;
  const steps: BookingStep[] = [
    "service",
    "staff",
    "datetime",
    "customer",
    "review",
  ];
  const currentIndex = steps.indexOf(currentStep);

  for (let index = currentIndex + 1; index < steps.length; index += 1) {
    const step = steps[index];
    if (!isFlowStepEnabled(flow, step)) continue;
    if (
      step === "staff" &&
      (!tenant.booking.requireStaffSelection || tenant.staff.length === 0)
    ) {
      continue;
    }
    return step;
  }

  return null;
}
