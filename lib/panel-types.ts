/** Shapes returned by the API (backend/app/Modules/*\/Presentation). */

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Booking = {
  id: string;
  eventTypeId: string;
  customerId: string | null;
  /** Wall-clock time in the organization's timezone, "Y-m-d H:i:s". */
  startAt: string;
  endAt: string;
  timezone: string;
  status: BookingStatus;
  source: "public" | "internal";
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string | null;
  customer: { id: string; name: string; email: string; phone: string | null } | null;
  eventType: {
    id: string;
    name: string;
    slug: string;
    durationMinutes: number;
    priceAmount: number;
    currency: string | null;
  } | null;
  payment: { id: string; status: string; amount: number; currency: string } | null;
};

export type EventType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  minimumNoticeMinutes: number;
  maximumDaysInAdvance: number;
  priceAmount: number;
  currency: string | null;
  isActive: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string | null;
  bookingsCount?: number;
  lastBookingAt?: string | null;
  bookings?: Booking[];
};

export type AvailabilityRule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

export type AvailabilityException = {
  id: number | string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  eventTypeId: string | null;
};

export type Billing = {
  state: "trial" | "active" | "expired" | "inactive";
  hasAccess: boolean;
  onTrial: boolean;
  trialEndsAt: string | null;
  trialDaysLeft: number;
  plan: { id: string; slug: string; price: number; currency: string } | null;
  subscriptionId: string | null;
  source: "stripe" | "manual" | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canAcceptPayments: boolean;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: "owner" | "admin" | "member" | string;
  hasSignedIn: boolean;
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string | null;
  customer: { id: string; name: string; email: string } | null;
  bookingStartAt: string | null;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  legalName: string | null;
  taxId: string | null;
  businessType: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  trialEndsAt: string | null;
  stripeAccountId: string | null;
  stripeChargesEnabled: boolean;
  createdAt: string | null;
};
