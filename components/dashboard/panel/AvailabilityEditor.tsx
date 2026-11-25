"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";

import { useCan } from "@/hooks/useCan";
import { ApiError, api, formatDate } from "@/lib/panel";
import type { AvailabilityException, AvailabilityRule, EventType } from "@/lib/panel-types";
import { Badge, Button, Card, EmptyState, ErrorBox, Field, PageHeader, Spinner, inputClass } from "./ui";

type Range = { start: string; end: string };
type Week = Record<number, Range[]>;

const DAYS = [1, 2, 3, 4, 5, 6, 7];

function toWeek(rules: AvailabilityRule[]): Week {
  const week: Week = Object.fromEntries(DAYS.map((d) => [d, []]));
  rules.forEach((rule) => week[rule.dayOfWeek]?.push({ start: rule.startTime, end: rule.endTime }));
  return week;
}

export default function AvailabilityEditor() {
  const t = useTranslations("panel");
  const locale = useLocale();
  const can = useCan();
  const editable = can("availability.update");

  const [week, setWeek] = useState<Week | null>(null);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(() => {
    setError(null);
    api<{ data: AvailabilityRule[]; exceptions: AvailabilityException[] }>("organization/availability")
      .then((r) => {
        setWeek(toWeek(r.data));
        setExceptions(r.exceptions);
      })
      .catch((e: Error) => setError(e.message));
    api<{ data: EventType[] }>("organization/event-types").then((r) => setEventTypes(r.data)).catch(() => {});
  }, []);

  useEffect(load, [load]);

  const dayName = (day: number) =>
    // 2024-01-01 was a Monday.
    new Date(2024, 0, day).toLocaleDateString(locale, { weekday: "long" });

  function update(day: number, change: (ranges: Range[]) => Range[]) {
    setWeek((current) => current && { ...current, [day]: change(current[day]) });
    setSaveMessage(null);
  }

  async function save() {
    if (!week) return;
    setSaving(true);
    setSaveMessage(null);

    try {
      const rules = DAYS.flatMap((day) => week[day].map((r) => ({ day_of_week: day, start_time: r.start, end_time: r.end })));
      const result = await api<{ data: AvailabilityRule[] }>("organization/availability/week", { method: "PUT", body: { rules } });
      setWeek(toWeek(result.data));
      setSaveMessage({ ok: true, text: t("availability.saved") });
    } catch (e) {
      const message = e instanceof ApiError ? Object.values(e.fieldErrors())[0] || e.message : (e as Error).message;
      setSaveMessage({ ok: false, text: message });
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorBox message={error} onRetry={load} retryLabel={t("common.retry")} />;
  if (!week) return <Spinner label={t("common.loading")} />;

  return (
    <div className="space-y-8">
      <PageHeader title={t("availability.title")} subtitle={t("availability.subtitle")} />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t("availability.weekly")}</h3>
            <p className="text-xs text-gray-500">{t("availability.weeklyHint")}</p>
          </div>
          {editable && (
            <div className="flex items-center gap-3">
              {saveMessage && (
                <span className={`text-sm ${saveMessage.ok ? "text-emerald-700" : "text-red-600"}`} role="status">
                  {saveMessage.text}
                </span>
              )}
              <Button onClick={save} loading={saving}>
                {t("common.save")}
              </Button>
            </div>
          )}
        </div>

        <ul className="divide-y divide-gray-100">
          {DAYS.map((day) => (
            <li key={day} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-start">
              <div className="w-36 shrink-0 pt-2 text-sm font-medium capitalize text-gray-900">{dayName(day)}</div>
              <div className="flex-1 space-y-2">
                {week[day].length === 0 && <p className="pt-2 text-sm text-gray-400">{t("availability.closed")}</p>}
                {week[day].map((range, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={range.start}
                      disabled={!editable}
                      onChange={(e) => update(day, (rs) => rs.map((r, i) => (i === index ? { ...r, start: e.target.value } : r)))}
                      className={`${inputClass} w-32`}
                      aria-label={t("availability.from")}
                    />
                    <span className="text-gray-400">–</span>
                    <input
                      type="time"
                      value={range.end}
                      disabled={!editable}
                      onChange={(e) => update(day, (rs) => rs.map((r, i) => (i === index ? { ...r, end: e.target.value } : r)))}
                      className={`${inputClass} w-32`}
                      aria-label={t("availability.to")}
                    />
                    {editable && (
                      <button
                        type="button"
                        onClick={() => update(day, (rs) => rs.filter((_, i) => i !== index))}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                        aria-label={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {editable && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => update(day, (rs) => [...rs, rs.length ? { start: rs[rs.length - 1].end, end: "20:00" } : { start: "09:00", end: "14:00" }])}
                  >
                    <Plus className="h-3.5 w-3.5" /> {t("availability.addRange")}
                  </Button>
                  {day > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => update(day, () => week[day - 1].map((r) => ({ ...r })))}>
                      {t("availability.copyPrevious")}
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <ExceptionsCard exceptions={exceptions} eventTypes={eventTypes} onChange={setExceptions} editable={can("availability.create")} locale={locale} />
    </div>
  );
}

function ExceptionsCard({
  exceptions,
  eventTypes,
  onChange,
  editable,
  locale,
}: {
  exceptions: AvailabilityException[];
  eventTypes: EventType[];
  onChange: (exceptions: AvailabilityException[]) => void;
  editable: boolean;
  locale: string;
}) {
  const t = useTranslations("panel");
  const [form, setForm] = useState({ date: "", allDay: true, start: "09:00", end: "14:00", reason: "", eventTypeId: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setSaving(true);

    try {
      const created = await api<AvailabilityException>("organization/availability/exceptions", {
        method: "POST",
        body: {
          date: form.date,
          start_time: form.allDay ? null : form.start,
          end_time: form.allDay ? null : form.end,
          reason: form.reason || null,
          event_type_id: form.eventTypeId || null,
        },
      });
      onChange([...exceptions, created].sort((a, b) => a.date.localeCompare(b.date)));
      setForm((f) => ({ ...f, date: "", reason: "" }));
    } catch (e) {
      setErrors(e instanceof ApiError ? e.fieldErrors() : { date: (e as Error).message });
    } finally {
      setSaving(false);
    }
  }

  async function remove(exception: AvailabilityException) {
    await api(`organization/availability/exceptions/${exception.id}`, { method: "DELETE" });
    onChange(exceptions.filter((e) => e.id !== exception.id));
  }

  const serviceName = (id: string | null) => (id ? eventTypes.find((e) => e.id === id)?.name ?? "—" : t("availability.allServices"));

  return (
    <Card>
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-900">{t("availability.exceptions")}</h3>
        <p className="text-xs text-gray-500">{t("availability.exceptionsHint")}</p>
      </div>

      {editable && (
        <form onSubmit={add} className="grid gap-3 border-b border-gray-100 px-6 py-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
          <Field label={t("bookings.form.date")} error={errors.date}>
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.allDay} onChange={(e) => setForm({ ...form, allDay: e.target.checked })} />
            {t("availability.allDay")}
          </label>
          {!form.allDay && (
            <div className="flex items-end gap-2 lg:col-span-1">
              <Field label={t("availability.from")} error={errors.start_time}>
                <input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className={inputClass} />
              </Field>
              <Field label={t("availability.to")} error={errors.end_time}>
                <input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className={inputClass} />
              </Field>
            </div>
          )}
          <Field label={t("availability.service")} error={errors.event_type_id}>
            <select value={form.eventTypeId} onChange={(e) => setForm({ ...form, eventTypeId: e.target.value })} className={inputClass}>
              <option value="">{t("availability.allServices")}</option>
              {eventTypes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("availability.reason")} error={errors.reason}>
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className={inputClass} placeholder={t("availability.reasonPlaceholder")} />
          </Field>
          <Button type="submit" loading={saving}>
            {t("availability.addException")}
          </Button>
        </form>
      )}

      {exceptions.length === 0 ? (
        <EmptyState title={t("availability.noExceptions")} />
      ) : (
        <ul className="divide-y divide-gray-100">
          {exceptions.map((exception) => (
            <li key={exception.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-medium text-gray-900">{formatDate(exception.date, locale)}</span>
                {exception.startTime ? (
                  <Badge tone="amber">
                    {exception.startTime}–{exception.endTime}
                  </Badge>
                ) : (
                  <Badge tone="red">{t("availability.closedAllDay")}</Badge>
                )}
                <span className="text-gray-500">{serviceName(exception.eventTypeId)}</span>
                {exception.reason && <span className="text-gray-500">· {exception.reason}</span>}
              </div>
              {editable && (
                <button type="button" onClick={() => remove(exception)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600" aria-label={t("common.delete")}>
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
