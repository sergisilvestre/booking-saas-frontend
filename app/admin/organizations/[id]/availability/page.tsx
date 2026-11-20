"use client";

import { useEffect, useState } from "react";
import {
    CalendarClock,
    Loader2,
    Plus,
    Clock,
    Trash2,
} from "lucide-react";

type AvailabilityRule = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export default function AvailabilityPage() {
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [rules, setRules] = useState<AvailabilityRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("organization_id");

        if (!id) {
            setError("No organization selected.");
            setLoading(false);
            return;
        }

        setOrganizationId(id);
    }, []);

    useEffect(() => {
        if (!organizationId) {
            return;
        }

        const loadAvailability = async () => {
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

                if (!apiUrl) {
                    throw new Error("NEXT_PUBLIC_API_URL is not configured");
                }

                const response = await fetch(
                    `${apiUrl}/api/organization/${organizationId}/availability`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load availability");
                }

                const result = await response.json();

                setRules(
                    Array.isArray(result)
                        ? result
                        : result.data ?? []
                );
            } catch {
                setError("Unable to load availability.");
            } finally {
                setLoading(false);
            }
        };

        loadAvailability();
    }, [organizationId]);

    const deleteRule = async (ruleId: string) => {
        if (!organizationId) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

            if (!apiUrl) {
                throw new Error("NEXT_PUBLIC_API_URL is not configured");
            }

            const response = await fetch(
                `${apiUrl}/api/organization/${organizationId}/availability/${ruleId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Unable to delete availability rule");
            }

            setRules((current) =>
                current.filter((rule) => rule.id !== ruleId)
            );
        } catch {
            setError("Unable to delete availability rule.");
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
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-4xl">

                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200">
                                <CalendarClock className="h-5 w-5 text-gray-600" />
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                                Availability
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Configure when your organization is available for bookings.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4" />
                        Add availability
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {rules.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                        <Clock className="mx-auto h-10 w-10 text-gray-400" />

                        <h2 className="mt-4 text-base font-medium text-gray-900">
                            No availability configured
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Add your organization's available hours to start accepting
                            bookings.
                        </p>

                        <button
                            type="button"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            <Plus className="h-4 w-4" />
                            Add availability
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="divide-y divide-gray-100">
                            {rules.map((rule) => (
                                <div
                                    key={rule.id}
                                    className="flex items-center justify-between px-6 py-5"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {daysOfWeek[rule.dayOfWeek]}
                                        </p>

                                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {rule.startTime} – {rule.endTime}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => deleteRule(rule.id)}
                                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                        aria-label="Delete availability"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
