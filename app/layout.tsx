import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";

import CookieConsent from "@/components/CookieConsent";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { ConfigOptionsProvider } from "@/components/providers/ConfigOptionsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking platform",
};

type Props = {
  children: React.ReactNode;
  // Absent on routes outside /[lang] (e.g. /admin, English only).
  params: Promise<{
    lang?: string;
  }>;
};

export default async function LangLayout({
  children,
  params,
}: Props) {
  const { lang = "en" } = await params;

  const messages = await getMessages({
    locale: lang,
  });

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider
          key={lang}
          locale={lang}
          messages={messages}
        >
          <LoadingProvider>
            <ConfigOptionsProvider>
              {children}
              <CookieConsent />
            </ConfigOptionsProvider>
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}