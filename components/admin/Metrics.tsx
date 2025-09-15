'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Award, BarChart2, ChevronRight, ClipboardList, LucideIcon, ShoppingCart, TrendingUp, Users } from "lucide-react";

type DtoPreset =
  | "last_7d"
  | "last_30d"
  | "this_month"
  | "last_month"
  | "year_to_date"
  | "all_time"
  | "custom";

type Props = {
  preset: DtoPreset;
  limit: number;
  cotizadores: Array<{ userId: string; nombre: string; email: string; cantidad: number }>;
  compradores: Array<{ userId: string; nombre: string; email: string; cantidad: number }>;
  productos: Array<{ productId: string; nombre: string; vecesCotizado: number; cantidadTotal: number }>;
  topLogins: Array<{ userId: string; nombre: string; email: string; logins: number }>;
  loginActivity: Array<{ day: string; logins: number }>;
  // opcionales:
  quotesByUser?: unknown;
  ordersByUser?: unknown;
  userLoginActivity?: unknown;
  userLoginCount?: unknown;
};

function presetLabel(preset: DtoPreset) {
  switch (preset) {
    case "last_7d": return "últimos 7 días";
    case "last_30d": return "últimos 30 días";
    case "this_month": return "este mes";
    case "last_month": return "mes pasado";
    case "year_to_date": return "año en curso";
    case "all_time": return "histórico";
    default: return "rango";
  }
}

export default function MetricsClient(props: Props) {
  const { preset, limit, cotizadores, compradores, productos, topLogins, loginActivity } = props;

  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(search.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const label = presetLabel(preset);

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#174940] flex items-center gap-3">
            <BarChart2 size={28} className="text-[#63B23D]" />
            Estadísticas y Métricas
          </h1>
          <div className="flex flex-wrap gap-3 justify-between items-center mt-2">
            <p className="text-gray-600">Métricas clave del sistema</p>
            <div className="flex gap-2 items-center">
              <select
                title='filtro'
                value={preset}
                onChange={(e) => setParam('preset', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="last_7d">Últimos 7 días</option>
                <option value="last_30d">Últimos 30 días</option>
                <option value="this_month">Este mes</option>
                <option value="last_month">Mes pasado</option>
                <option value="year_to_date">Año en curso</option>
                <option value="all_time">Todo el tiempo</option>
              </select>

              <select
                title='limite'
                value={String(limit)}
                onChange={(e) => setParam('limit', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white"
              >
                {[5,10,15,20,25].map(n => <option key={n} value={n}>Top {n}</option>)}
              </select>
            </div>
          </div>
        </header>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CardLink href="/admin/new-users" title="Nuevos usuarios" subtitle="Asignar roles pendientes" Icon={Users} />
          <CardLink href="/admin/users" title="Gestión de usuarios" subtitle="Modificar o eliminar" Icon={Users} />
          <CardLink href="/admin/orders" title="Órdenes de compra" subtitle="Gestionar órdenes" Icon={ShoppingCart} />
          <CardLink href="/admin/quotes" title="Cotizaciones" subtitle="Ver cotizaciones" Icon={ClipboardList} />
        </div>

        {/* Top cotizadores / compradores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CardBlock title="Top Cotizadores" label={label} icon={<Award size={20} className="text-[#63B23D]" />}>
            {cotizadores?.length ? cotizadores.map((u, i) => (
              <Row key={u.userId} index={i+1} primary={u.nombre} secondary={u.email} right={`${u.cantidad} cotiz.`}
                linkHref={`/admin/metrics/users/${u.userId}/quotes?preset=${preset}`} />
            )) : <Empty label={label} />}
          </CardBlock>

          <CardBlock title="Top Compradores" label={label} icon={<ShoppingCart size={20} className="text-[#63B23D]" />}>
            {compradores?.length ? compradores.map((u, i) => (
              <Row key={u.userId} index={i+1} primary={u.nombre} secondary={u.email} right={`${u.cantidad} órdenes`}
                linkHref={`/admin/metrics/users/${u.userId}/orders?preset=${preset}`} />
            )) : <Empty label={label} />}
          </CardBlock>
        </div>

        {/* Productos más cotizados */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <SectionTitle title="Productos más cotizados" label={label} icon={<TrendingUp size={20} className="text-[#63B23D]" />} />
          {productos?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-3">#</th>
                    <th className="pb-3">Producto</th>
                    <th className="pb-3 text-right">Veces cotizado</th>
                    <th className="pb-3 text-right">Cantidad total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productos.map((p, idx) => (
                    <tr key={p.productId} className="hover:bg-gray-50">
                      <td className="py-3">{idx + 1}</td>
                      <td className="py-3 font-medium">{p.nombre}</td>
                      <td className="py-3 text-right">{p.vecesCotizado}</td>
                      <td className="py-3 text-right">{p.cantidadTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <Empty label={label} />}
        </div>

        {/* Actividad de logins + top logins */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <SectionTitle title="Actividad de inicio de sesión" label={label} icon={<BarChart2 size={20} className="text-[#63B23D]" />} />
          <div className="text-sm text-gray-500 mb-4">
            Puntos: {loginActivity?.length ?? 0}
          </div>

          <h3 className="text-lg font-semibold text-[#174940] mb-4">Usuarios con más logins</h3>
          {topLogins?.length ? topLogins.map((u, i) => (
            <Row key={u.userId} index={i+1} primary={u.nombre} secondary={u.email} right={`${u.logins} logins`}
              linkHref={`/admin/metrics/users/${u.userId}/logins?preset=${preset}`} />
          )) : <Empty label={label} />}
        </div>
      </div>
    </div>
  );
}

/* ===== UI helpers ===== */
function CardLink({ href, title, subtitle, Icon }: { href: string; title: string; subtitle: string; Icon: LucideIcon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link href={href} className="flex items-center gap-4 group">
        <div className="p-3 rounded-full bg-[#174940]/10 text-[#63B23D] group-hover:bg-[#63B23D]/20 transition-colors">
          <Icon size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#174940] tracking-tight">{title}</h3>
          <p className="text-base font-medium text-[#63B23D] mt-1">{subtitle}</p>
        </div>
        <ChevronRight className="ml-auto text-[#999999] group-hover:text-[#63B23D] transition-colors" size={20} />
      </Link>
    </div>
  );
}
function CardBlock({ title, label, icon, children }: { title: string; label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#174940] flex items-center gap-2">{icon}{title}</h2>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function SectionTitle({ title, label, icon }: { title: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-[#174940] flex items-center gap-2">{icon}{title}</h2>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
function Row({ index, primary, secondary, right}: { index: number; primary: string; secondary?: string; right?: string; linkHref?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">{index}</span>
        <div>
          <p className="font-medium">{primary}</p>
          {secondary ? <p className="text-xs text-gray-500">{secondary}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {right ? <span className="font-semibold text-[#174940]">{right}</span> : null}
      </div>
    </div>
  );
}
function Empty({ label }: { label: string }) {
  return <p className="text-sm text-gray-500">Sin datos en {label}.</p>;
}
