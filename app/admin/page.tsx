import { MetricsAPI, type RangeQuery, type DtoPreset } from "@/src/lib/metrics";
import MetricsClient from "@/components/admin/Metrics";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminMetricsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Esperar a que la promesa de searchParams se resuelva
  const params = await searchParams;

  const preset = (params?.preset as DtoPreset) || "last_30d";
  const limit = Number(params?.limit ?? 10);

  const q: RangeQuery = { preset, limit };

  // Función genérica segura para obtener métricas
  async function safeFetch<T>(fn: () => Promise<T | null | undefined>): Promise<T | []> {
    try {
      const res = await fn();
      return res ?? [];
    } catch (err) {
      console.error("Error fetching metric:", err);
      return [];
    }
  }

  // Ejecutar todas las consultas en paralelo
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