"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { UI, UPDATED, detectLocale, getLegalDocument, subscribeNever, type LegalKind, type LegalLocale } from "./content";
import { SITE } from "./site";

/** Renders one legal page. Without a fixed locale it offers an ES / CA / EN switch. */
export default function LegalDoc({
    kind,
    locale,
    homeHref = "/",
}: {
    kind: LegalKind;
    locale?: LegalLocale;
    homeHref?: string;
}) {
    const detected = useSyncExternalStore(subscribeNever, detectLocale, () => "es" as LegalLocale);
    const [chosen, setChosen] = useState<LegalLocale | null>(null);
    const current = locale ?? chosen ?? detected;
    const doc = getLegalDocument(kind, SITE, current);
    const t = UI[current];

    return (
        <main
            id="main"
            style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px", lineHeight: 1.7, fontFamily: "inherit" }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 14 }}>
                <Link href={homeHref} style={{ color: "inherit", fontWeight: 600 }}>
                    ← {t.back}
                </Link>
                {!locale && (
                    <div style={{ display: "flex", gap: 12 }}>
                        {(["es", "ca", "en"] as LegalLocale[]).map((code) => (
                            <button
                                key={code}
                                type="button"
                                onClick={() => setChosen(code)}
                                aria-pressed={current === code}
                                style={{
                                    background: "none",
                                    border: 0,
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    textTransform: "uppercase",
                                    fontWeight: current === code ? 700 : 400,
                                    opacity: current === code ? 1 : 0.6,
                                }}
                            >
                                {code}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <h1 style={{ marginTop: 32, fontSize: 30, fontWeight: 700 }}>{doc.title}</h1>
            <p style={{ fontSize: 14, opacity: 0.7 }}>{UPDATED[current]}</p>
            {doc.sections.map((section) => (
                <section key={section.title} style={{ marginTop: 28 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>{section.title}</h2>
                    {section.body.map((paragraph) => (
                        <p key={paragraph} style={{ marginTop: 8, opacity: 0.85 }}>
                            {paragraph}
                        </p>
                    ))}
                </section>
            ))}
        </main>
    );
}
