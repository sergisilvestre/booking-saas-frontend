"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CalendarClock, CalendarDays, Clock3, ExternalLink, Tags, Users, Wallet } from "lucide-react";

import { api, formatDateTime, formatInstant, formatMoney } from "@/lib/panel";
import type { Billing, Booking } from "@/lib/panel-types";
import { Card, EmptyState, ErrorBox, PageHeader, Spinner, StatusBadge } from "./ui";

type Summary = {
  organization: { id: string; name: string; slug: string; timezone: string };
  stats: {
    today: number;
    next7Days: number;
    pending: number;
    customers: number;
    activeEventTypes: number;
    revenueThisMonth: number;
  };
  upcoming: Booking[];
  billing: Billing;
};

export default function DashboardHome() {
  const t = useTranslations("panel");
  const locale = useLocale();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    api<Summary>("organization/dashboard")
      .then(setSummary)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  if (error) return <ErrorBox message={error} onRetry={load} retryLabel={t("common.retry")} />;
  if (!summary) return <Spinner label={t("common.loading")} />;

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${locale}/${summary.organization.slug}` : "";
  const firstService = summary.upcoming[0]?.eventType?.slug;

  const stats = [
    { key: "today", value: summary.stats.today, icon: CalendarDays },
    { key: "next7Days", value: summary.stats.next7Days, icon: CalendarClock },
    { key: "pending", value: summary.stats.pending, icon: Clock3 },
    { key: "customers", value: summary.stats.customers, icon: Users },
    { key: "activeEventTypes", value: summary.stats.activeEventTypes, icon: Tags },
    { key: "revenueThisMonth", value: formatMoney(summary.stats.revenueThisMonth, "EUR", locale), icon: Wallet },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader title={t("home.title", { name: summary.organization.name })} subtitle={t("home.subtitle", { timezone: summary.organization.timezone })} />

      <BillingBanner billing={summary.billing} locale={locale} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ key, value, icon: Icon }) => (
          <Card key={key} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{t(`home.stats.${key}`)}</p>
              <Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900">{t("home.upcoming")}</h3>
            <Link href={`/${locale}/dashboard/bookings`} className="text-sm font-medium text-gray-600 hover:text-gray-900">
              {t("home.seeAll")}
            </Link>
          </div>
          {summary.upcoming.length === 0 ? (
            <EmptyState title={t("home.noUpcoming")} description={t("home.noUpcomingHint")} />
          ) : (
            <ul className="divide-y divide-gray-100">
              {summary.upcoming.map((booking) => (
                <li key={booking.id} className="flex items-center justify-between gap-4 px-6 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{booking.customer?.name ?? "—"}</p>
                    <p className="truncate text-xs text-gray-500">{booking.eventType?.name}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm text-gray-700">{formatDateTime(booking.startAt, locale)}</span>
                    <StatusBadge status={booking.status} label={t(`bookingStatus.${booking.status}`)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900">{t("home.publicPage")}</h3>
          <p className="mt-1 text-sm text-gray-500">{t("home.publicPageHint")}</p>
          <a
            href={firstService ? `${publicUrl}/${firstService}` : publicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex max-w-full items-center gap-2 break-all rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            {publicUrl}
          </a>
          <div className="mt-6 space-y-2 text-sm">
            <Link className="block text-gray-600 hover:text-gray-900" href={`/${locale}/dashboard/event-types`}>
              → {t("home.links.eventTypes")}
            </Link>
            <Link className="block text-gray-600 hover:text-gray-900" href={`/${locale}/dashboard/availability`}>
              → {t("home.links.availability")}
            </Link>
          </div>
          {summary.billing.trialEndsAt && summary.billing.onTrial && (
            <p className="mt-6 text-xs text-gray-400">{t("home.trialUntil", { date: formatInstant(summary.billing.trialEndsAt, locale) })}</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export function BillingBanner({ billing, locale }: { billing: Billing; locale: string }) {
  const t = useTranslations("panel");

  if (billing.state === "active" && !billing.cancelAtPeriodEnd) return null;

  const tone =
    billing.state === "trial" && billing.trialDaysLeft > 7
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  const message =
    billing.state === "trial"
      ? t("billing.banner.trial", { days: billing.trialDaysLeft })
      : billing.state === "active"
        ? t("billing.banner.cancelling", { date: formatInstant(billing.currentPeriodEnd, locale) })
        : billing.state === "inactive"
          ? t("billing.banner.inactive")
          : t("billing.banner.expired");

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${tone}`}>
      <span>{message}</span>
      {billing.state !== "inactive" && (
        <Link href={`/${locale}/dashboard/subscription`} className="font-semibold underline">
          {t("billing.banner.cta")}
        </Link>
      )}
    </div>
  );
}
