"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Globe,
  Clock,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  name: string;
  slug: string;
  role: string;
  timezone?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
};

const organizationTabs = [
  {
    label: "Customers",
    path: "customers",
  },
  {
    label: "Payments",
    path: "payments",
  },
  {
    label: "Bookings",
    path: "bookings",
  },
  {
    label: "Availability",
    path: "availability",
  },
  {
    label: "Members",
    path: "members",
  },
];

export function OrganizationsPage() {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(
          `${apiUrl}/api/admin/organization`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load organizations");
        }

        const result = await response.json();

        setOrganizations(
          Array.isArray(result)
            ? result
            : result.data ?? []
        );
      } catch {
        setError("Unable to load your organizations.");
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return organizations;
    }

    return organizations.filter((organization) => {
      return (
        organization.name.toLowerCase().includes(query) ||
        organization.slug.toLowerCase().includes(query)
      );
    });
  }, [organizations, search]);

  const selectOrganization = (
    organization: Organization
  ) => {
    setSelectedOrganization(organization);
  };

  const openDashboard = () => {
    if (!selectedOrganization) {
      return;
    }

    localStorage.setItem(
      "organization_id",
      selectedOrganization.id
    );

    router.push(
      `/admin/organizations/${selectedOrganization.id}`
    );
  };

  const openTab = (path: string) => {
    if (!selectedOrganization) {
      return;
    }

    const organizationId = selectedOrganization.id;

    localStorage.setItem(
      "organization_id",
      organizationId
    );

    router.push(
      `/admin/organizations/${organizationId}/${path}`
    );
  };

  const clearSearch = () => {
    setSearch("");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </main>
    );
  }

  if (selectedOrganization) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">

          <button
            type="button"
            onClick={() => setSelectedOrganization(null)}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to organizations
          </button>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

            {/* Organization header */}
            <div className="border-b border-gray-200 px-6 py-8">
              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Building2 className="h-7 w-7 text-gray-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {selectedOrganization.name}
                    </h1>

                    {selectedOrganization.role && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                        {selectedOrganization.role}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedOrganization.slug}
                  </p>
                </div>

              </div>
            </div>

            {/* Organization tabs */}
            <div className="border-b border-gray-200 px-6">
              <nav className="flex gap-6 overflow-x-auto">
                {organizationTabs.map((tab) => (
                  <button
                    key={tab.path}
                    type="button"
                    onClick={() => openTab(tab.path)}
                    className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 transition hover:border-gray-900 hover:text-gray-900"
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Organization information */}
            <div className="divide-y divide-gray-100">

              {selectedOrganization.email && (
                <div className="flex items-center gap-4 px-6 py-4">
                  <Mail className="h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrganization.email}
                    </p>
                  </div>
                </div>
              )}

              {selectedOrganization.phone && (
                <div className="flex items-center gap-4 px-6 py-4">
                  <Phone className="h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrganization.phone}
                    </p>
                  </div>
                </div>
              )}

              {selectedOrganization.website && (
                <div className="flex items-center gap-4 px-6 py-4">
                  <Globe className="h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-500">
                      Website
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrganization.website}
                    </p>
                  </div>
                </div>
              )}

              {selectedOrganization.address && (
                <div className="flex items-center gap-4 px-6 py-4">
                  <MapPin className="h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-500">
                      Address
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrganization.address}
                    </p>
                  </div>
                </div>
              )}

              {selectedOrganization.timezone && (
                <div className="flex items-center gap-4 px-6 py-4">
                  <Clock className="h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-500">
                      Timezone
                    </p>

                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrganization.timezone}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Dashboard button */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
              <button
                type="button"
                onClick={openDashboard}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Your organizations
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Select an organization to continue.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search */}
        {organizations.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search organizations..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {organizations.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <Building2 className="mx-auto h-10 w-10 text-gray-400" />

            <h2 className="mt-4 text-base font-medium text-gray-900">
              No organizations
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You don't belong to any organization yet.
            </p>
          </div>

        ) : filteredOrganizations.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-400" />

            <h2 className="mt-4 text-base font-medium text-gray-900">
              No organizations found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try searching with another organization name or slug.
            </p>

            <button
              type="button"
              onClick={clearSearch}
              className="mt-5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Clear search
            </button>
          </div>

        ) : (

          <div className="space-y-3">
            {filteredOrganizations.map((organization) => (
              <button
                key={organization.id}
                type="button"
                onClick={() =>
                  selectOrganization(organization)
                }
                className="group flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-gray-900">
                    {organization.name}
                  </h2>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {organization.slug}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {organization.role && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                      {organization.role}
                    </span>
                  )}

                  <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-900" />
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}