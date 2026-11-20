import DashboardAuthGuard from "@/components/admin/dashboard/DashboardAuthGuard";
import DashboardSidebar from "@/components/admin/dashboard/DashboardSidebar";

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({
    children,
}: Props) {
    return (
        <DashboardAuthGuard>
            <div className="min-h-screen bg-gray-50">
                <div className="flex min-h-screen">
                    <DashboardSidebar />

                    <main className="flex-1">
                        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </DashboardAuthGuard>
    );
}