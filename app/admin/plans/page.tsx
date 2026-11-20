"use client";

import {
    Archive,
    Check,
    Edit,
    MoreHorizontal,
    Plus,
} from "lucide-react";

type PlanStatus = "active" | "draft" | "archived";

type Plan = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    interval: "month" | "year";
    status: PlanStatus;
    features: string[];
    stripeProductId?: string | null;
    stripePriceId?: string | null;
};

const plans: Plan[] = [
    {
        id: "1",
        name: "Free",
        slug: "free",
        description:
            "Basic booking functionality for small businesses.",
        price: 0,
        currency: "EUR",
        interval: "month",
        status: "active",
        features: [
            "Booking page",
            "Booking management",
            "Basic availability",
            "Customer management",
        ],
    },
    {
        id: "2",
        name: "Pro",
        slug: "pro",
        description:
            "Advanced tools for growing businesses.",
        price: 29,
        currency: "EUR",
        interval: "month",
        status: "active",
        features: [
            "Everything in Free",
            "Advanced availability",
            "Calendar integrations",
            "Unlimited event types",
            "Advanced analytics",
        ],
        stripeProductId: "prod_pro",
        stripePriceId: "price_pro",
    },
    {
        id: "3",
        name: "Business",
        slug: "business",
        description:
            "Complete solution for teams and larger businesses.",
        price: 79,
        currency: "EUR",
        interval: "month",
        status: "active",
        features: [
            "Everything in Pro",
            "Team management",
            "Multiple calendars",
            "Priority support",
            "Advanced analytics",
        ],
        stripeProductId: "prod_business",
        stripePriceId: "price_business",
    },
];

export default function PlansPage() {
    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                            Plans
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Manage the subscription plans available on your platform.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4" />
                        Create plan
                    </button>
                </div>

                {/* Plans */}
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                        />
                    ))}
                </div>

                {/* Plans table */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-5">
                        <h2 className="text-base font-semibold text-gray-900">
                            All plans
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage pricing and Stripe configuration.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                                        Plan
                                    </th>

                                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                                        Price
                                    </th>

                                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                                        Stripe
                                    </th>

                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>

                            <tbody>
                                {plans.map((plan) => (
                                    <tr
                                        key={plan.id}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {plan.name}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                {plan.slug}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">
                                                {plan.price === 0
                                                    ? "Free"
                                                    : `€${plan.price}`}
                                            </span>

                                            {plan.price > 0 && (
                                                <span className="ml-1 text-xs text-gray-500">
                                                    / {plan.interval}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <StatusBadge status={plan.status} />
                                        </td>

                                        <td className="px-6 py-4">
                                            {plan.stripePriceId ? (
                                                <span className="text-xs font-medium text-green-600">
                                                    Synced
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    Not configured
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    type="button"
                                                    className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                                                    title="Edit plan"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                                                    title="Archive plan"
                                                >
                                                    <Archive className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                                                    title="More actions"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    );
}

function PlanCard({
    plan,
}: {
    plan: Plan;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {plan.name}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        {plan.slug}
                    </p>
                </div>

                <StatusBadge status={plan.status} />
            </div>

            <p className="mt-4 min-h-[40px] text-sm leading-5 text-gray-500">
                {plan.description}
            </p>

            <div className="mt-6">
                <span className="text-3xl font-semibold text-gray-900">
                    {plan.price === 0
                        ? "Free"
                        : `€${plan.price}`}
                </span>

                {plan.price > 0 && (
                    <span className="ml-1 text-sm text-gray-500">
                        / {plan.interval}
                    </span>
                )}
            </div>

            <div className="my-6 border-t border-gray-100" />

            <div className="space-y-3">
                {plan.features.map((feature) => (
                    <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-gray-600"
                    >
                        <Check className="h-4 w-4 shrink-0 text-gray-400" />
                        {feature}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-2">
                <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </button>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: PlanStatus;
}) {
    const styles: Record<PlanStatus, string> = {
        active:
            "bg-green-50 text-green-700",
        draft:
            "bg-yellow-50 text-yellow-700",
        archived:
            "bg-gray-100 text-gray-600",
    };

    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
        >
            {status}
        </span>
    );
}