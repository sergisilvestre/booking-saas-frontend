'use client';

import { useMemo, useState } from 'react';
import {
    addDays,
    addMonths,
    endOfMonth,
    format,
    isBefore,
    isSameDay,
    isSameMonth,
    startOfMonth,
    subMonths,
} from 'date-fns';
import { ca, enUS, es } from 'date-fns/locale';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import TimeSlotList from './TimeSlotList';
import BookingForm from './BookingForm';

type Locale = 'ca' | 'es' | 'en';

interface AvailabilityCalendarProps {
    eventTypeId: string;
    locale: Locale;
}

interface TimeSlot {
    startsAt: string;
    endsAt: string;
}

interface BookingResponse {
    id: string;
    status: string;
    eventTypeId?: string;
    startsAt?: string;
    endsAt?: string;
    timezone?: string;
}

const dateLocales = {
    ca,
    es,
    en: enUS,
};

const translations = {
    ca: {
        confirmed: 'Reserva confirmada',
        bookingId: 'ID de reserva',
        date: 'Data',
        time: 'Hora',
        timezone: 'Zona horària',
        status: 'Estat',
        confirmedStatus: 'Confirmada',
        newBooking: 'Fer una nova reserva',
        addToCalendar: 'Afegir al calendari',
        googleCalendar: 'Google Calendar',
        outlookCalendar: 'Outlook Calendar',
    },

    es: {
        confirmed: 'Reserva confirmada',
        bookingId: 'ID de reserva',
        date: 'Fecha',
        time: 'Hora',
        timezone: 'Zona horaria',
        status: 'Estado',
        confirmedStatus: 'Confirmada',
        newBooking: 'Hacer otra reserva',
        addToCalendar: 'Añadir al calendario',
        googleCalendar: 'Google Calendar',
        outlookCalendar: 'Outlook Calendar',
    },

    en: {
        confirmed: 'Booking confirmed',
        bookingId: 'Booking ID',
        date: 'Date',
        time: 'Time',
        timezone: 'Timezone',
        status: 'Status',
        confirmedStatus: 'Confirmed',
        newBooking: 'Make another booking',
        addToCalendar: 'Add to calendar',
        googleCalendar: 'Google Calendar',
        outlookCalendar: 'Outlook Calendar',
    },
} as const;

export default function AvailabilityCalendar({
    eventTypeId,
    locale,
}: AvailabilityCalendarProps) {
    const t = translations[locale];

    const [currentMonth, setCurrentMonth] = useState(
        startOfMonth(new Date()),
    );

    const [selectedDate, setSelectedDate] =
        useState<Date | null>(null);

    const [selectedSlot, setSelectedSlot] =
        useState<TimeSlot | null>(null);

    const [confirmedBooking, setConfirmedBooking] =
        useState<BookingResponse | null>(null);

    const timezone = 'Europe/Madrid';

    const today = new Date();

    const days = useMemo(() => {
        const start = startOfMonth(currentMonth);

        const firstDay = start.getDay();

        const mondayOffset =
            firstDay === 0 ? 6 : firstDay - 1;

        const calendarStart = addDays(
            start,
            -mondayOffset,
        );

        return Array.from(
            { length: 42 },
            (_, index) =>
                addDays(calendarStart, index),
        );
    }, [currentMonth]);

    const translatedWeekDays = {
        ca: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
        es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    };

    const monthLabel = format(
        currentMonth,
        'LLLL yyyy',
        {
            locale: dateLocales[locale],
        },
    );

    const goToPreviousMonth = () => {
        const previousMonth = subMonths(
            currentMonth,
            1,
        );

        if (
            isBefore(
                endOfMonth(previousMonth),
                startOfMonth(today),
            )
        ) {
            return;
        }

        setCurrentMonth(previousMonth);
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            addMonths(currentMonth, 1),
        );
    };

    const handleDateSelect = (date: Date) => {
        if (
            isBefore(date, today) &&
            !isSameDay(date, today)
        ) {
            return;
        }

        setSelectedDate(date);
        setSelectedSlot(null);
        setConfirmedBooking(null);
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        setSelectedSlot(slot);
        setConfirmedBooking(null);
    };

    const handleBookingSuccess = (
        booking: BookingResponse,
    ) => {
        setConfirmedBooking(booking);
    };

    const handleNewBooking = () => {
        setConfirmedBooking(null);
        setSelectedSlot(null);
        setSelectedDate(null);
    };

    /**
     * Generate Google Calendar URL.
     *
     * Google expects dates in UTC in the format:
     * YYYYMMDDTHHmmssZ
     */
    const createGoogleCalendarUrl = (
        startsAt: string,
        endsAt: string,
    ) => {
        const start = new Date(startsAt);
        const end = new Date(endsAt);

        const formatGoogleDate = (date: Date) =>
            date
                .toISOString()
                .replace(/[-:]/g, '')
                .replace(/\.\d{3}/, '');

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: '30 Minute Consultation',
            dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
            details: `Booking ID: ${confirmedBooking?.id ?? ''}`,
            location: '',
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    /**
     * Generate Outlook Calendar URL.
     */
    const createOutlookCalendarUrl = (
        startsAt: string,
        endsAt: string,
    ) => {
        const start = new Date(startsAt);
        const end = new Date(endsAt);

        const params = new URLSearchParams({
            path: '/calendar/action/compose',
            rru: 'addevent',
            subject: '30 Minute Consultation',
            startdt: start.toISOString(),
            enddt: end.toISOString(),
            body: `Booking ID: ${confirmedBooking?.id ?? ''}`,
        });

        return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
    };

    if (confirmedBooking) {
        const startsAt =
            confirmedBooking.startsAt ??
            selectedSlot?.startsAt;

        const endsAt =
            confirmedBooking.endsAt ??
            selectedSlot?.endsAt;

        return (
            <div className="w-full">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-6">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                            ✓
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900">
                            {t.confirmed}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500">
                                {t.bookingId}
                            </p>

                            <p className="mt-1 break-all text-sm font-medium text-gray-900">
                                {confirmedBooking.id}
                            </p>
                        </div>

                        {selectedDate && (
                            <div>
                                <p className="text-xs text-gray-500">
                                    {t.date}
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {format(
                                        selectedDate,
                                        'PPP',
                                        {
                                            locale:
                                                dateLocales[
                                                    locale
                                                ],
                                        },
                                    )}
                                </p>
                            </div>
                        )}

                        {startsAt && endsAt && (
                            <div>
                                <p className="text-xs text-gray-500">
                                    {t.time}
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {format(
                                        new Date(startsAt),
                                        'HH:mm',
                                    )}{' '}
                                    -{' '}
                                    {format(
                                        new Date(endsAt),
                                        'HH:mm',
                                    )}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-gray-500">
                                {t.timezone}
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {confirmedBooking.timezone ??
                                    timezone}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                {t.status}
                            </p>

                            <p className="mt-1 text-sm font-medium text-green-700">
                                {confirmedBooking.status ||
                                    t.confirmedStatus}
                            </p>
                        </div>
                    </div>

                    {startsAt && endsAt && (
                        <div className="mt-8 border-t pt-8">
                            <p className="mb-3 text-sm font-medium text-gray-900">
                                {t.addToCalendar}
                            </p>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <a
                                    href={createGoogleCalendarUrl(
                                        startsAt,
                                        endsAt,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
                                >
                                    <Calendar
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />

                                    {t.googleCalendar}
                                </a>

                                <a
                                    href={createOutlookCalendarUrl(
                                        startsAt,
                                        endsAt,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
                                >
                                    <Calendar
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />

                                    {t.outlookCalendar}
                                </a>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleNewBooking}
                        className="mt-8 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        {t.newBooking}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-gray-100"
                        aria-label={
                            locale === 'ca'
                                ? 'Mes anterior'
                                : locale === 'es'
                                    ? 'Mes anterior'
                                    : 'Previous month'
                        }
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <h2 className="text-base font-semibold capitalize text-gray-900">
                        {monthLabel}
                    </h2>

                    <button
                        type="button"
                        onClick={goToNextMonth}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-gray-100"
                        aria-label={
                            locale === 'ca'
                                ? 'Mes següent'
                                : locale === 'es'
                                    ? 'Mes siguiente'
                                    : 'Next month'
                        }
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-2 grid grid-cols-7">
                    {translatedWeekDays[locale].map(
                        (day) => (
                            <div
                                key={day}
                                className="py-2 text-center text-xs font-medium text-gray-400"
                            >
                                {day}
                            </div>
                        ),
                    )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((date) => {
                        const isCurrentMonth =
                            isSameMonth(
                                date,
                                currentMonth,
                            );

                        const isToday =
                            isSameDay(date, today);

                        const isSelected =
                            selectedDate !== null &&
                            isSameDay(
                                date,
                                selectedDate,
                            );

                        const isPast =
                            isBefore(date, today) &&
                            !isToday;

                        return (
                            <button
                                key={date.toISOString()}
                                type="button"
                                disabled={isPast}
                                onClick={() =>
                                    handleDateSelect(date)
                                }
                                data-testid={`calendar-day-${format(
                                    date,
                                    'yyyy-MM-dd',
                                )}`}
                                aria-label={format(
                                    date,
                                    'd MMMM yyyy',
                                    {
                                        locale:
                                            dateLocales[
                                                locale
                                            ],
                                    },
                                )}
                                className={[
                                    'relative flex aspect-square items-center justify-center rounded-full text-sm transition',
                                    !isCurrentMonth
                                        ? 'text-gray-300'
                                        : 'text-gray-900',
                                    isPast
                                        ? 'cursor-not-allowed text-gray-300'
                                        : 'hover:bg-gray-100',
                                    isSelected
                                        ? 'bg-gray-900 font-semibold text-white hover:bg-gray-900'
                                        : '',
                                    isToday &&
                                        !isSelected
                                        ? 'font-semibold ring-1 ring-gray-900'
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                {format(date, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedDate &&
                !selectedSlot &&
                !confirmedBooking && (
                    <div className="mt-8 border-t pt-8">
                        <TimeSlotList
                            eventTypeId={eventTypeId}
                            date={format(
                                selectedDate,
                                'yyyy-MM-dd',
                            )}
                            locale={locale}
                            timezone={timezone}
                            onSelect={handleSlotSelect}
                        />
                    </div>
                )}

            {selectedSlot && !confirmedBooking && (
                <div className="mt-8 border-t pt-8">
                    <BookingForm
                        locale={locale}
                        eventTypeId={eventTypeId}
                        startsAt={selectedSlot.startsAt}
                        endsAt={selectedSlot.endsAt}
                        timezone={timezone}
                        onSuccess={handleBookingSuccess}
                    />
                </div>
            )}
        </div>
    );
}