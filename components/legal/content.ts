// Shared legal texts (aviso legal, privacidad, cookies) in es / ca / en.
// Owner data is the same for every Sergisilvestreweb project; per-project details live in ./site.ts.

export type LegalLocale = "es" | "ca" | "en";
export type LegalKind = "aviso-legal" | "privacidad" | "cookies";

export type LegalSite = {
    /** Product name shown in the texts. */
    name: string;
    /** What the site is, completing "<name> es ..." / "<name> és ..." / "<name> is ...". */
    purpose: Record<LegalLocale, string>;
    /** True when users create accounts or enter their own data. */
    accounts: boolean;
    /** Extra processors beyond hosting and email, e.g. "Stripe (pagos)". */
    processors?: Record<LegalLocale, string[]>;
    /** Key under which the cookie choice is stored in the browser. */
    consentKey?: string;
};

export const OWNER = {
    name: "Sergi Silvestre",
    taxId: "48029961G",
    address: "Calle Barcelona 104, 08812 Les Roquetes",
    email: "hola@sergisilvestre.es",
};

export const UPDATED: Record<LegalLocale, string> = {
    es: "Última actualización: noviembre de 2026",
    ca: "Última actualització: novembre de 2026",
    en: "Last updated: November 2026",
};

export type LegalSection = { title: string; body: string[] };
export type LegalDocument = { title: string; sections: LegalSection[] };

export const UI: Record<
    LegalLocale,
    {
        back: string;
        legal: string;
        privacy: string;
        cookies: string;
        settings: string;
        bannerTitle: string;
        bannerText: string;
        more: string;
        accept: string;
        reject: string;
    }
> = {
    es: {
        back: "Volver al inicio",
        legal: "Aviso legal",
        privacy: "Privacidad",
        cookies: "Cookies",
        settings: "Configurar cookies",
        bannerTitle: "Cookies",
        bannerText:
            "Usamos cookies de analítica (Google Tag Manager) para entender cómo se usa la web. Solo se activan si las aceptas.",
        more: "Más información",
        accept: "Aceptar",
        reject: "Rechazar",
    },
    ca: {
        back: "Tornar a l'inici",
        legal: "Avís legal",
        privacy: "Privacitat",
        cookies: "Galetes",
        settings: "Configurar galetes",
        bannerTitle: "Galetes",
        bannerText:
            "Fem servir galetes d'analítica (Google Tag Manager) per entendre com s'utilitza el web. Només s'activen si les acceptes.",
        more: "Més informació",
        accept: "Acceptar",
        reject: "Rebutjar",
    },
    en: {
        back: "Back to home",
        legal: "Legal notice",
        privacy: "Privacy",
        cookies: "Cookies",
        settings: "Cookie settings",
        bannerTitle: "Cookies",
        bannerText:
            "We use analytics cookies (Google Tag Manager) to understand how the site is used. They only run if you accept them.",
        more: "More information",
        accept: "Accept",
        reject: "Reject",
    },
};

const ownerLine: Record<LegalLocale, string> = {
    es: `${OWNER.name}. NIF: ${OWNER.taxId}. Domicilio: ${OWNER.address}. Correo electrónico: ${OWNER.email}.`,
    ca: `${OWNER.name}. NIF: ${OWNER.taxId}. Domicili: ${OWNER.address}. Correu electrònic: ${OWNER.email}.`,
    en: `${OWNER.name}. Tax ID (NIF): ${OWNER.taxId}. Address: ${OWNER.address}. Email: ${OWNER.email}.`,
};

function legalNotice(site: LegalSite, l: LegalLocale): LegalDocument {
    const p = site.purpose[l];
    return {
        es: {
            title: "Aviso legal",
            sections: [
                {
                    title: "Titular del sitio web",
                    body: [
                        "En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de los datos del titular:",
                        ownerLine.es,
                    ],
                },
                {
                    title: "Objeto",
                    body: [`${site.name} es ${p}. Al acceder y usar este sitio aceptas las condiciones de este aviso legal.`],
                },
                {
                    title: "Condiciones de uso",
                    body: [
                        "Te comprometes a usar el sitio de forma lícita y a no realizar acciones que puedan dañarlo, sobrecargarlo o impedir su uso normal, ni a intentar acceder a zonas o datos sin autorización.",
                    ],
                },
                {
                    title: "Propiedad intelectual e industrial",
                    body: [
                        "Los textos, diseños, logotipos, código y demás contenidos son del titular o se usan con licencia. No se permite su reproducción, distribución o transformación sin autorización expresa.",
                    ],
                },
                {
                    title: "Responsabilidad",
                    body: [
                        "El titular trabaja para que el sitio funcione correctamente y su información sea exacta, pero no garantiza la ausencia de interrupciones o errores. No se hace responsable del contenido de sitios de terceros enlazados.",
                    ],
                },
                {
                    title: "Legislación aplicable",
                    body: [
                        "Este aviso se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan según la ley; si eres consumidor, los de tu domicilio.",
                    ],
                },
            ],
        },
        ca: {
            title: "Avís legal",
            sections: [
                {
                    title: "Titular del lloc web",
                    body: [
                        "En compliment de l'article 10 de la Llei 34/2002, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), s'informa de les dades del titular:",
                        ownerLine.ca,
                    ],
                },
                {
                    title: "Objecte",
                    body: [`${site.name} és ${p}. En accedir i utilitzar aquest lloc acceptes les condicions d'aquest avís legal.`],
                },
                {
                    title: "Condicions d'ús",
                    body: [
                        "Et comprometes a fer un ús lícit del lloc i a no fer accions que el puguin danyar, sobrecarregar o impedir-ne l'ús normal, ni a intentar accedir a zones o dades sense autorització.",
                    ],
                },
                {
                    title: "Propietat intel·lectual i industrial",
                    body: [
                        "Els textos, dissenys, logotips, codi i la resta de continguts són del titular o s'utilitzen amb llicència. No se'n permet la reproducció, distribució o transformació sense autorització expressa.",
                    ],
                },
                {
                    title: "Responsabilitat",
                    body: [
                        "El titular treballa perquè el lloc funcioni correctament i la informació sigui exacta, però no garanteix l'absència d'interrupcions o errors. No es fa responsable del contingut de llocs de tercers enllaçats.",
                    ],
                },
                {
                    title: "Legislació aplicable",
                    body: [
                        "Aquest avís es regeix per la legislació espanyola. Per a qualsevol controvèrsia seran competents els jutjats i tribunals que corresponguin segons la llei; si ets consumidor, els del teu domicili.",
                    ],
                },
            ],
        },
        en: {
            title: "Legal notice",
            sections: [
                {
                    title: "Website owner",
                    body: [
                        "In accordance with article 10 of Spanish Law 34/2002 on information society services and e-commerce (LSSI-CE), the owner's details are:",
                        ownerLine.en,
                    ],
                },
                {
                    title: "Purpose",
                    body: [`${site.name} is ${p}. By accessing and using this site you accept the terms of this legal notice.`],
                },
                {
                    title: "Terms of use",
                    body: [
                        "You agree to use the site lawfully and not to take any action that could damage it, overload it or prevent its normal use, nor to try to access areas or data without authorisation.",
                    ],
                },
                {
                    title: "Intellectual and industrial property",
                    body: [
                        "Texts, designs, logos, code and other content belong to the owner or are used under licence. They may not be reproduced, distributed or transformed without express permission.",
                    ],
                },
                {
                    title: "Liability",
                    body: [
                        "The owner works to keep the site running correctly and its information accurate, but does not guarantee it will be free of interruptions or errors, and is not responsible for the content of linked third-party sites.",
                    ],
                },
                {
                    title: "Applicable law",
                    body: [
                        "This notice is governed by Spanish law. Any dispute will be heard by the courts that are competent under the law; if you are a consumer, those of your place of residence.",
                    ],
                },
            ],
        },
    }[l];
}

function privacy(site: LegalSite, l: LegalLocale): LegalDocument {
    const extra = site.processors?.[l] ?? [];
    const key = site.consentKey ?? "cookie-consent";
    const docs = {
        es: {
            title: "Política de privacidad",
            sections: [
                { title: "Responsable del tratamiento", body: [ownerLine.es] },
                {
                    title: "Qué datos tratamos",
                    body: [
                        ...(site.accounts
                            ? [
                                  "Datos de tu cuenta: nombre, correo electrónico y contraseña (guardada cifrada) o el identificador del proveedor con el que inicies sesión.",
                                  "Los datos que introduces al usar el servicio.",
                              ]
                            : ["Si nos escribes, tu nombre, tu correo electrónico y el contenido de tu mensaje."]),
                        "Datos técnicos: dirección IP, tipo de navegador y registros del servidor, por seguridad y para el funcionamiento del sitio.",
                        "Si aceptas las cookies de analítica, datos de navegación (páginas visitadas, dispositivo y ubicación aproximada) a través de Google Tag Manager.",
                    ],
                },
                {
                    title: "Para qué los usamos y con qué base legal",
                    body: [
                        site.accounts
                            ? "Para prestarte el servicio, gestionar tu cuenta y enviarte los correos necesarios (ejecución del contrato)."
                            : "Para responder a tus consultas (tu consentimiento y aplicación de medidas precontractuales).",
                        "Para mantener el sitio seguro y prevenir abusos (interés legítimo).",
                        "Para medir el uso del sitio y mejorarlo, solo si aceptas las cookies de analítica (consentimiento, que puedes retirar en cualquier momento).",
                        "Para cumplir obligaciones legales, como las fiscales.",
                    ],
                },
                {
                    title: "Cuánto tiempo los conservamos",
                    body: [
                        site.accounts
                            ? "Mientras tengas la cuenta activa. Al eliminarla, los datos se borran o se bloquean solo durante los plazos legales de prescripción."
                            : "El tiempo necesario para atender tu consulta y, después, durante los plazos legales de prescripción.",
                        "Los datos de analítica se conservan según la configuración de Google Analytics (como máximo 14 meses).",
                    ],
                },
                {
                    title: "Con quién los compartimos",
                    body: [
                        `No vendemos tus datos. Solo acceden a ellos los proveedores que necesitamos para dar el servicio, como encargados del tratamiento: alojamiento web, envío de correo${extra.length ? `, ${extra.join(", ")}` : ""} y, si aceptas la analítica, Google.`,
                        "Algunos proveedores, como Google, pueden tratar datos fuera del Espacio Económico Europeo con las garantías del RGPD (Marco de Privacidad de Datos UE-EE. UU. o cláusulas contractuales tipo).",
                    ],
                },
                {
                    title: "Tus derechos",
                    body: [
                        `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad, y retirar tu consentimiento, escribiendo a ${OWNER.email}.`,
                        "Si crees que no tratamos bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).",
                    ],
                },
                {
                    title: "Cookies",
                    body: [
                        `Tu elección sobre las cookies se guarda en tu navegador (almacenamiento local, clave «${key}»). Encontrarás el detalle en la política de cookies.`,
                    ],
                },
            ],
        },
        ca: {
            title: "Política de privacitat",
            sections: [
                { title: "Responsable del tractament", body: [ownerLine.ca] },
                {
                    title: "Quines dades tractem",
                    body: [
                        ...(site.accounts
                            ? [
                                  "Dades del teu compte: nom, correu electrònic i contrasenya (desada xifrada) o l'identificador del proveïdor amb què iniciïs sessió.",
                                  "Les dades que introdueixes en fer servir el servei.",
                              ]
                            : ["Si ens escrius, el teu nom, el teu correu electrònic i el contingut del missatge."]),
                        "Dades tècniques: adreça IP, tipus de navegador i registres del servidor, per seguretat i per al funcionament del lloc.",
                        "Si acceptes les galetes d'analítica, dades de navegació (pàgines visitades, dispositiu i ubicació aproximada) mitjançant Google Tag Manager.",
                    ],
                },
                {
                    title: "Per a què les fem servir i amb quina base legal",
                    body: [
                        site.accounts
                            ? "Per prestar-te el servei, gestionar el teu compte i enviar-te els correus necessaris (execució del contracte)."
                            : "Per respondre les teves consultes (el teu consentiment i aplicació de mesures precontractuals).",
                        "Per mantenir el lloc segur i prevenir abusos (interès legítim).",
                        "Per mesurar l'ús del lloc i millorar-lo, només si acceptes les galetes d'analítica (consentiment, que pots retirar en qualsevol moment).",
                        "Per complir obligacions legals, com les fiscals.",
                    ],
                },
                {
                    title: "Quant de temps les conservem",
                    body: [
                        site.accounts
                            ? "Mentre tinguis el compte actiu. En eliminar-lo, les dades s'esborren o es bloquegen només durant els terminis legals de prescripció."
                            : "El temps necessari per atendre la teva consulta i, després, durant els terminis legals de prescripció.",
                        "Les dades d'analítica es conserven segons la configuració de Google Analytics (com a màxim 14 mesos).",
                    ],
                },
                {
                    title: "Amb qui les compartim",
                    body: [
                        `No venem les teves dades. Només hi accedeixen els proveïdors que necessitem per donar el servei, com a encarregats del tractament: allotjament web, enviament de correu${extra.length ? `, ${extra.join(", ")}` : ""} i, si acceptes l'analítica, Google.`,
                        "Alguns proveïdors, com Google, poden tractar dades fora de l'Espai Econòmic Europeu amb les garanties del RGPD (Marc de Privacitat de Dades UE-EUA o clàusules contractuals tipus).",
                    ],
                },
                {
                    title: "Els teus drets",
                    body: [
                        `Pots exercir els drets d'accés, rectificació, supressió, oposició, limitació i portabilitat, i retirar el teu consentiment, escrivint a ${OWNER.email}.`,
                        "Si creus que no tractem bé les teves dades, pots reclamar davant l'Agència Espanyola de Protecció de Dades (aepd.es).",
                    ],
                },
                {
                    title: "Galetes",
                    body: [
                        `La teva elecció sobre les galetes es desa al navegador (emmagatzematge local, clau «${key}»). En trobaràs el detall a la política de galetes.`,
                    ],
                },
            ],
        },
        en: {
            title: "Privacy policy",
            sections: [
                { title: "Data controller", body: [ownerLine.en] },
                {
                    title: "What data we process",
                    body: [
                        ...(site.accounts
                            ? [
                                  "Account data: name, email address and password (stored encrypted) or the identifier of the provider you sign in with.",
                                  "The data you enter while using the service.",
                              ]
                            : ["If you write to us, your name, email address and the content of your message."]),
                        "Technical data: IP address, browser type and server logs, for security and to run the site.",
                        "If you accept analytics cookies, browsing data (pages visited, device and approximate location) through Google Tag Manager.",
                    ],
                },
                {
                    title: "Why we use it and on what legal basis",
                    body: [
                        site.accounts
                            ? "To provide the service, manage your account and send you the necessary emails (performance of a contract)."
                            : "To answer your enquiries (your consent and pre-contractual steps).",
                        "To keep the site secure and prevent abuse (legitimate interest).",
                        "To measure and improve how the site is used, only if you accept analytics cookies (consent, which you can withdraw at any time).",
                        "To meet legal obligations such as tax rules.",
                    ],
                },
                {
                    title: "How long we keep it",
                    body: [
                        site.accounts
                            ? "While your account is active. When you delete it, the data is erased or kept blocked only for the legal limitation periods."
                            : "As long as needed to handle your enquiry and then for the legal limitation periods.",
                        "Analytics data is kept according to the Google Analytics settings (14 months at most).",
                    ],
                },
                {
                    title: "Who we share it with",
                    body: [
                        `We do not sell your data. Only the providers we need to run the service can access it, as data processors: web hosting, email delivery${extra.length ? `, ${extra.join(", ")}` : ""} and, if you accept analytics, Google.`,
                        "Some providers, such as Google, may process data outside the European Economic Area under GDPR safeguards (EU-US Data Privacy Framework or standard contractual clauses).",
                    ],
                },
                {
                    title: "Your rights",
                    body: [
                        `You can exercise your rights of access, rectification, erasure, objection, restriction and portability, and withdraw consent, by writing to ${OWNER.email}.`,
                        "If you think we are not handling your data properly, you can complain to the Spanish Data Protection Agency (aepd.es).",
                    ],
                },
                {
                    title: "Cookies",
                    body: [
                        `Your cookie choice is stored in your browser (local storage, key "${key}"). See the cookie policy for details.`,
                    ],
                },
            ],
        },
    };
    return docs[l];
}

function cookies(site: LegalSite, l: LegalLocale): LegalDocument {
    const key = site.consentKey ?? "cookie-consent";
    return {
        es: {
            title: "Política de cookies",
            sections: [
                {
                    title: "Qué son las cookies",
                    body: [
                        "Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos que un sitio guarda en tu dispositivo para funcionar o para recordar información sobre tu visita.",
                    ],
                },
                {
                    title: "Cookies técnicas (siempre activas)",
                    body: [
                        `«${key}» (almacenamiento local): guarda si has aceptado o rechazado la analítica. Propia, sin caducidad hasta que la borres.`,
                        ...(site.accounts
                            ? ["Cookies o almacenamiento de sesión: mantienen tu sesión iniciada y tus preferencias (idioma, tema). Propias."]
                            : []),
                        "Son necesarias para que el sitio funcione y están exentas de consentimiento (art. 22.2 LSSI-CE).",
                    ],
                },
                {
                    title: "Cookies de analítica (solo si las aceptas)",
                    body: [
                        "Google Tag Manager y Google Analytics (Google Ireland Ltd.): «_ga» y «_ga_<id>», para distinguir visitantes y medir el uso del sitio. Caducan a los 2 años.",
                        "No se cargan hasta que pulsas «Aceptar». Si pulsas «Rechazar», no se instala ninguna.",
                    ],
                },
                {
                    title: "Cómo cambiar tu elección",
                    body: [
                        "Puedes cambiarla cuando quieras desde el enlace «Configurar cookies» del pie de página.",
                        "También puedes borrar o bloquear las cookies desde la configuración de tu navegador.",
                        "Más información sobre cómo usa Google los datos: policies.google.com/privacy.",
                    ],
                },
            ],
        },
        ca: {
            title: "Política de galetes",
            sections: [
                {
                    title: "Què són les galetes",
                    body: [
                        "Les galetes i tecnologies similars (com l'emmagatzematge local del navegador) són petits fitxers que un lloc desa al teu dispositiu per funcionar o per recordar informació sobre la teva visita.",
                    ],
                },
                {
                    title: "Galetes tècniques (sempre actives)",
                    body: [
                        `«${key}» (emmagatzematge local): desa si has acceptat o rebutjat l'analítica. Pròpia, sense caducitat fins que l'esborris.`,
                        ...(site.accounts
                            ? ["Galetes o emmagatzematge de sessió: mantenen la sessió iniciada i les preferències (idioma, tema). Pròpies."]
                            : []),
                        "Són necessàries perquè el lloc funcioni i estan exemptes de consentiment (art. 22.2 LSSI-CE).",
                    ],
                },
                {
                    title: "Galetes d'analítica (només si les acceptes)",
                    body: [
                        "Google Tag Manager i Google Analytics (Google Ireland Ltd.): «_ga» i «_ga_<id>», per distingir visitants i mesurar l'ús del lloc. Caduquen als 2 anys.",
                        "No es carreguen fins que prems «Acceptar». Si prems «Rebutjar», no se n'instal·la cap.",
                    ],
                },
                {
                    title: "Com canviar la teva elecció",
                    body: [
                        "Pots canviar-la quan vulguis des de l'enllaç «Configurar galetes» del peu de pàgina.",
                        "També pots esborrar o bloquejar les galetes des de la configuració del navegador.",
                        "Més informació sobre com fa servir Google les dades: policies.google.com/privacy.",
                    ],
                },
            ],
        },
        en: {
            title: "Cookie policy",
            sections: [
                {
                    title: "What cookies are",
                    body: [
                        "Cookies and similar technologies (such as the browser's local storage) are small files a site stores on your device to work or to remember information about your visit.",
                    ],
                },
                {
                    title: "Technical cookies (always on)",
                    body: [
                        `"${key}" (local storage): remembers whether you accepted or rejected analytics. First-party, kept until you delete it.`,
                        ...(site.accounts
                            ? ["Session cookies or storage: keep you signed in and remember your preferences (language, theme). First-party."]
                            : []),
                        "They are needed for the site to work and are exempt from consent (art. 22.2 LSSI-CE).",
                    ],
                },
                {
                    title: "Analytics cookies (only if you accept)",
                    body: [
                        'Google Tag Manager and Google Analytics (Google Ireland Ltd.): "_ga" and "_ga_<id>", to tell visitors apart and measure site use. They expire after 2 years.',
                        'They are not loaded until you click "Accept". If you click "Reject", none are set.',
                    ],
                },
                {
                    title: "How to change your choice",
                    body: [
                        'You can change it at any time from the "Cookie settings" link in the footer.',
                        "You can also delete or block cookies in your browser settings.",
                        "More about how Google uses data: policies.google.com/privacy.",
                    ],
                },
            ],
        },
    }[l];
}

export function getLegalDocument(kind: LegalKind, site: LegalSite, locale: LegalLocale): LegalDocument {
    if (kind === "aviso-legal") return legalNotice(site, locale);
    if (kind === "privacidad") return privacy(site, locale);
    return cookies(site, locale);
}

/** For useSyncExternalStore: the browser language does not change while the page is open. */
export function subscribeNever(): () => void {
    return () => {};
}

export function detectLocale(): LegalLocale {
    if (typeof document === "undefined") return "es";
    const candidates = [document.documentElement.lang, ...(navigator.languages ?? [navigator.language])];
    for (const value of candidates) {
        const code = value?.slice(0, 2).toLowerCase();
        if (code === "es" || code === "ca" || code === "en") return code;
    }
    return "es";
}
