export type OnboardingUser = {
  role?: string;
  /** Permission slugs of the user's role (e.g. "bookings.view"). */
  permissions?: string[];
  email_verified?: boolean;
  onboarding?: {
    status?: string;
  };
  organization?: {
    id?: string;
    name?: string;
    slug?: string;
    timezone?: string;
  };
  features?: {
    payments?: boolean;
  };
};

export type OnboardingStatus = {
  emailNeedsValidation: boolean;
  organizationNeedsValidation: boolean;
  paymentsNeedActivation: boolean;
  isComplete: boolean;
};

export function getOnboardingStatus(
  user: OnboardingUser | null,
): OnboardingStatus {
  const emailNeedsValidation = user?.email_verified === false;

  const organizationNeedsValidation =
    !emailNeedsValidation && user?.onboarding?.status !== "complete";

  const paymentsNeedActivation =
    !emailNeedsValidation &&
    !organizationNeedsValidation &&
    user?.role === "owner" &&
    user.organization !== undefined &&
    user.features?.payments !== true;

  return {
    emailNeedsValidation,
    organizationNeedsValidation,
    paymentsNeedActivation,
    isComplete:
      !emailNeedsValidation &&
      !organizationNeedsValidation &&
      !paymentsNeedActivation,
  };
}
