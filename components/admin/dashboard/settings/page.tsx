"use client";

import { useState } from "react";
import {
    User,
    Shield,
    Save,
    Loader2,
    CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSaving(true);
        setSuccess(false);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

            if (!apiUrl) {
                throw new Error("NEXT_PUBLIC_API_URL is not configured");
            }

            const response = await fetch(`${apiUrl}/api/admin/profile`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    email,
                }),
            });

            if (!response.ok) {
                throw new Error("Unable to update profile");
            }

            setSuccess(true);
        } catch {
            setError("Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Settings
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage your Super Admin account and platform settings.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <User className="h-5 w-5 text-gray-600" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Profile
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Update your administrator account information.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5 px-6 py-6">
                                {success && (
                                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Profile updated successfully.
                                    </div>
                                )}

                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        placeholder="Your name"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}

                                    {saving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Role */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <Shield className="h-5 w-5 text-gray-600" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Access
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Information about your platform permissions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Account role
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Your account has full platform administration access.
                                    </p>
                                </div>

                                <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                                    Super Admin
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}