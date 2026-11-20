import { Clock3 } from 'lucide-react';

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

interface EventTypeDetailsProps {
  eventType: EventType;
  organizationName?: string;
  locale: Locale;
}

export default function EventTypeDetails({
  eventType,
  organizationName,
  locale,
}: EventTypeDetailsProps) {
  const t = getTranslations(locale);

  return (
    <div className="space-y-6">
      {organizationName && (
        <p className="text-sm font-medium text-gray-500">
          {organizationName}
        </p>
      )}

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          {eventType.name}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Clock3
            className="h-4 w-4"
            aria-hidden="true"
          />

          <span>
            {eventType.duration} {t.event.minutes}
          </span>
        </div>
      </div>

      {eventType.description && (
        <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
          {eventType.description}
        </p>
      )}
    </div>
  );
}