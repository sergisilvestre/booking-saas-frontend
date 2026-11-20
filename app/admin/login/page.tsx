"use client";

import { LoginForm } from "@/components/admin/auth/LoginForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setCheckingAuth(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    router.replace("/admin");
                    return;
                }

                localStorage.removeItem("token");
            } catch {
                localStorage.removeItem("token");
            }

            setCheckingAuth(false);
        };

        checkAuth();
    }, [router]);

    if (checkingAuth) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <p className="text-sm text-gray-500">
                    Checking session...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                        <span className="text-lg font-bold">B</span>
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to manage your organization
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <LoginForm />
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} Booking SaaS
                </p>
            </div>
        </main>
    );
}