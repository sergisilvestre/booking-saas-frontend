"use client";

import { useEffect } from "react";

import { defaultLocale, isLocale } from "@/i18n/locales";

/** "/" picks the browser language (replaces the locale middleware, which a static export cannot run). */
export default function RootRedirect() {
  useEffect(() => {
    const browser = (navigator.languages?.length ? navigator.languages : [navigator.language])
      .map((language) => language.toLowerCase().split("-")[0])
      .find(isLocale);

    window.location.replace(`/${browser ?? defaultLocale}/`);
  }, []);

  return (
    <noscript>
      <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
    </noscript>
  );
}
