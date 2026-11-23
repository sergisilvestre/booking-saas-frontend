import type { Metadata } from "next";
import Link from "next/link";

type Lang = "ca" | "es" | "en";

const content: Record<Lang, { title: string; back: string; updated: string; sections: [string, string[]][] }> = {
    ca: {
    "title": "Política de privacitat",
    "back": "← Tornar",
    "updated": "Última actualització: novembre de 2026",
    "sections": [
        [
            "1. Responsable",
            [
                "Sergi Silvestre opera aquesta plataforma de reserves. Per a les dades de compte i de la plataforma és el responsable del tractament. Contacte: hola@sergisilvestre.es.",
                "Per a les dades personals dels clients que reserven a la pàgina d'una organització (nom, correu, telèfon i dades de la reserva), el responsable és l'organització i Sergi Silvestre actua com el seu encarregat, proporcionant la plataforma."
            ]
        ],
        [
            "2. Dades que tractem",
            [
                "Dades de compte: nom, correu electrònic i l'identificador que facilita Google en iniciar sessió amb Google, i les dades de la teva organització (perfil, serveis, disponibilitat i pla).",
                "Dades de reserves: les dades introduïdes en reservar i la reserva mateixa.",
                "Les dades de pagament les gestiona el nostre proveïdor de pagaments; no desem números de targeta.",
                "Dades tècniques com la teva adreça IP i la zona horària del teu navegador."
            ]
        ],
        [
            "3. Per a què les fem servir",
            [
                "Per prestar el servei: crear comptes, gestionar organitzacions i disponibilitat, rebre i gestionar reserves, enviar correus de reserves i de compte, facturar els plans i mantenir la plataforma segura.",
                "Si acceptes les galetes, per mesurar com s'utilitza l'aplicació mitjançant Google Tag Manager."
            ]
        ],
        [
            "4. Base jurídica",
            [
                "Execució del contracte, el teu consentiment (galetes d'analítica), obligacions legals i el nostre interès legítim a mantenir el servei segur."
            ]
        ],
        [
            "5. Destinataris",
            [
                "Els nostres proveïdors de serveis: allotjament, enviament de correu, pagaments i Google (inici de sessió i, només amb el teu consentiment, Tag Manager).",
                "Alguns poden tractar dades fora de l'Espai Econòmic Europeu aplicant les garanties previstes en les seves polítiques i en la normativa aplicable."
            ]
        ],
        [
            "6. Conservació",
            [
                "Les dades de compte i d'organització es conserven mentre el compte estigui actiu. Les dades de reserves es conserven mentre l'organització les necessiti i pots demanar-ne l'eliminació. Algunes dades poden conservar-se més temps si la llei ho exigeix."
            ]
        ],
        [
            "7. Galetes i emmagatzematge local",
            [
                "Fem servir l'emmagatzematge del navegador per mantenir la sessió, recordar el teu idioma i zona horària i la teva elecció sobre galetes. Són tècniques i no requereixen consentiment.",
                "Google Tag Manager es carrega només si acceptes les galetes d'analítica. Pots canviar la teva elecció en qualsevol moment des de l'enllaç «Galetes» del peu de pàgina."
            ]
        ],
        [
            "8. Els teus drets",
            [
                "Pots exercir els teus drets d'accés, rectificació, supressió, oposició, limitació i portabilitat escrivint a hola@sergisilvestre.es. Si les teves dades les va introduir una organització client, li traslladarem la sol·licitud. També pots reclamar davant la teva autoritat de protecció de dades (a Espanya, l'AEPD)."
            ]
        ],
        [
            "9. Canvis",
            [
                "Podem actualitzar aquesta política. La versió vigent estarà sempre en aquesta pàgina."
            ]
        ]
    ]
} as { title: string; back: string; updated: string; sections: [string, string[]][] },
    es: {
    "title": "Política de privacidad",
    "back": "← Volver",
    "updated": "Última actualización: noviembre de 2026",
    "sections": [
        [
            "1. Responsable",
            [
                "Sergi Silvestre opera esta plataforma de reservas. Para los datos de cuenta y de la plataforma es el responsable del tratamiento. Contacto: hola@sergisilvestre.es.",
                "Para los datos personales de los clientes que reservan en la página de una organización (nombre, email, teléfono y datos de la reserva), el responsable es la organización y Sergi Silvestre actúa como su encargado, proporcionando la plataforma."
            ]
        ],
        [
            "2. Datos que tratamos",
            [
                "Datos de cuenta: nombre, correo electrónico y el identificador que facilita Google al iniciar sesión con Google, y los datos de tu organización (perfil, servicios, disponibilidad y plan).",
                "Datos de reservas: los datos introducidos al reservar y la propia reserva.",
                "Los datos de pago los gestiona nuestro proveedor de pagos; no guardamos números de tarjeta.",
                "Datos técnicos como tu dirección IP y la zona horaria de tu navegador."
            ]
        ],
        [
            "3. Para qué los usamos",
            [
                "Para prestar el servicio: crear cuentas, gestionar organizaciones y disponibilidad, recibir y gestionar reservas, enviar correos de reservas y de cuenta, facturar los planes y mantener la plataforma segura.",
                "Si aceptas las cookies, para medir cómo se usa la aplicación mediante Google Tag Manager."
            ]
        ],
        [
            "4. Base jurídica",
            [
                "Ejecución del contrato, tu consentimiento (cookies de analítica), obligaciones legales y nuestro interés legítimo en mantener el servicio seguro."
            ]
        ],
        [
            "5. Destinatarios",
            [
                "Nuestros proveedores de servicios: alojamiento, envío de correo, pagos y Google (inicio de sesión y, solo con tu consentimiento, Tag Manager).",
                "Algunos pueden tratar datos fuera del Espacio Económico Europeo aplicando las garantías previstas en sus propias políticas y en la normativa aplicable."
            ]
        ],
        [
            "6. Conservación",
            [
                "Los datos de cuenta y de organización se conservan mientras la cuenta esté activa. Los datos de reservas se conservan mientras la organización los necesite y puedes pedir su eliminación. Algunos datos pueden conservarse más tiempo si la ley lo exige."
            ]
        ],
        [
            "7. Cookies y almacenamiento local",
            [
                "Usamos el almacenamiento del navegador para mantener tu sesión, recordar tu idioma y zona horaria y tu elección sobre cookies. Son técnicas y no requieren consentimiento.",
                "Google Tag Manager se carga solo si aceptas las cookies de analítica. Puedes cambiar tu elección en cualquier momento desde el enlace «Cookies» del pie de página."
            ]
        ],
        [
            "8. Tus derechos",
            [
                "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a hola@sergisilvestre.es. Si tus datos los introdujo una organización cliente, le trasladaremos la solicitud. También puedes reclamar ante tu autoridad de protección de datos (en España, la AEPD)."
            ]
        ],
        [
            "9. Cambios",
            [
                "Podemos actualizar esta política. La versión vigente estará siempre en esta página."
            ]
        ]
    ]
} as { title: string; back: string; updated: string; sections: [string, string[]][] },
    en: {
    "title": "Privacy policy",
    "back": "← Back",
    "updated": "Last updated: November 2026",
    "sections": [
        [
            "1. Who is responsible",
            [
                "Sergi Silvestre operates this booking platform. For account and platform data he acts as data controller. Contact: hola@sergisilvestre.es.",
                "For the personal data of the customers who book through an organization's page (name, email, phone, booking details), the organization is the controller and Sergi Silvestre acts as its processor, providing the platform."
            ]
        ],
        [
            "2. Data we process",
            [
                "Account data: name, email address and the identifier provided by Google when you sign in with Google, and the data of your organization (profile, services, availability and plan).",
                "Booking data: the details entered when a booking is made and the booking itself.",
                "Payment data is handled by our payment provider; we do not store card numbers.",
                "Technical data such as your IP address and the time zone of your browser."
            ]
        ],
        [
            "3. Why we use it",
            [
                "To provide the service: create accounts, manage organizations and availability, take and manage bookings, send booking and account emails, bill plans and keep the platform secure.",
                "Where you accept cookies, to measure how the app is used through Google Tag Manager."
            ]
        ],
        [
            "4. Legal basis",
            [
                "Performance of the contract, your consent (analytics cookies), legal obligations and our legitimate interest in keeping the service secure."
            ]
        ],
        [
            "5. Who receives your data",
            [
                "Our service providers: hosting, email delivery, payments, Google (sign-in and, only with your consent, Tag Manager).",
                "Some of them may process data outside the European Economic Area under the safeguards set out in their own policies and in applicable law."
            ]
        ],
        [
            "6. How long we keep it",
            [
                "Account and organization data are kept while the account is active. Booking data is kept as long as the organization needs it and you can ask for its deletion. Some data may be kept longer when the law requires it."
            ]
        ],
        [
            "7. Cookies and local storage",
            [
                "We use your browser's storage to keep you signed in, remember your language and time zone, and remember your cookie choice. These are technical and do not require consent.",
                "Google Tag Manager is loaded only if you accept analytics cookies. You can change your choice at any time with the \"Cookies\" link in the footer."
            ]
        ],
        [
            "8. Your rights",
            [
                "You can ask for access, rectification, erasure, objection, restriction and portability by writing to hola@sergisilvestre.es. If your data was entered by a customer organization, we will forward the request to it. You can also complain to your data protection authority (in Spain, the AEPD)."
            ]
        ],
        [
            "9. Changes",
            [
                "We may update this policy. The current version is always available on this page."
            ]
        ]
    ]
} as { title: string; back: string; updated: string; sections: [string, string[]][] },
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const page = content[(lang as Lang) in content ? (lang as Lang) : "en"];

    return { title: page.title, robots: { index: false } };
}

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const safeLang: Lang = (lang as Lang) in content ? (lang as Lang) : "en";
    const page = content[safeLang];

    return (
        <main className="mx-auto w-full max-w-3xl px-6 py-16">
            <Link href={`/${safeLang}`} className="text-sm text-gray-500 underline">
                {page.back}
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">{page.title}</h1>
            <p className="mt-2 text-sm text-gray-500">{page.updated}</p>

            {page.sections.map(([title, paragraphs]) => (
                <section key={title} className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    {paragraphs.map((text) => (
                        <p key={text} className="mt-2 leading-7 text-gray-600">
                            {text}
                        </p>
                    ))}
                </section>
            ))}
        </main>
    );
}
