import { MetricsAPI, type RangeQuery, type DtoPreset } from "@/src/lib/metrics";
import MetricsClient from "@/components/admin/Metrics";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminMetricsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const preset = (params?.preset as DtoPreset) || "last_30d";
  const limit = Number(params?.limit ?? 10);

  const q: RangeQuery = { preset, limit };

  // Función genérica para obtener métricas de forma segura
  async function safeFetch<T>(fn: () => Promise<T>): Promise<T | []> {
    try {
      const res = await fn();
      return res ?? [];
    } catch (err) {
      console.error("Error fetching metric:", err);
      return [];
    }
  }

  // Obtener todas las métricas en paralelo
  const [
    cotizadores,
    compradores,
    productos,
    topLogins,
    quotesByUser,
    ordersByUser,
    userLoginActivity,
    userLoginCount,
  ] = await Promise.all([
    safeFetch(() => MetricsAPI.topCotizadores(q)),
    safeFetch(() => MetricsAPI.topCompradores(q)),
    safeFetch(() => MetricsAPI.topProductos(q)),
    safeFetch(() => MetricsAPI.topLogins(q)),
    safeFetch(() => MetricsAPI.loginActivity(q)),
    safeFetch(() => MetricsAPI.quotesByUser(1, q)),
    safeFetch(() => MetricsAPI.ordersByUser(1, q)),
    safeFetch(() => MetricsAPI.userLoginActivity(1, q)),
    safeFetch(() => MetricsAPI.userLoginCount(1, q)),
  ]);

  return (
    <MetricsClient
      preset={preset}
      limit={limit}
      cotizadores={cotizadores}
      compradores={compradores}
      productos={productos}
      topLogins={topLogins}
      quotesByUser={quotesByUser}
      ordersByUser={ordersByUser}
      userLoginActivity={userLoginActivity}
      userLoginCount={userLoginCount}
    />
  );
}