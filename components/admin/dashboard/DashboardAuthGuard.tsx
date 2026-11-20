"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    children: React.ReactNode;
};

export default function DashboardAuthGuard({
    children,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/admin/login");
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

                if (!response.ok) {
                    localStorage.removeItem("token");

                    router.replace("/admin/login");
                    return;
                }

                setLoading(false);
            } catch {
                localStorage.removeItem("token");

                router.replace("/admin/login");
            }
        };

        checkAuthentication();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-sm text-gray-500">
                    Loading...
                </div>
            </div>
        );
    }

    return <>{children}</>;
}