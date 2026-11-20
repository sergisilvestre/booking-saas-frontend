'use client';

import Link from 'next/link';
import { CheckCircle2, CalendarDays, Clock3, Mail } from 'lucide-react';

type Locale = 'ca' | 'es' | 'en';

interface BookingConfirmationProps {
  locale: Locale;
  organizationSlug: string;
  eventTypeSlug: string;
  eventTypeName: string;
  date: string;
  time: string;
  duration: number;
  customerEmail: string;
  timezone: string;
}

const translations = {
  ca: {
    confirmed: 'Reserva confirmada',
    description: 'La teva reserva s’ha confirmat correctament.',
    event: 'Esdeveniment',
    date: 'Data',
    time: 'Hora',
    duration: 'Durada',
    email: 'Correu electrònic',
    timezone: 'Zona horària',
    emailSent:
      'T’hem enviat un correu electrònic amb els detalls de la reserva.',
    bookAnother: 'Fer una altra reserva',
  },

  es: {
    confirmed: 'Reserva confirmada',
    description: 'Tu reserva se ha confirmado correctamente.',
    event: 'Evento',
    date: 'Fecha',
    time: 'Hora',
    duration: 'Duración',
    email: 'Correo electrónico',
    timezone: 'Zona horaria',
    emailSent:
      'Te hemos enviado un correo electrónico con los detalles de la reserva.',
    bookAnother: 'Hacer otra reserva',
  },

  en: {
    confirmed: 'Booking confirmed',
    description: 'Your booking has been successfully confirmed.',
    event: 'Event',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    email: 'Email',
    timezone: 'Timezone',
    emailSent:
      'We have sent you an email with your booking details.',
    bookAnother: 'Book another appointment',
  },
} as const;

export default function BookingConfirmation({
  locale,
  organizationSlug,
  eventTypeSlug,
  eventTypeName,
  date,
  time,
  duration,
  customerEmail,
  timezone,
}: BookingConfirmationProps) {
  const t = translations[locale];

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Success */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2
            className="h-9 w-9 text-green-600"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900">
          {t.confirmed}
        </h1>

        <p className="mt-3 text-gray-600">
          {t.description}
        </p>
      </div>

      {/* Booking details */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t.event}
          </p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            {eventTypeName}
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          <DetailRow
            icon={<CalendarDays className="h-5 w-5" />}
            label={t.date}
            value={date}
          />

          <DetailRow
            icon={<Clock3 className="h-5 w-5" />}
            label={t.time}
            value={`${time} · ${duration} min`}
          />

          <DetailRow
            icon={<Clock3 className="h-5 w-5" />}
            label={t.timezone}
            value={timezone}
          />

          <DetailRow
            icon={<Mail className="h-5 w-5" />}
            label={t.email}
            value={customerEmail}
          />
        </div>
      </div>

      {/* Email notification */}
      <div className="mt-6 rounded-xl bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-600">
          {t.emailSent}
        </p>
      </div>

      {/* Book again */}
      <div className="mt-8 text-center">
        <Link
          href={`/${locale}/${organizationSlug}/${eventTypeSlug}`}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          {t.bookAnother}
        </Link>
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({
  icon,
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}