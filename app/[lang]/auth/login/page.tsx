import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LoginAuth from "./LoginAuth";
import GoogleLoginButton from "./GoogleLoginButton";

type Props = {
    params: Promise<{
        lang: string;
    }>;
};

export default async function LoginPage({ params }: Props) {
    const { lang } = await params;

    const t = await getTranslations({
        locale: lang,
        namespace: "login",
    });

    return (
        <LoginAuth lang={lang}>
            <main className="min-h-screen bg-gray-50">
                <div className="flex min-h-screen items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <Link
                                href={`/${lang}`}
                                className="text-2xl font-bold tracking-tight text-gray-900"
                            >
                                Booking
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    {t("title")}
                                </h1>

                                <p className="mt-2 text-sm text-gray-500">
                                    {t("subtitle")}
                                </p>
                            </div>

                            <GoogleLoginButton
                                lang={lang}
                                label={t("continueWithGoogle")}
                            />

                        </div>

                        <p className="mt-6 text-center text-xs text-gray-400">
                            {t("termsPrefix")}{" "}
                            <Link
                                href={`/${lang}/terms`}
                                className="underline hover:text-gray-600"
                            >
                                {t("terms")}
                            </Link>{" "}
                            {t("and")}{" "}
                            <Link
                                href={`/${lang}/privacy`}
                                className="underline hover:text-gray-600"
                            >
                                {t("privacy")}
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </main>
        </LoginAuth>
    );
}