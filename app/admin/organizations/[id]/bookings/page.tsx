"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";

type Booking = {
    id: string;
    customer_name?: string;
    customer_email?: string;
    event_type_name?: string;
    starts_at?: string;
    ends_at?: string;
    status?: string;
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const organizationId = localStorage.getItem("organization_id");

                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

                if (!apiUrl) {
                    throw new Error("NEXT_PUBLIC_API_URL is not configured");
                }

                if (!organizationId) {
                    throw new Error("Organization is not selected");
                }

                const response = await fetch(
                    `${apiUrl}/api/organization/${organizationId}/bookings`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load bookings");
                }

                const result = await response.json();

                setBookings(
                    Array.isArray(result)
                        ? result
                        : result.data ?? []
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load bookings."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <CalendarCheck className="h-5 w-5 text-gray-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                                Bookings
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage your organization's bookings.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                        <CalendarCheck className="mx-auto h-10 w-10 text-gray-400" />

                        <h2 className="mt-4 text-base font-medium text-gray-900">
                            No bookings
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            There are no bookings for this organization yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Event
                                        </th>

                                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Time
                                        </th>

                                        <th className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.customer_name ?? "—"}
                                                </div>

                                                {booking.customer_email && (
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {booking.customer_email}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {booking.event_type_name ?? "—"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {booking.starts_at
                                                    ? new Date(
                                                        booking.starts_at
                                                    ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {booking.starts_at
                                                    ? new Date(
                                                        booking.starts_at
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "—"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {booking.status && (
                                                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                                                        {booking.status}
                                                    </span>
                                                )}
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