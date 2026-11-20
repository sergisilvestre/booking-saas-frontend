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

export default async function BookingPage({
  params,
}: PageProps) {
  const {
    lang: locale,
    organizationSlug,
    eventTypeSlug,
  } = await params;

  if (!['ca', 'es', 'en'].includes(locale)) {
    notFound();
  }

  const t = getTranslations(locale as Locale);

  const eventType = await getEventType(eventTypeSlug);

  if (!eventType) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-[320px_1fr]">
          {/* Event summary */}
          <aside className="border-b p-8 md:border-b-0 md:border-r md:p-10">
            <p className="text-sm font-medium text-gray-500">
              {organizationSlug}
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
              {eventType.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {eventType.duration} {t.event.minutes}
            </p>

            {eventType.description && (
              <p className="mt-6 whitespace-pre-line text-sm leading-6 text-gray-600">
                {eventType.description}
              </p>
            )}
          </aside>

          {/* Booking form */}
          <section className="p-8 md:p-10">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.booking.title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {t.booking.subtitle}
            </p>

            <form className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.booking.name}
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  placeholder={t.booking.namePlaceholder}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.booking.email}
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  placeholder={t.booking.emailPlaceholder}
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.booking.notes}
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="mt-2 block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  placeholder={t.booking.notesPlaceholder}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                {t.booking.confirm}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}