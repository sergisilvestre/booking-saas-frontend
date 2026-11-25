'use client';

import AvailabilityCalendar from '@/components/public/booking/AvailabilityCalendar';

import {
  getTranslations,
  type Locale,
} from '@/lib/public-i18n';
import EventTypeStatus from '@/components/public/booking/EventTypeStatus';
import { useEventType, usePublicRoute } from '@/lib/public/useEventType';

export default function EventTypePage() {
  const route = usePublicRoute();
  const state = useEventType(route?.eventTypeSlug, route?.organizationSlug);

  if (!route) {
    return <EventTypeStatus status="not-found" />;
  }

  if (state.status !== 'ready') {
    return <EventTypeStatus status={state.status} />;
  }

  const { locale, organizationSlug, eventTypeSlug } = route;
  const t = getTranslations(locale as Locale);
  const eventType = state.eventType;

  return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
                <div className="grid w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
                    <section className="border-b p-8 md:border-b-0 md:border-r md:p-10">
                        <p className="mb-3 text-sm font-medium text-gray-500">
                            {eventType.organization?.name ?? organizationSlug}
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
                                timezone={eventType.organization?.timezone}
                                eventName={eventType.name}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}