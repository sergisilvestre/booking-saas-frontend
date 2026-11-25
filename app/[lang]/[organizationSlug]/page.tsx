"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, MapPin } from "lucide-react";

import EventTypeStatus from "@/components/public/booking/EventTypeStatus";
import { isLocale } from "@/i18n/locales";

type PublicOrganization = {
  name: string;
  slug: string;
  timezone: string;
  acceptsBookings: boolean;
  eventTypes: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    durationMinutes: number;
    priceAmount: number;
    currency: string | null;
  }[];
};

const text = {
  ca: { services: "Serveis", book: "Reservar", minutes: "min", free: "Gratuït", none: "Encara no hi ha serveis disponibles.", closed: "Ara mateix aquest negoci no accepta reserves.", timezone: "Horaris en" },
  es: { services: "Servicios", book: "Reservar", minutes: "min", free: "Gratis", none: "Todavía no hay servicios disponibles.", closed: "Ahora mismo este negocio no acepta reservas.", timezone: "Horarios en" },
  en: { services: "Services", book: "Book", minutes: "min", free: "Free", none: "There are no services available yet.", closed: "This business is not taking bookings right now.", timezone: "Times in" },
};

/** Public page of an organization: its active services. */
export default function OrganizationPage() {
  const pathname = usePathname();
  const [lang, slug] = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const locale = isLocale(lang) ? lang : "en";
  const t = text[locale];

  const [state, setState] = useState<"loading" | "not-found" | "error" | PublicOrganization>("loading");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/organizations/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 404) return setState("not-found");
        if (!response.ok) throw new Error("Failed to load organization");
        setState((await response.json()) as PublicOrganization);
      })
      .catch(() => !cancelled && setState("error"));

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (typeof state === "string") return <EventTypeStatus status={state} />;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{state.name}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {t.timezone} {state.timezone}
        </p>

        {!state.acceptsBookings && (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{t.closed}</p>
        )}

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-500">{t.services}</h2>

        {state.eventTypes.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{t.none}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {state.eventTypes.map((eventType) => (
              <li key={eventType.id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{eventType.name}</p>
                  {eventType.description && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{eventType.description}</p>}
                  <p className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {eventType.durationMinutes} {t.minutes}
                    </span>
                    <span>
                      {eventType.priceAmount > 0
                        ? new Intl.NumberFormat(locale, { style: "currency", currency: eventType.currency || "EUR" }).format(eventType.priceAmount / 100)
                        : t.free}
                    </span>
                  </p>
                </div>
                {state.acceptsBookings && (
                  <Link
                    href={`/${locale}/${state.slug}/${eventType.slug}`}
                    className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    {t.book}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
