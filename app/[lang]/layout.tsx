import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import HtmlLang from "@/components/HtmlLang";
import { isLocale, locales } from "@/i18n/locales";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

/**
 * Provides the messages of the URL language to client components.
 * The root layout cannot read [lang], so without this they always rendered in English.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  setRequestLocale(lang);
  const messages = await getMessages({ locale: lang });

  return (
    <NextIntlClientProvider key={lang} locale={lang} messages={messages}>
      <HtmlLang lang={lang} />
      {children}
    </NextIntlClientProvider>
  );
}
