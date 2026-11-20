import Link from "next/link";

type Props = {
    params: Promise<{
        lang: string;
    }>;
};

export default async function DashboardPage({ params }: Props) {
    const { lang } = await params;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Welcome back. Here’s an overview of your booking activity.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardCard
                    title="Upcoming bookings"
                    value="0"
                    description="Bookings scheduled soon"
                />

                <DashboardCard
                    title="Customers"
                    value="0"
                    description="Total customers"
                />

                <DashboardCard
                    title="Event types"
                    value="0"
                    description="Active event types"
                />

                <DashboardCard
                    title="Availability"
                    value="0"
                    description="Configured availability rules"
                />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-gray-900">
                            Quick actions
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your booking system.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Link
                            href={`/${lang}/admin/event-types`}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Manage event types
                        </Link>

                        <Link
                            href={`/${lang}/admin/availability`}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Manage availability
                        </Link>

                        <Link
                            href={`/${lang}/admin/bookings`}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            View bookings
                        </Link>

                        <Link
                            href={`/${lang}/admin/settings`}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Open settings
                        </Link>
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-gray-900">
                            Recent activity
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Your latest booking activity will appear here.
                        </p>
                    </div>

                    <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400">
                            No recent activity
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function DashboardCard({
    title,
    value,
    description,
}: {
    title: string;
    value: string;
    description: string;
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-gray-400">
                {description}
            </p>
        </section>
    );
}