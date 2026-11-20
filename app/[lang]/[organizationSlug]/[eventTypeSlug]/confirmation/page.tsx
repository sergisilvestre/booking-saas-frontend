import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { notFound } from 'next/navigation';

import {
  getTranslations,
  type Locale,
} from '@/lib/public-i18n';

interface EventType {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  slug: string;
}

interface PageProps {
  params: Promise<{
    lang: string;
    organizationSlug: string;
    eventTypeSlug: string;
  }>;
  searchParams: Promise<{
    start?: string;
    end?: string;
    timezone?: string;
  }>;
}

async function getEventType(
  eventTypeSlug: string,
): Promise<EventType | null> {
  const apiUrl = process.env.INTERNAL_API_URL;

  if (!apiUrl) {
    throw new Error('INTERNAL_API_URL is not configured');
  }

  const response = await fetch(
    `${apiUrl}/api/public/event-types/${encodeURIComponent(eventTypeSlug)}`,
    {
      cache: 'no-store',
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch event type');
  }

  return response.json();
}

function formatGoogleDate(date: string) {
  return new Date(date)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: PageProps) {
  const {
    lang: locale,
    organizationSlug,
    eventTypeSlug,
  } = await params;

  const {
    start,
    end,
    timezone = 'UTC',
  } = await searchParams;

  if (!['ca', 'es', 'en'].includes(locale)) {
    notFound();
  }

  const t = getTranslations(locale as Locale);

  const eventType = await getEventType(eventTypeSlug);

  if (!eventType) {
    notFound();
  }

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