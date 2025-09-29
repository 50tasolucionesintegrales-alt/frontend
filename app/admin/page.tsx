import { MetricsAPI, type RangeQuery, type DtoPreset } from "@/src/lib/metrics";
import MetricsClient from "@/components/admin/Metrics";

export default async function AdminMetricsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
const params = await searchParams;

  const preset = (params?.preset as DtoPreset) || "last_30d";
  const limit  = Number(params?.limit ?? 10);

  const q: RangeQuery = { preset, limit };

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
    MetricsAPI.topCotizadores(q),
    MetricsAPI.topCompradores(q),
    MetricsAPI.topProductos(q),
    MetricsAPI.topLogins(q),
    MetricsAPI.loginActivity(q),

    MetricsAPI.quotesByUser(1, q).catch(() => null),
    MetricsAPI.ordersByUser(1, q).catch(() => null),
    MetricsAPI.userLoginActivity(1, q).catch(() => null),
    MetricsAPI.userLoginCount(1, q).catch(() => null),
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