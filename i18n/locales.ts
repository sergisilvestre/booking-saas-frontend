export const locales = ["ca", "es", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "ca";

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Placeholder used for dynamic segments in the static export (see public/.htaccess). */
export const STATIC_PLACEHOLDER = "_";
