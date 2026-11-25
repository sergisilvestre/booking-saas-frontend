"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { isLocale, type AppLocale } from "@/i18n/locales";

export interface PublicEventType {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  slug: string;
  priceAmount?: number;
  currency?: string | null;
  organization?: {
    id: string;
    name: string;
    slug: string;
    timezone: string;
    acceptsBookings: boolean;
  };
}

export type PublicRoute = {
  locale: AppLocale;
  organizationSlug: string;
  eventTypeSlug: string;
};

/**
 * Reads /{lang}/{organizationSlug}/{eventTypeSlug} from the browser URL.
 * The static export ships these pages once with "_" placeholders (public/.htaccess
 * serves them for every real slug), so the route params cannot be used here.
 */
export function usePublicRoute(): PublicRoute | null {
  const pathname = usePathname();
  const [lang, organizationSlug, eventTypeSlug] = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (!isLocale(lang) || !organizationSlug || !eventTypeSlug) {
    return null;
  }

  return { locale: lang, organizationSlug, eventTypeSlug };
}

type State =
  | { status: "loading" }
  | { status: "ready"; eventType: PublicEventType }
  | { status: "not-found" }
  | { status: "error" };

/** Loads a public event type of an organization from the API (in the browser). */
export function useEventType(
  eventTypeSlug: string | undefined,
  organizationSlug?: string,
): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!eventTypeSlug) return;

    let cancelled = false;

    fetch(
      organizationSlug
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/public/organizations/${encodeURIComponent(organizationSlug)}/event-types/${encodeURIComponent(eventTypeSlug)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/public/event-types/${encodeURIComponent(eventTypeSlug)}`,
      { headers: { Accept: "application/json" } },
    )
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 404) return setState({ status: "not-found" });
        if (!response.ok) throw new Error("Failed to fetch event type");
        setState({ status: "ready", eventType: (await response.json()) as PublicEventType });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [eventTypeSlug, organizationSlug]);

  return eventTypeSlug ? state : { status: "not-found" };
}
