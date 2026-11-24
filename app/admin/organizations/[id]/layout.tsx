import type { ReactNode } from "react";

import { STATIC_PLACEHOLDER } from "@/i18n/locales";

/**
 * The static export ships these pages once with "_" as id; public/.htaccess
 * serves them for every real organization id. The pages read the selected
 * organization from localStorage, not from the URL.
 */
export function generateStaticParams() {
  return [{ id: STATIC_PLACEHOLDER }];
}

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  return children;
}
