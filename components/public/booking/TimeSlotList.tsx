'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Loader2 } from 'lucide-react';

import { getAvailability } from '@/lib/public/availability';

type Locale = 'ca' | 'es' | 'en';

export interface TimeSlot {
  startsAt: string;
  endsAt: string;
}

interface TimeSlotListProps {
  eventTypeId: string;
  date: string;
  locale: Locale;
  timezone?: string;
  onSelect?: (slot: TimeSlot) => void;
}

const translations = {
  ca: {
    title: 'Horaris disponibles',
    loading: 'Carregant horaris...',
    empty: 'No hi ha cap horari disponible per a aquesta data.',
    error: 'No s’han pogut carregar els horaris.',
    timezone: 'Zona horària',
  },

  es: {
    title: 'Horarios disponibles',
    loading: 'Cargando horarios...',
    empty: 'No hay horarios disponibles para esta fecha.',
    error: 'No se han podido cargar los horarios.',
    timezone: 'Zona horaria',
  },

  en: {
    title: 'Available times',
    loading: 'Loading times...',
    empty: 'There are no available times for this date.',
    error: 'Could not load available times.',
    timezone: 'Timezone',
  },
} as const;

export default function TimeSlotList({
  eventTypeId,
  date,
  locale,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  onSelect,
}: TimeSlotListProps) {
  const t = translations[locale];

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSlot, setSelectedSlot] =
    useState<TimeSlot | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setLoading(true);
      setError(false);
      setSlots([]);
      setSelectedSlot(null);

      try {
        const result = await getAvailability(
          eventTypeId,
          date,
          timezone,
        );

        if (!cancelled) {
          setSlots(result);
        }
      } catch (err) {
        console.error('Availability error:', err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [eventTypeId, date, timezone]);

  function handleSelect(slot: TimeSlot) {
    setSelectedSlot(slot);
    onSelect?.(slot);
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {t.title}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {format(parseISO(date), 'PPP')}
        </p>
      </div>

      {loading && (
        <div
          role="status"
          className="flex min-h-[180px] items-center justify-center"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2
              className="h-4 w-4 animate-spin"
              aria-hidden="true"
            />

            <span>{t.loading}</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {t.error}
        </div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div className="rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">
            {t.empty}
          </p>
        </div>
      )}

      {!loading && !error && slots.length > 0 && (  
        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {slots.map((slot) => {
            const selected =
              selectedSlot?.startsAt === slot.startsAt &&
              selectedSlot?.endsAt === slot.endsAt;

            return (
              <button
                key={`${slot.startsAt}-${slot.endsAt}`}
                type="button"
                onClick={() => handleSelect(slot)}
                className={`w-full rounded-lg border px-4 py-3 text-sm font-medium transition ${selected
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-900 hover:border-gray-900 hover:bg-gray-50'
                  }`}
              >
                {formatInTimeZone(
                  slot.startsAt,
                  timezone,
                  'HH:mm',
                )}
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        {t.timezone}: {timezone}
      </p>
    </div>
  );
}