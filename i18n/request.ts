import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale } from "./locales";

export default getRequestConfig(async ({ locale, requestLocale }) => {
    // Pages pass the locale explicitly (static rendering); fall back to the request locale.
    const requested = locale ?? (await requestLocale);
    const validLocale = isLocale(requested) ? requested : defaultLocale;

    return {
        locale: validLocale,
        messages: (
            await import(`../messages/${validLocale}.json`)
        ).default,
    };
});
