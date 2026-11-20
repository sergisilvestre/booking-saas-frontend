"use client";

import { useSearchParams } from "next/navigation";

const ERRORS: Record<string, string> = {
    forbidden: "This Google account is not a super admin.",
    google_auth_failed: "Google sign-in failed. Please try again.",
};

export function LoginForm() {
    const error = useSearchParams().get("error");

    return (
        <div className="space-y-4">
            {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {ERRORS[error] ?? "Sign-in failed."}
                </p>
            )}

            <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/google/redirect`}
                className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
                Continue with Google
            </a>
        </div>
    );
}
