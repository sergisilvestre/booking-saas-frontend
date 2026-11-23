"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

type Lang = "ca" | "es" | "en";
type Choice = "granted" | "denied" | null;

const GTM_ID = "GTM-ND7K2342";
const STORAGE_KEY = "cookie-consent";
const CHANGE_EVENT = "cookie-consent-change";
export const OPEN_EVENT = "open-cookie-settings";

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

const texts: Record<
    Lang,
    { title: string; text: string; more: string; accept: string; reject: string }
> = {
    ca: {
        title: "Galetes",
        text: "Fem servir galetes d'analítica (Google Tag Manager) per entendre com s'utilitza l'aplicació. Només s'activen si les acceptes.",
        more: "Més informació",
        accept: "Acceptar",
        reject: "Rebutjar",
    },
    es: {
        title: "Cookies",
        text: "Usamos cookies de analítica (Google Tag Manager) para entender cómo se usa la aplicación. Solo se activan si las aceptas.",
        more: "Más información",
        accept: "Aceptar",
        reject: "Rechazar",
    },
    en: {
        title: "Cookies",
        text: "We use analytics cookies (Google Tag Manager) to understand how the app is used. They only run if you accept them.",
        more: "More information",
        accept: "Accept",
        reject: "Reject",
    },
};

function readChoice(): Choice {
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return value === "granted" || value === "denied" ? value : null;
    } catch {
        return null;
    }
}

function subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback);
    return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function loadTagManager() {
    if (document.getElementById("gtm-loader")) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.id = "gtm-loader";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
}

export default function CookieConsent() {
    const locale = useLocale();
    const lang: Lang = locale === "ca" || locale === "es" ? locale : "en";
    const t = texts[lang];

    // The server cannot know the visitor's choice: render nothing until hydrated.
    const choice = useSyncExternalStore<Choice | undefined>(
        subscribe,
        readChoice,
        () => undefined,
    );
    const [reopened, setReopened] = useState(false);

    useEffect(() => {
        if (choice === "granted") loadTagManager();
    }, [choice]);

    useEffect(() => {
        const open = () => setReopened(true);
        window.addEventListener(OPEN_EVENT, open);
        return () => window.removeEventListener(OPEN_EVENT, open);
    }, []);

    function choose(value: Exclude<Choice, null>) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch {
            // Storage can be unavailable (private mode); the choice only lasts for this visit.
        }
        setReopened(false);
        window.dispatchEvent(new Event(CHANGE_EVENT));
        if (value === "granted") loadTagManager();
    }

    if (choice === undefined || (choice !== null && !reopened)) return null;

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label={t.title}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md rounded-2xl bg-gray-900 p-5 text-white shadow-2xl sm:right-auto"
        >
            <p className="font-bold">{t.title}</p>
            <p className="mt-1 text-sm leading-6 text-gray-300">
                {t.text}{" "}
                <Link href={`/${lang}/privacy`} className="underline">
                    {t.more}
                </Link>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => choose("denied")}
                    className="rounded-full border border-white/40 px-4 py-2.5 text-sm font-semibold transition hover:bg-white hover:text-gray-900"
                >
                    {t.reject}
                </button>
                <button
                    type="button"
                    onClick={() => choose("granted")}
                    className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                    {t.accept}
                </button>
            </div>
        </div>
    );
}
