import { notFound } from 'next/navigation';

import {
    getTranslations,
    type Locale,
} from '@/lib/public-i18n';
import AvailabilityCalendar from '@/components/public/booking/AvailabilityCalendar';

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

export default async function EventTypePage({
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
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                <div className="grid w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
                    <section className="border-b p-8 md:border-b-0 md:border-r md:p-10">
                        <p className="mb-3 text-sm font-medium text-gray-500">
                            {organizationSlug}
                        </p>

                        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                            {eventType.name}
                        </h1>

                        <p className="mt-3 text-sm text-gray-500">
                            {eventType.duration} {t.event.minutes}
                        </p>

                        {eventType.description && (
                            <p className="mt-8 whitespace-pre-line text-gray-600">
                                {eventType.description}
                            </p>
                        )}
                    </section>

                    <section className="p-8 md:p-10">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {t.event.selectDateTime}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {t.event.chooseTime}
                        </p>
                        <div className="mt-8">
                            <AvailabilityCalendar
                                eventTypeId={eventType.id}
                                locale={locale as Locale}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}