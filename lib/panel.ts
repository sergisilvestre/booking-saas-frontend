import { apiFetch } from "@/lib/api";

/** Error from the API, with Laravel's validation errors when present. */
export class ApiError extends Error {
  status: number;
  code?: string;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, code?: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }

  /** First message per field, for forms. */
  fieldErrors(): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.errors).map(([field, messages]) => [field, messages[0] ?? ""]),
    );
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  showLoading?: boolean;
};

/** JSON call to the API with the signed-in user's token. Throws ApiError. */
export async function api<T>(endpoint: string, options: Options = {}): Promise<T> {
  const { method = "GET", body, query, showLoading = false } = options;

  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  });
  const url = params.size > 0 ? `${endpoint}?${params.toString()}` : endpoint;

  const response = await apiFetch(url, {
    method,
    showLoading,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? `Request failed (${response.status})`,
      data?.code,
      data?.errors ?? {},
    );
  }

  return data as T;
}

export type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
};

/**
 * The API sends wall-clock times of the organization ("2026-12-02 10:00:00").
 * They are shown as they are, without converting to the browser's timezone.
 */
function parseWallClock(value: string): Date {
  const [date, time = "00:00:00"] = value.replace("T", " ").split(" ");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

export function formatDateTime(value: string | null | undefined, locale: string): string {
  if (!value) return "—";
  return parseWallClock(value).toLocaleString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) return "—";
  return parseWallClock(value).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace("T", " ").split(" ")[1]?.slice(0, 5) ?? "";
}

/** ISO instants (createdAt, trialEndsAt...) in the browser's timezone. */
export function formatInstant(value: string | null | undefined, locale: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export function formatMoney(cents: number | null | undefined, currency: string | null | undefined, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currency || "EUR" }).format((cents ?? 0) / 100);
}

/** "Y-m-d" of a local date. */
export function toDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const BOOKING_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
  completed: "bg-blue-50 text-blue-700 ring-blue-200",
};
