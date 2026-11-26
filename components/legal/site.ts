import type { LegalSite } from "./content";

export const SITE: LegalSite = {
    name: "Booking",
    purpose: { es: "una plataforma de reservas online para negocios y profesionales", ca: "una plataforma de reserves en línia per a negocis i professionals", en: "an online booking platform for businesses and professionals" },
    accounts: true,
    processors: { es: ["Stripe (pagos)", "Google (inicio de sesión)"], ca: ["Stripe (pagaments)", "Google (inici de sessió)"], en: ["Stripe (payments)", "Google (sign-in)"] },
};
