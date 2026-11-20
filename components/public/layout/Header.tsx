import Link from 'next/link';

import LanguageSwitcher, {
  type Locale,
} from './LanguageSwitcher';

interface HeaderProps {
  locale: Locale;
  organizationName?: string;
  organizationSlug?: string;
}

export default function Header({
  locale,
  organizationName,
  organizationSlug,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Organization */}
        <div className="min-w-0">
          {organizationSlug ? (
            <Link
              href={`/${locale}/${organizationSlug}`}
              className="block truncate text-sm font-semibold text-gray-900"
            >
              {organizationName ?? organizationSlug}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-gray-900">
              {organizationName}
            </span>
          )}
        </div>

        {/* Language */}
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}