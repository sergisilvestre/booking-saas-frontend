"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";

import { useCan } from "@/hooks/useCan";
import { ApiError, api, formatDateTime, formatMoney, toDateKey, type Paginated } from "@/lib/panel";
import type { Booking, Customer, EventType } from "@/lib/panel-types";
import { Button, Card, EmptyState, ErrorBox, Field, Modal, PageHeader, Pagination, Spinner, StatusBadge, inputClass } from "./ui";

type Range = "upcoming" | "past" | "all";

export default function BookingsManager() {
  const t = useTranslations("panel");
  const locale = useLocale();
  const can = useCan();

  const [range, setRange] = useState<Range>("upcoming");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Paginated<Booking> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setError(null);
    const today = toDateKey(new Date());

    api<Paginated<Booking>>("organization/bookings", {
      query: {
        status,
        search: search.trim(),
        page,
        per_page: 25,
        from: range === "upcoming" ? today : undefined,
        to: range === "past" ? today : undefined,
      },
    })
      .then(setResult)
      .catch((e: Error) => setError(e.message));
  }, [range, status, search, page]);

  useEffect(() => {
    const timer = window.setTimeout(load, search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [load, search]);

  async function act(booking: Booking, action: "confirm" | "cancel" | "complete") {
    if (action === "cancel" && !window.confirm(t("bookings.confirmCancel"))) return;

    setBusyId(booking.id);
    try {
      const updated = await api<Booking>(`organization/bookings/${booking.id}/${action}`, { method: "POST", body: {} });
      setResult((current) => current && { ...current, data: current.data.map((b) => (b.id === updated.id ? updated : b)) });
      setSelected((current) => (current?.id === updated.id ? updated : current));
    } catch (e) {
      window.alert((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  const actions = (booking: Booking) => (
    <div className="flex justify-end gap-2">
      {booking.status === "pending" && can("bookings.update") && !booking.payment && (
        <Button size="sm" onClick={() => act(booking, "confirm")} loading={busyId === booking.id}>
          {t("bookings.actions.confirm")}
        </Button>
      )}
      {booking.status === "confirmed" && can("bookings.update") && (
        <Button size="sm" variant="secondary" onClick={() => act(booking, "complete")} loading={busyId === booking.id}>
          {t("bookings.actions.complete")}
        </Button>
      )}
      {(booking.status === "pending" || booking.status === "confirmed") && can("bookings.cancel") && (
        <Button size="sm" variant="danger" onClick={() => act(booking, "cancel")} disabled={busyId === booking.id}>
          {t("bookings.actions.cancel")}
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader
        title={t("bookings.title")}
        subtitle={t("bookings.subtitle")}
        action={can("bookings.create") && <Button onClick={() => setCreating(true)}>{t("bookings.new")}</Button>}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-4">
          <div className="flex rounded-lg border border-gray-200 p-0.5">
            {(["upcoming", "past", "all"] as Range[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setRange(value);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${range === value ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                {t(`bookings.range.${value}`)}
              </button>
            ))}
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={`${inputClass} w-auto`}
            aria-label={t("bookings.table.status")}
          >
            <option value="">{t("bookings.allStatuses")}</option>
            {["pending", "confirmed", "cancelled", "completed"].map((s) => (
              <option key={s} value={s}>
                {t(`bookingStatus.${s}`)}
              </option>
            ))}
          </select>

          <div className="relative ml-auto w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("bookings.search")}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {error ? (
          <div className="p-6">
            <ErrorBox message={error} onRetry={load} retryLabel={t("common.retry")} />
          </div>
        ) : !result ? (
          <Spinner label={t("common.loading")} />
        ) : result.data.length === 0 ? (
          <EmptyState title={t("bookings.empty")} description={t("bookings.emptyHint")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3">{t("bookings.table.date")}</th>
                  <th className="px-6 py-3">{t("bookings.table.customer")}</th>
                  <th className="px-6 py-3">{t("bookings.table.service")}</th>
                  <th className="px-6 py-3">{t("bookings.table.status")}</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.data.map((booking) => (
                  <tr key={booking.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelected(booking)}>
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{formatDateTime(booking.startAt, locale)}</td>
                    <td className="px-6 py-3">
                      <p className="text-gray-900">{booking.customer?.name ?? "—"}</p>
                      <p className="text-xs text-gray-500">{booking.customer?.email}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{booking.eventType?.name}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={booking.status} label={t(`bookingStatus.${booking.status}`)} />
                    </td>
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      {actions(booking)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={result.meta.current_page}
              lastPage={result.meta.last_page}
              onChange={setPage}
              previousLabel={t("common.previous")}
              nextLabel={t("common.next")}
            />
          </div>
        )}
      </Card>

      {selected && (
        <Modal title={t("bookings.detail")} onClose={() => setSelected(null)}>
          <dl className="space-y-3 text-sm">
            <Row label={t("bookings.table.date")} value={`${formatDateTime(selected.startAt, locale)} – ${selected.endAt.slice(11, 16)} (${selected.timezone})`} />
            <Row label={t("bookings.table.customer")} value={[selected.customer?.name, selected.customer?.email, selected.customer?.phone].filter(Boolean).join(" · ")} />
            <Row label={t("bookings.table.service")} value={selected.eventType?.name ?? "—"} />
            <Row label={t("bookings.table.status")} value={t(`bookingStatus.${selected.status}`)} />
            <Row label={t("bookings.source")} value={t(`bookings.sources.${selected.source}`)} />
            {selected.payment && (
              <Row label={t("bookings.payment")} value={`${formatMoney(selected.payment.amount, selected.payment.currency, locale)} · ${selected.payment.status}`} />
            )}
            {selected.notes && <Row label={t("bookings.notes")} value={selected.notes} />}
            {selected.cancellationReason && <Row label={t("bookings.reason")} value={selected.cancellationReason} />}
          </dl>
          <div className="mt-6">{actions(selected)}</div>
        </Modal>
      )}

      {creating && (
        <CreateBookingModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line text-gray-900">{value || "—"}</dd>
    </div>
  );
}

/** Staff booking: pick (or add) a customer, a service, a date and a time. */
export function CreateBookingModal({
  onClose,
  onCreated,
  initialDate,
}: {
  onClose: () => void;
  onCreated: (booking: Booking) => void;
  initialDate?: string;
}) {
  const t = useTranslations("panel");
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [newCustomer, setNewCustomer] = useState(false);
  const [form, setForm] = useState({
    eventTypeId: "",
    customerId: "",
    name: "",
    email: "",
    phone: "",
    date: initialDate ?? toDateKey(new Date()),
    time: "10:00",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ data: EventType[] }>("organization/event-types").then((r) => {
      const active = r.data.filter((e) => e.isActive);
      setEventTypes(active);
      setForm((f) => ({ ...f, eventTypeId: f.eventTypeId || active[0]?.id || "" }));
    });
  }, []);

  useEffect(() => {
    if (newCustomer) return;
    const timer = window.setTimeout(() => {
      api<Paginated<Customer>>("organization/customers", { query: { search: customerSearch.trim(), per_page: 20 } })
        .then((r) => setCustomers(r.data))
        .catch(() => setCustomers([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [customerSearch, newCustomer]);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setMessage(null);
    setSaving(true);

    try {
      let customerId = form.customerId;

      if (newCustomer) {
        const customer = await api<Customer>("organization/customers", {
          method: "POST",
          body: { name: form.name, email: form.email, phone: form.phone || null },
        });
        customerId = customer.id;
      }

      if (!customerId) {
        setErrors({ customer_id: t("bookings.form.pickCustomer") });
        return;
      }

      const booking = await api<Booking>("organization/bookings", {
        method: "POST",
        body: {
          event_type_id: form.eventTypeId,
          customer_id: customerId,
          start_at: `${form.date} ${form.time}:00`,
          notes: form.notes || null,
        },
      });
      onCreated(booking);
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fieldErrors());
        setMessage(e.code === "SLOT_UNAVAILABLE" ? t("bookings.form.slotTaken") : e.message);
      } else {
        setMessage((e as Error).message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={t("bookings.new")} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t("bookings.table.service")} error={errors.event_type_id}>
          <select required value={form.eventTypeId} onChange={set("eventTypeId")} className={inputClass}>
            {eventTypes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.durationMinutes} min)
              </option>
            ))}
          </select>
        </Field>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">{t("bookings.table.customer")}</span>
            <button type="button" className="text-xs font-medium text-gray-600 underline" onClick={() => setNewCustomer((v) => !v)}>
              {newCustomer ? t("bookings.form.existingCustomer") : t("bookings.form.newCustomer")}
            </button>
          </div>
          {newCustomer ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("customers.name")} error={errors.name}>
                <input required value={form.name} onChange={set("name")} className={inputClass} />
              </Field>
              <Field label={t("customers.email")} error={errors.email}>
                <input required type="email" value={form.email} onChange={set("email")} className={inputClass} />
              </Field>
              <Field label={t("customers.phone")} error={errors.phone}>
                <input value={form.phone} onChange={set("phone")} className={inputClass} />
              </Field>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder={t("customers.search")}
                className={inputClass}
              />
              <select required value={form.customerId} onChange={set("customerId")} className={inputClass} size={Math.min(Math.max(customers.length, 2), 5)}>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.email}
                  </option>
                ))}
              </select>
              {errors.customer_id && <p className="text-xs text-red-600">{errors.customer_id}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t("bookings.form.date")} error={errors.start_at}>
            <input required type="date" value={form.date} onChange={set("date")} className={inputClass} />
          </Field>
          <Field label={t("bookings.form.time")}>
            <input required type="time" step={300} value={form.time} onChange={set("time")} className={inputClass} />
          </Field>
        </div>

        <Field label={t("bookings.notes")} error={errors.notes}>
          <textarea rows={2} value={form.notes} onChange={set("notes")} className={inputClass} />
        </Field>

        <p className="text-xs text-gray-500">{t("bookings.form.hint")}</p>
        {message && <ErrorBox message={message} />}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" loading={saving} disabled={!form.eventTypeId}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
