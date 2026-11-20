import { ca } from "./ca";
import { es } from "./es";
import { en } from "./en";

export const locales = {
  ca,
  es,
  en,
} as const;

export type Locale = keyof typeof locales;

export function getTranslations(locale: string) {
  if (locale in locales) {
    return locales[locale as Locale];
  }

  return locales.en;
}
