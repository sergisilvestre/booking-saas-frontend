'use client';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';

import {
  ca,
  enUS,
  es,
} from 'date-fns/locale';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type SupportedLocale = 'ca' | 'es' | 'en';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  locale?: SupportedLocale;
}

export default function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  locale = 'en',
}: CalendarProps) {
  const currentMonth = value ?? new Date();

  const dateFnsLocale = {
    ca,
    es,
    en: enUS,
  }[locale];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: 1,
  });

  const calendarEnd = endOfWeek(monthEnd, {
    weekStartsOn: 1,
  });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = {
    ca: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
    es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  }[locale];

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) {
      return true;
    }

    if (maxDate && date > maxDate) {
      return true;
    }

    return disabledDates.some((disabledDate) =>
      isSameDay(date, disabledDate),
    );
  };

  const previousMonth = () => {
    const previous = subMonths(currentMonth, 1);

    if (
      minDate &&
      endOfMonth(previous) < minDate
    ) {
      return;
    }

    onChange?.(previous);
  };

  const nextMonth = () => {
    const next = addMonths(currentMonth, 1);

    if (
      maxDate &&
      startOfMonth(next) > maxDate
    ) {
      return;
    }

    onChange?.(next);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={previousMonth}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
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
          {format(currentMonth, 'MMMM yyyy', {
            locale: dateFnsLocale,
          })}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
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
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const disabled = isDisabled(day);
          const selected = value
            ? isSameDay(day, value)
            : false;

          const today = isToday(day);

          const currentMonthDay = isSameMonth(
            day,
            currentMonth,
          );

          const dateTestId = `calendar-day-${format(
            day,
            'yyyy-MM-dd',
          )}`;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(day)}
              data-testid={dateTestId}
              aria-label={format(day, 'd')}
              title={format(day, 'd MMMM yyyy', {
                locale: dateFnsLocale,
              })}
              className={[
                'relative flex aspect-square items-center justify-center rounded-full text-sm transition',
                currentMonthDay
                  ? 'text-gray-900'
                  : 'text-gray-300',
                disabled
                  ? 'cursor-not-allowed text-gray-300'
                  : 'hover:bg-gray-100',
                selected
                  ? 'bg-gray-900 font-semibold text-white hover:bg-gray-900'
                  : '',
                today && !selected
                  ? 'font-semibold ring-1 ring-gray-900'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}