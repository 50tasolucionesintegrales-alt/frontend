// src/lib/metrics.server.ts
import { cookies } from "next/headers";

const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

/** Presets esperados por tu DTO */
export type DtoPreset =
  | "last_7d"
  | "last_30d"
  | "this_month"
  | "last_month"
  | "year_to_date"
  | "all_time"
  | "custom";

export type RangeQuery = {
  preset?: DtoPreset;
  desde?: string; // YYYY-MM-DD (si preset=custom)
  hasta?: string; // YYYY-MM-DD (si preset=custom)
  limit?: number; // 1..100
};

function qs(params: RangeQuery) {
  const q = new URLSearchParams();
  if (params.preset) q.set("preset", params.preset);
  if (typeof params.limit === "number") q.set("limit", String(params.limit));
  if (params.preset === "custom") {
    if (params.desde) q.set("desde", params.desde);
    if (params.hasta) q.set("hasta", params.hasta);
  }
  return q.toString();
}

async function apiGet<T>(path: string, query?: RangeQuery): Promise<T> {
  const token = (await cookies()).get("50TA_TOKEN")?.value;
  const url = `${API}/metrics/${path}${query ? `?${qs(query)}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();
    throw new Error(
      `GET ${url} → ${res.status} ${
        typeof payload === "string" ? payload : JSON.stringify(payload)
      }`,
    );
  }
  return res.json() as Promise<T>;
}

/* ========= Tipos DTO ========= */

// Top cotizadores/compradores
export type UserCountRow = {
  userId: string;
  nombre: string;
  email: string;
  cantidad: number;
};

// Top productos
export type TopProductoRow = {
  productId: string;
  nombre: string;
  vecesCotizado: number;
  cantidadTotal: number;
};

// Top logins y actividad de logins
export type TopLoginRow = {
  userId: string;
  nombre: string;
  email: string;
  logins: number;
};

export type LoginActivityPoint = {
  day: string;   // YYYY-MM-DD
  logins: number;
};

// Resúmenes por usuario
export type QuoteSummary = {
  id: string;
  titulo: string;
  tipo: "productos" | "servicios";
  sentAt: string | null;
  total: number;
};

export type OrderSummary = {
  id: string;
  titulo: string;
  status: "pending" | "approved" | "rejected" | "partially_approved";
  sentAt: string | null;
  total: number;
};

export type UserLoginCount = { total: number };

/* ===== Endpoints tipados ===== */
export const MetricsAPI = {
  topCotizadores: (q: RangeQuery) =>
    apiGet<UserCountRow[]>("top-cotizadores", q),

  topCompradores: (q: RangeQuery) =>
    apiGet<UserCountRow[]>("top-compradores", q),

  topProductos: (q: RangeQuery) =>
    apiGet<TopProductoRow[]>("top-productos", q),

  topLogins: (q: RangeQuery) =>
    apiGet<TopLoginRow[]>("top-logins", q),

  loginActivity: (q: RangeQuery) =>
    apiGet<LoginActivityPoint[]>("logins/activity", q),

  quotesByUser: (id: number, q: RangeQuery) =>
    apiGet<QuoteSummary[]>(`users/${id}/quotes`, q),

  ordersByUser: (id: number, q: RangeQuery) =>
    apiGet<OrderSummary[]>(`users/${id}/orders`, q),

  userLoginActivity: (id: number, q: RangeQuery) =>
    apiGet<LoginActivityPoint[]>(`users/${id}/logins`, q),

  userLoginCount: (id: number, q: RangeQuery) =>
    apiGet<UserLoginCount>(`users/${id}/logins/count`, q),
};
