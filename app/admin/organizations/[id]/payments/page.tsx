"use client";

import { Suspense, useEffect, useState } from "react";
import {
    CreditCard,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Payment = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    customer_name?: string;
    customer_email?: string;
    created_at?: string;
};

function PaymentsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const organizationId = searchParams.get("organization_id");

    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!organizationId) {
            setError("Organization ID is required.");
            setLoading(false);
            return;
        }

        const loadPayments = async () => {
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

                if (!apiUrl) {
                    throw new Error("NEXT_PUBLIC_API_URL is not configured");
                }

                const response = await fetch(
                    `${apiUrl} /api/payments ? organization_id = ${encodeURIComponent(
                        organizationId
                    )
                    } `,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token} `,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load payments");
                }

                const result = await response.json();

                setPayments(
                    Array.isArray(result)
                        ? result
                        : result.data ?? []
                );
            } catch {
                setError("Unable to load payments.");
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, [organizationId]);

    const formatAmount = (
        amount: number,
        currency: string
    ): string => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    const formatDate = (date?: string): string => {
        if (!date) {
            return "-";
        }

        return new Intl.DateTimeFormat("en", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(date));
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "succeeded":
            case "paid":
                return (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                );

            case "pending":
                return (
                    <Clock3 className="h-4 w-4 text-yellow-600" />
                );

            case "failed":
            case "cancelled":
            case "canceled":
                return (
                    <XCircle className="h-4 w-4 text-red-600" />
                );

            default:
                return (
                    <Clock3 className="h-4 w-4 text-gray-500" />
                );
        }
    };

    const getStatusClass = (status: string): string => {
        switch (status.toLowerCase()) {
            case "completed":
            case "succeeded":
            case "paid":
                return "bg-green-50 text-green-700";

            case "pending":
                return "bg-yellow-50 text-yellow-700";

            case "failed":
            case "cancelled":
            case "canceled":
                return "bg-red-50 text-red-700";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-7xl">

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                                Payments
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                View and manage your organization payments.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!error && payments.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                        <CreditCard className="mx-auto h-10 w-10 text-gray-400" />

                        <h2 className="mt-4 text-base font-medium text-gray-900">
                            No payments
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            There are no payments for this organization yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Payment
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Amount
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {payments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-mono text-xs text-gray-500">
                                                    {payment.id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {payment.customer_name ?? "-"}
                                                </p>

                                                {payment.customer_email && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {payment.customer_email}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatAmount(
                                                        payment.amount,
                                                        payment.currency
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline - flex items - center gap - 1.5 rounded - full px - 2.5 py - 1 text - xs font - medium capitalize ${getStatusClass(
                                                        payment.status
                                                    )
                                                        } `}
                                                >
                                                    {getStatusIcon(payment.status)}
                                                    {payment.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(payment.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

// useSearchParams() needs a Suspense boundary in the static export.
export default function PaymentsPage() {
  return (
    <Suspense fallback={null}>
      <PaymentsPageContent />
    </Suspense>
  );
}
