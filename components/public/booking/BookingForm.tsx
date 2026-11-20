'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createBooking,
  type Booking,
} from '@/lib/public/bookings';

type Locale = 'ca' | 'es' | 'en';

interface BookingFormProps {
  locale: Locale;
  eventTypeId: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  onSuccess: (booking: Booking) => void;
}

const translations = {
  ca: {
    name: 'Nom',
    namePlaceholder: 'El teu nom',
    email: 'Correu electrònic',
    emailPlaceholder: 'tu@exemple.com',
    notes: 'Notes',
    notesPlaceholder:
      'Afegeix qualsevol informació que vulguis compartir...',
    confirm: 'Confirmar reserva',
    submitting: 'Confirmant...',
    requiredName: 'El nom és obligatori',
    invalidEmail: 'Introdueix un correu electrònic vàlid',
    genericError:
      'No s’ha pogut completar la reserva. Torna-ho a provar.',
  },

  es: {
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    email: 'Correo electrónico',
    emailPlaceholder: 'tu@exemple.com',
    notes: 'Notas',
    notesPlaceholder:
      'Añade cualquier información que quieras compartir...',
    confirm: 'Confirmar reserva',
    submitting: 'Confirmando...',
    requiredName: 'El nombre es obligatorio',
    invalidEmail: 'Introduce un correo electrónico válido',
    genericError:
      'No se ha podido completar la reserva. Inténtalo de nuevo.',
  },

  en: {
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    notes: 'Notes',
    notesPlaceholder:
      'Add any information you would like to share...',
    confirm: 'Confirm booking',
    submitting: 'Confirming...',
    requiredName: 'Name is required',
    invalidEmail: 'Enter a valid email address',
    genericError:
      'The booking could not be completed. Please try again.',
  },
} as const;

function createBookingSchema(locale: Locale) {
  const t = translations[locale];

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t.requiredName),

    email: z
      .string()
      .trim()
      .email(t.invalidEmail),

    notes: z
      .string()
      .trim()
      .optional(),
  });
}

type BookingFormData = z.infer<
  ReturnType<typeof createBookingSchema>
>;

export default function BookingForm({
  locale,
  eventTypeId,
  startsAt,
  endsAt,
  timezone,
  onSuccess,
}: BookingFormProps) {
  const t = translations[locale];
  const [serverError, setServerError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(
      createBookingSchema(locale),
    ),
    defaultValues: {
      name: '',
      email: '',
      notes: '',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setServerError(null);

    try {
      const booking = await createBooking({
        eventTypeId,
        startsAt,
        endsAt,
        timezone,
        locale,
        customer: {
          name: data.name,
          email: data.email,
          notes: data.notes || null,
        },
      });

      if (booking.checkoutUrl) {
        window.location.assign(booking.checkoutUrl);
        return;
      }

      onSuccess(booking);

    } catch (error) {
      console.error('Booking error:', error);
      setServerError(t.genericError);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {t.name}
        </label>

        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register('name')}
          placeholder={t.namePlaceholder}
          aria-invalid={!!errors.name}
          className={[
            'mt-2 block w-full rounded-lg border px-4 py-3 text-sm',
            'outline-none transition',
            'focus:border-gray-900 focus:ring-1 focus:ring-gray-900',
            errors.name
              ? 'border-red-500'
              : 'border-gray-300',
          ].join(' ')}
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          {t.email}
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          placeholder={t.emailPlaceholder}
          aria-invalid={!!errors.email}
          className={[
            'mt-2 block w-full rounded-lg border px-4 py-3 text-sm',
            'outline-none transition',
            'focus:border-gray-900 focus:ring-1 focus:ring-gray-900',
            errors.email
              ? 'border-red-500'
              : 'border-gray-300',
          ].join(' ')}
        />

        {errors.email && (
          <p className="mt-2 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          {t.notes}
        </label>

        <textarea
          id="notes"
          rows={4}
          {...register('notes')}
          placeholder={t.notesPlaceholder}
          className="mt-2 block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t.submitting : t.confirm}
      </button>
    </form>
  );
}