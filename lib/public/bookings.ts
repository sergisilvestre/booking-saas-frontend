import { apiClient } from "./client";

export interface CreateBookingPayload {
  eventTypeId: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  locale?: string;
  customer: {
    name: string;
    email: string;
    notes?: string | null;
  };
}

export interface Booking {
  id: string;
  organizationId?: string;
  eventTypeId?: string;
  customerId?: string;
  startAt?: string;
  endAt?: string;
  startsAt?: string;
  endsAt?: string;
  timezone?: string;
  status: string;
  source?: string;
  notes?: string | null;
  cancelledAt?: string | null;
  /** Set for paid event types: Stripe Checkout the customer must visit. */
  checkoutUrl?: string;
  /** Lets the guest view or cancel the booking from a link. */
  cancelToken?: string;
  completedAt?: string | null;
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<Booking> {
  const response = await apiClient.post<
    Booking | { booking: Booking; checkout_url: string }
  >("/api/public/bookings", {
    locale: payload.locale,
    event_type_id: payload.eventTypeId,
    starts_at: payload.startsAt,
    ends_at: payload.endsAt,
    timezone: payload.timezone,
    name: payload.customer.name,
    email: payload.customer.email,
    notes: payload.customer.notes ?? null,
  });

  const booking = "checkout_url" in response
    ? { ...response.booking, checkoutUrl: response.checkout_url }
    : response;

  return { ...booking, startsAt: booking.startAt, endsAt: booking.endAt };
}
