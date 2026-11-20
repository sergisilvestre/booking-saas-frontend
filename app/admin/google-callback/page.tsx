"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Callback() {
    const router = useRouter();
    const code = useSearchParams().get("code");
    const done = useRef(false);

    useEffect(() => {
        if (!code || done.current) return;
        done.current = true;

        (async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/exchange-login-code`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code }),
                    }
                );

                if (!response.ok) throw new Error("exchange failed");

                const data: { token: string } = await response.json();
                localStorage.setItem("token", data.token);
                router.replace("/admin");
            } catch {
                router.replace("/admin/login?error=google_auth_failed");
            }
        })();
    }, [code, router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-500">Signing in...</p>
        </main>
    );
}

export default function AdminGoogleCallbackPage() {
    return (
        <Suspense>
            <Callback />
        </Suspense>
    );
}
