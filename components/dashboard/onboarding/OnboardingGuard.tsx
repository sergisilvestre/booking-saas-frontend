"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getOnboardingStatus } from "@/lib/onboarding";

const SETTINGS_ROUTE = "/dashboard/settings";

type Props = {
    children: ReactNode;
    lang: string;
};

export default function OnboardingGuard({ children, lang }: Props) {
    const router = useRouter();
    // The static export uses trailingSlash, so "/en/dashboard/settings/" must match too.
    const pathname = usePathname()?.replace(/\/+$/, "") ?? "";

    const { user, loadingUser } = useCurrentUser();

    const {
        emailNeedsValidation,
        organizationNeedsValidation,
    } = getOnboardingStatus(user);

    const settingsPath = `/${lang}${SETTINGS_ROUTE}`;

    const needsOnboarding =
        emailNeedsValidation || organizationNeedsValidation;

    // Without a user the guard renders nothing, so send them to log in instead of a blank page.
    useEffect(() => {
        if (!loadingUser && !user) {
            router.replace(`/${lang}/auth/login`);
        }
    }, [loadingUser, user, lang, router]);

    useEffect(() => {
        if (loadingUser || !user || !needsOnboarding) {
            return;
        }

        if (pathname !== settingsPath) {
            router.replace(settingsPath);
        }
    }, [
        loadingUser,
        user,
        needsOnboarding,
        pathname,
        settingsPath,
        router,
    ]);

    if (loadingUser || !user) {
        return null;
    }

    if (needsOnboarding && pathname !== settingsPath) {
        return null;
    }

    return children;
}