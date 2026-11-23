"use client";

import { useLocale } from "next-intl";

import { OPEN_EVENT } from "./CookieConsent";

const labels = { ca: "Galetes", es: "Cookies", en: "Cookies" } as const;

export default function CookieSettingsButton() {
    const locale = useLocale();
    const label = labels[locale as keyof typeof labels] ?? labels.en;

    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
            className="hover:text-gray-900"
        >
            {label}
        </button>
    );
}
