'use client';

import { usePathname, useRouter } from 'next/navigation';

export type Locale = 'ca' | 'es' | 'en';

const locales: {
  code: Locale;
  label: string;
}[] = [
  {
    code: 'ca',
    label: 'CA',
  },
  {
    code: 'es',
    label: 'ES',
  },
  {
    code: 'en',
    label: 'EN',
  },
];

interface LanguageSwitcherProps {
  locale: Locale;
}

export default function LanguageSwitcher({
  locale,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: Locale) => {
    const segments = pathname.split('/');

    segments[1] = newLocale;

    router.push(segments.join('/'));
  };

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-gray-200 p-1"
      aria-label="Language"
    >
      {locales.map((item) => {
        const active = item.code === locale;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => changeLocale(item.code)}
            aria-current={active ? 'page' : undefined}
            className={[
              'rounded-md px-2.5 py-1.5 text-xs font-medium transition',
              active
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}