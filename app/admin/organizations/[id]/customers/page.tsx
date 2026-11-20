"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Customer = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    created_at?: string;
};

export default function CustomersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const organizationId =
        searchParams.get("organization_id") ||
        localStorage.getItem("organization_id");

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!organizationId) {
            setError("Organization not found.");
            setLoading(false);
            return;
        }

        const loadCustomers = async () => {
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

                if (!apiUrl) {
                    throw new Error("NEXT_PUBLIC_API_URL is not configured");
                }

                const response = await fetch(
                    `${apiUrl}/api/admin/customers?organization_id=${encodeURIComponent(
                        organizationId
                    )}`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load customers");
                }

                const result = await response.json();

                setCustomers(
                    Array.isArray(result)
                        ? result
                        : result.data ?? []
                );
            } catch {
                setError("Unable to load customers.");
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, [organizationId]);

    const goBack = () => {
        router.push(
            `/admin/organizations?organization_id=${encodeURIComponent(
                organizationId ?? ""
            )}`
        );
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <button
                    type="button"
                    onClick={goBack}
                    className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to organization
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                            <Users className="h-5 w-5 text-gray-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                                Customers
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage customers for this organization.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {customers.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                        <Users className="mx-auto h-10 w-10 text-gray-400" />

                        <h2 className="mt-4 text-base font-medium text-gray-900">
                            No customers
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            This organization doesn't have any customers yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Customer list
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                {customers.length} customer
                                {customers.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="flex items-center gap-4 px-6 py-4"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                        <Users className="h-4 w-4 text-gray-500" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {customer.name}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-gray-500">
                                            {customer.email}
                                        </p>
                                    </div>

                                    {customer.phone && (
                                        <div className="hidden text-sm text-gray-500 sm:block">
                                            {customer.phone}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
