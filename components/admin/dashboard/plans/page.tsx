"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";

type PlanFeature = {
    slug: string;
    name: string;
};

type SubscriptionPlan = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency: string;
    interval: string;
    features: PlanFeature[];
};

export default function PlansPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

                if (!apiUrl) {
                    throw new Error("NEXT_PUBLIC_API_URL is not configured");
                }

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${apiUrl} /api/subscription / plans`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token} `,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load subscription plans");
                }

                const result = await response.json();

                setPlans(
                    Array.isArray(result)
                        ? result
                        : result.data ?? []
                );
            } catch {
                setError("Unable to load subscription plans.");
            } finally {
                setLoading(false);
            }
        };

        loadPlans();

    }, []);

    const formatPrice = (plan: SubscriptionPlan) => {
        if (plan.price === 0) {
            return "Free";
        }

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: plan.currency || "EUR",
            minimumFractionDigits: 0,
        }).format(plan.price / 100);

    };

    if (loading) {
        return (<main className="flex min-h-screen items-center justify-center"> <Loader2 className="h-6 w-6 animate-spin text-gray-500" /> </main>
        );
    }

    return (<main className="min-h-screen bg-gray-50 px-4 py-12"> <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center" >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900">
                <Sparkles className="h-6 w-6 text-white" />
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900">
                Plans
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
                Choose the plan that best fits your organization.
            </p>
        </div >

        {error && (
            <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
        )
        }

        {
            plans.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                    <Sparkles className="mx-auto h-10 w-10 text-gray-400" />

                    <h2 className="mt-4 text-base font-medium text-gray-900">
                        No plans available
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        There are currently no subscription plans available.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
                        >
                            <div className="border-b border-gray-100 px-6 py-7">

                                <h2 className="text-lg font-semibold text-gray-900">
                                    {plan.name}
                                </h2>

                                {plan.description && (
                                    <p className="mt-2 min-h-10 text-sm text-gray-500">
                                        {plan.description}
                                    </p>
                                )}

                                <div className="mt-6 flex items-end gap-1">
                                    <span className="text-3xl font-semibold tracking-tight text-gray-900">
                                        {formatPrice(plan)}
                                    </span>

                                    {plan.price > 0 && (
                                        <span className="mb-1 text-sm text-gray-500">
                                            / {plan.interval}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col px-6 py-6">

                                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    What's included
                                </p>

                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature.slug}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                                <Check className="h-3 w-3 text-gray-700" />
                                            </span>

                                            <span className="text-sm text-gray-700">
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    className="mt-auto pt-8"
                                >
                                    <span
                                        className={`flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition ${plan.price === 0
                                            ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                                            : "bg-gray-900 text-white hover:bg-gray-800"
                                            }`}
                                    >
                                        {plan.price === 0
                                            ? "Current plan"
                                            : "Choose plan"}
                                    </span>
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    </div >
    </main >
    );
}
