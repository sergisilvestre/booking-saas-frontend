"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { apiFetch } from "@/lib/api";

type SubscriptionPlanFeature = {
  key: string;
  name: string;
  sortOrder: number;
};

type SubscriptionPlan = {
  id: string;
  slug: string;
  name: string | null;
  description: string | null;
  price: {
    amount: number;
    currency: string;
  };
  interval: string;
  active: boolean;
  features: SubscriptionPlanFeature[];
};

type SubscriptionPlansResponse = {
  data: SubscriptionPlan[];
};

/**
 * Pricing cards. Loaded in the browser so the static homepage always shows
 * the current plans without rebuilding the site.
 */
export default function PricingPlans({ lang }: { lang: string }) {
  const t = useTranslations("home");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    let cancelled = false;

    apiFetch(`public/plans?locale=${encodeURIComponent(lang)}`, {
      auth: false,
      showLoading: false,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription plans: ${response.status}`);
        }
        const result: SubscriptionPlansResponse = await response.json();
        if (!cancelled) setPlans(result.data);
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = plan.price.amount / 100;
            const highlighted = plan.slug === "pro";

            const sortedFeatures = [...plan.features].sort(
              (a, b) => a.sortOrder - b.sortOrder
            );

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 ${highlighted
                    ? "border-gray-900 shadow-xl"
                    : "border-gray-200"
                  }`}
              >
                {highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-1 text-xs font-semibold text-white">
                    {t("pricing.mostPopular")}
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>

                <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-600">
                  {plan.description}
                </p>

                <div className="mt-8">
                  <span className="text-4xl font-bold tracking-tight">
                    {price}
                    {plan.price.currency === "EUR"
                      ? "€"
                      : ` ${plan.price.currency}`}
                  </span>

                  <span className="ml-1 text-sm text-gray-500">
                    {t("pricing.perMonth")}
                  </span>
                </div>

                <Link
                  href={`/${lang}/auth/register`}
                  className={`mt-8 rounded-xl px-5 py-3 text-center text-sm font-semibold transition ${highlighted
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {price === 0
                    ? t("pricing.startFree")
                    : t("pricing.startNow")}
                </Link>

                <div className="my-8 border-t border-gray-100" />

                <ul className="space-y-4">
                  {sortedFeatures.map((feature) => (
                    <li
                      key={feature.key}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <span className="mt-0.5 font-semibold text-gray-900">
                        ✓
                      </span>

                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
  );
}
