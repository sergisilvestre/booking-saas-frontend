"use client";

import { useParams } from "next/navigation";

export default function MembersPage() {
  const params = useParams<{ organizationId: string }>();

  const organizationId = params.organizationId;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Members
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the members of this organization.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Organization ID:
          </p>

          <p className="mt-1 font-mono text-sm text-gray-900">
            {organizationId}
          </p>
        </div>
      </div>
    </main>
  );
}