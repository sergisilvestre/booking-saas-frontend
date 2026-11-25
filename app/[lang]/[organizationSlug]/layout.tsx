import type { ReactNode } from "react";

import { STATIC_PLACEHOLDER } from "@/i18n/locales";

/**
 * Organizations are created at runtime: the static export ships this page once
 * with "_" as slug and public/.htaccess serves it for every /{lang}/{slug}/.
 */
export function generateStaticParams() {
  return [{ organizationSlug: STATIC_PLACEHOLDER }];
}

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  return children;
}
