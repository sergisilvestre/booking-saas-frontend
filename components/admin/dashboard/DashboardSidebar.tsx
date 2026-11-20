"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const items = [
        {
            label: "Dashboard",
            href: "/admin",
        },
        {
            label: "Organizations",
            href: "/admin/organizations",
        },
        {
            label: "Plans",
            href: "/admin/plans",
        },
        {
            label: "Subscriptions",
            href: "/admin/subscriptions",
        },
        {
            label: "Settings",
            href: "/admin/settings",
        },
    ];

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );
            }
        } finally {
            localStorage.removeItem("token");
            router.push("/admin/login");
            router.refresh();
        }
    };

    return (
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
            <div className="sticky top-0 flex h-screen flex-col">
                <div className="border-b border-gray-200 px-6 py-5">
                    <Link
                        href="/admin"
                        className="text-lg font-semibold text-gray-900"
                    >
                        Booking
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    {items.map((item) => {
                        const active =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "block rounded-xl px-4 py-2.5 text-sm font-medium transition",
                                    active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-gray-200 p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </aside>
    );
}