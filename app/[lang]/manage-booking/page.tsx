"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import EventTypeStatus from "@/components/public/booking/EventTypeStatus";
import { isLocale } from "@/i18n/locales";

type PublicBooking = {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  startAt: string;
  endAt: string;
  timezone: string;
  eventType: { name: string; slug: string } | null;
  organization: { name: string; slug: string } | null;
};

const text = {
  ca: { title: "La teva reserva", when: "Quan", status: "Estat", cancel: "Cancel·lar la reserva", confirm: "Segur que vols cancel·lar la reserva?", cancelled: "La reserva s'ha cancel·lat.", failed: "No s'ha pogut cancel·lar la reserva.", statuses: { pending: "Pendent", confirmed: "Confirmada", cancelled: "Cancel·lada", completed: "Completada" }, bookAgain: "Fer una altra reserva" },
  es: { title: "Tu reserva", when: "Cuándo", status: "Estado", cancel: "Cancelar la reserva", confirm: "¿Seguro que quieres cancelar la reserva?", cancelled: "La reserva se ha cancelado.", failed: "No se ha podido cancelar la reserva.", statuses: { pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada", completed: "Completada" }, bookAgain: "Hacer otra reserva" },
  en: { title: "Your booking", when: "When", status: "Status", cancel: "Cancel the booking", confirm: "Do you really want to cancel the booking?", cancelled: "The booking has been cancelled.", failed: "The booking could not be cancelled.", statuses: { pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled", completed: "Completed" }, bookAgain: "Make another booking" },
};

function ManageBooking() {
  const pathname = usePathname();
  const params = useSearchParams();
  const lang = pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(lang) ? lang : "en";
  const t = text[locale];
  const id = params.get("id") ?? "";
  const token = params.get("token") ?? "";

  const [booking, setBooking] = useState<PublicBooking | "loading" | "not-found">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      setBooking("not-found");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/bookings/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => setBooking(response.ok ? ((await response.json()) as PublicBooking) : "not-found"))
      .catch(() => setBooking("not-found"));
  }, [id, token]);

  async function cancel() {
    if (!window.confirm(t.confirm)) return;
    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/bookings/${encodeURIComponent(id)}/cancel`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(data?.message ?? t.failed);
        return;
      }

      setBooking(data as PublicBooking);
      setMessage(t.cancelled);
    } finally {
      setBusy(false);
    }
  }

  if (booking === "loading") return <EventTypeStatus status="loading" />;
  if (booking === "not-found") return <EventTypeStatus status="not-found" />;

  const date = new Date(booking.startAt.replace(" ", "T")).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const cancellable = booking.status === "pending" || booking.status === "confirmed";

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">{booking.organization?.name}</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">{t.title}</h1>
        <p className="mt-1 text-gray-700">{booking.eventType?.name}</p>

        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-gray-500">{t.when}</dt>
            <dd className="font-medium text-gray-900">
              {date}, {booking.startAt.slice(11, 16)}–{booking.endAt.slice(11, 16)} ({booking.timezone})
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{t.status}</dt>
            <dd className="font-medium text-gray-900">{t.statuses[booking.status]}</dd>
          </div>
        </dl>

        {message && <p className="mt-6 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700" role="status">{message}</p>}

        {cancellable && (
          <button
            type="button"
            onClick={cancel}
            disabled={busy}
            className="mt-8 w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {t.cancel}
          </button>
        )}

        {booking.organization && (
          <a href={`/${locale}/${booking.organization.slug}`} className="mt-4 block text-center text-sm text-gray-600 underline">
            {t.bookAgain}
          </a>
        )}
      </div>
    </main>
  );
}

export default function ManageBookingPage() {
  return (
    <Suspense fallback={<EventTypeStatus status="loading" />}>
      <ManageBooking />
    </Suspense>
  );
}
