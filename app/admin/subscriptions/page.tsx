"use client";

import { MoreHorizontal, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SubscriptionStatus =
    | "active"
    | "trialing"
    | "past_due"
    | "cancelled";

type Subscription = {
    id: string;
    organization: {
        id: string;
        name: string;
        email?: string;
    };
    plan: {
        id: string;
        name: string;
        slug: string;
    };
    amount: number;
    currency: string;
    interval: "month" | "year";
    status: SubscriptionStatus;
    started_at: string;
    current_period_end: string;
    stripe_subscription_id: string;
};

type SubscriptionResponse = {
    data: Subscription[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

const statusLabels: Record<SubscriptionStatus, string> = {
    active: "Active",
    trialing: "Trialing",
    past_due: "Past due",
    cancelled: "Cancelled",
};

const statusStyles: Record<SubscriptionStatus, string> = {
    active: "bg-green-50 text-green-700",
    trialing: "bg-blue-50 text-blue-700",
    past_due: "bg-red-50 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function formatAmount(
    amount: number,
    currency: string,
    interval: "month" | "year"
) {
    const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
    }).format(amount);

    return `${formatted}/${interval === "month" ? "mo" : "yr"}`;
}

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"all" | SubscriptionStatus>(
        "all"
    );

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${apiUrl}/api/admin/subscriptions`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load subscriptions."
                    );
                }

                const result: SubscriptionResponse =
                    await response.json();

                setSubscriptions(result.data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load subscriptions."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [apiUrl]);

    const filteredSubscriptions = useMemo(() => {
        const value = search.toLowerCase().trim();

        return subscriptions.filter((subscription) => {
            const matchesSearch =
                !value ||
                subscription.organization.name
                    .toLowerCase()
                    .includes(value) ||
                subscription.organization.email
                    ?.toLowerCase()
                    .includes(value) ||
                subscription.plan.name
                    .toLowerCase()
                    .includes(value);

            const matchesStatus =
                status === "all" ||
                subscription.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [subscriptions, search, status]);

    const stats = useMemo(() => {
        return {
            total: subscriptions.length,
            active: subscriptions.filter(
                (item) => item.status === "active"
            ).length,
            trialing: subscriptions.filter(
                (item) => item.status === "trialing"
            ).length,
            pastDue: subscriptions.filter(
                (item) => item.status === "past_due"
            ).length,
        };
    }, [subscriptions]);

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Subscriptions
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage organization subscriptions and
                            billing status.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total"
                        value={stats.total}
                    />

                    <StatCard
                        label="Active"
                        value={stats.active}
                    />

                    <StatCard
                        label="Trialing"
                        value={stats.trialing}
                    />

                    <StatCard
                        label="Past due"
                        value={stats.pastDue}
                    />
                </div>

                {/* Filters */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search organization or plan..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value as
                                | "all"
                                | SubscriptionStatus
                            )
                        }
                        className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    >
                        <option value="all">All statuses</option>
                        <option value="active">Active</option>
                        <option value="trialing">Trialing</option>
                        <option value="past_due">Past due</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500">
                                        Organization
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-500">
                                        Plan
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-500">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-500">
                                        Started
                                    </th>

                                    <th className="px-6 py-4 font-medium text-gray-500">
                                        Renewal
                                    </th>

                                    <th className="w-12 px-4 py-4" />
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            Loading subscriptions...
                                        </td>
                                    </tr>
                                ) : filteredSubscriptions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center"
                                        >
                                            <p className="font-medium text-gray-900">
                                                No subscriptions found
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Try changing your search
                                                or filters.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubscriptions.map(
                                        (subscription) => (
                                            <tr
                                                key={subscription.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                subscription
                                                                    .organization
                                                                    .name
                                                            }
                                                        </p>

                                                        {subscription
                                                            .organization
                                                            .email && (
                                                                <p className="mt-0.5 text-xs text-gray-500">
                                                                    {
                                                                        subscription
                                                                            .organization
                                                                            .email
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">
                                                        {
                                                            subscription
                                                                .plan
                                                                .name
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-gray-700">
                                                    {formatAmount(
                                                        subscription.amount,
                                                        subscription.currency,
                                                        subscription.interval
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[subscription.status]}`}
                                                    >
                                                        {
                                                            statusLabels[
                                                            subscription
                                                                .status
                                                            ]
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {formatDate(
                                                        subscription.started_at
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {formatDate(
                                                        subscription.current_period_end
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <button
                                                        type="button"
                                                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                                    >
                                                        <MoreHorizontal
                                                            size={18}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{label}</p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}