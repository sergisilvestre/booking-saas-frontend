import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import type { LegalLocale } from "@/components/legal/content";

type Props = { params: Promise<{ lang: string }> };

const titles: Record<LegalLocale, string> = { es: "Aviso legal", ca: "Avís legal", en: "Legal notice" };

function toLocale(value: string): LegalLocale {
    return value === "ca" || value === "en" ? value : "es";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return { title: titles[toLocale(lang)] };
}

export default async function Page({ params }: Props) {
    const { lang } = await params;
    return <LegalDoc kind="aviso-legal" locale={toLocale(lang)} homeHref={`/${lang}`} />;
}
