// src/lib/metrics.server.ts
import { cookies } from "next/headers";

const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL

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
    const payload = ct.includes("application/json") ? await res.json().catch(() => ({})) : await res.text();
    throw new Error(`GET ${url} → ${res.status} ${typeof payload === "string" ? payload : JSON.stringify(payload)}`);
  }
  return res.json();
}

/* ===== Endpoints (coinciden con tu MetricsController) ===== */
export const MetricsAPI = {
  topCotizadores: (q: RangeQuery) => apiGet<any[]>("top-cotizadores", q),
  topCompradores: (q: RangeQuery) => apiGet<any[]>("top-compradores", q),
  topProductos:   (q: RangeQuery) => apiGet<any[]>("top-productos", q),

  topLogins:      (q: RangeQuery) => apiGet<any[]>("top-logins", q),
  loginActivity:  (q: RangeQuery) => apiGet<any[]>("logins/activity", q),

  quotesByUser:   (id: number, q: RangeQuery) => apiGet<any>(`users/${id}/quotes`, q),
  ordersByUser:   (id: number, q: RangeQuery) => apiGet<any>(`users/${id}/orders`, q),
  userLoginActivity: (id: number, q: RangeQuery) => apiGet<any>(`users/${id}/logins`, q),
  userLoginCount:    (id: number, q: RangeQuery) => apiGet<any>(`users/${id}/logins/count`, q),
};
