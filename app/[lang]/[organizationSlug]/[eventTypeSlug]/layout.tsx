import type { ReactNode } from "react";

import { STATIC_PLACEHOLDER } from "@/i18n/locales";

/**
 * Organizations and event types are created at runtime, so the static export
 * ships these pages once with "_" placeholders; public/.htaccess serves them for
 * every real /{lang}/{organization}/{event}/ URL and the pages read the slugs
 * from the browser URL.
 */
export function generateStaticParams() {
  return [{ organizationSlug: STATIC_PLACEHOLDER, eventTypeSlug: STATIC_PLACEHOLDER }];
}

export default function EventTypeLayout({ children }: { children: ReactNode }) {
  return children;
}
