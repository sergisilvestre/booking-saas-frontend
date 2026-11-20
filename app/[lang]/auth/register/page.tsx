import { redirect } from "next/navigation";

type Props = {
    params: Promise<{
        lang: string;
    }>;
};

// Sign-up is Google-only: the first Google sign-in creates the account.
export default async function RegisterPage({ params }: Props) {
    const { lang } = await params;

    redirect(`/${lang}/auth/login`);
}
