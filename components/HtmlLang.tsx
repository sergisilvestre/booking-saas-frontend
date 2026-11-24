"use client";

import { useEffect } from "react";

/** Sets <html lang> to the page language (the root layout renders it without knowing [lang]). */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
