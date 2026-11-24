'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';

import {
  getTranslations,
  type Locale,
} from '@/lib/public-i18n';
import EventTypeStatus from '@/components/public/booking/EventTypeStatus';
import { useEventType, usePublicRoute } from '@/lib/public/useEventType';

function formatGoogleDate(date: string) {
  return new Date(date)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

function ConfirmationPageContent() {
  const route = usePublicRoute();
  const state = useEventType(route?.eventTypeSlug);
  const searchParams = useSearchParams();
  const start = searchParams.get('start') ?? undefined;
  const end = searchParams.get('end') ?? undefined;
  const timezone = searchParams.get('timezone') ?? 'UTC';

  if (!route) {
    return <EventTypeStatus status="not-found" />;
  }

  if (state.status !== 'ready') {
    return <EventTypeStatus status={state.status} />;
  }

  const { locale, organizationSlug, eventTypeSlug } = route;
  const t = getTranslations(locale as Locale);
  const eventType = state.eventType;

  const googleCalendarUrl =
    start && end
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventType.name,
      )}&dates=${formatGoogleDate(start)}/${formatGoogleDate(
        end,
      )}&details=${encodeURIComponent(
        eventType.description ?? '',
      )}&ctz=${encodeURIComponent(timezone)}`
      : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              className="h-8 w-8 text-green-600"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900">
            {t.confirmation.title}
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-gray-600">
            {t.confirmation.description}
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-xl border border-gray-200 bg-gray-50 p-6 text-left">
            <p className="text-sm font-medium text-gray-500">
              {organizationSlug}
            </p>

            <h2 className="mt-2 text-lg font-semibold text-gray-900">
              {eventType.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {eventType.duration} {t.event.minutes}
            </p>

            {start && end && (
              <>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(start).toLocaleDateString(
                      locale,
                      {
                        dateStyle: 'long',
                      },
                    )}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(start).toLocaleTimeString(
                      locale,
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}{' '}
                    -{' '}
                    {new Date(end).toLocaleTimeString(
                      locale,
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Timezone
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {timezone}
                  </p>
                </div>
              </>
            )}
          </div>

          <p className="mt-8 text-sm text-gray-500">
            {t.confirmation.email}
          </p>

          {googleCalendarUrl && (
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full max-w-md items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
            >
              Añadir a Google Calendar
            </a>
          )}

          <Link
            href={`/${locale}/${organizationSlug}/${eventTypeSlug}`}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            {t.confirmation.bookAnother}
          </Link>
        </div>
      </div>
    </main>
  );
}
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<EventTypeStatus status="loading" />}>
      <ConfirmationPageContent />
    </Suspense>
  );
}
