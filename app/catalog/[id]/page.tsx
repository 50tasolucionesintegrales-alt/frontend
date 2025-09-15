import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction';
import ProductDetail from '@/components/catalog/productoDetalle';
import ServiceDetail from '@/components/catalog/ServicioDetalle';
import getDraftOrders from '@/src/lib/orders/getDraftOrders';
import { Producto, Quote, Service } from '@/src/schemas';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ButtonBack from '@/components/ui/ButtonBack';
import { FileText } from 'lucide-react';

type FetchOk<T> = { ok: true; data: T };
type FetchErr = { ok: false; status: number; error?: unknown };
type FetchResult<T> = FetchOk<T> | FetchErr;

function isOk<T>(x: FetchResult<T>): x is FetchOk<T> {
  return x.ok === true;
}

async function fetchJSON<T>(url: string, token?: string, init?: RequestInit): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false, status: res.status };
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (error) {
    return { ok: false, status: 0, error };
  }
}

export default async function CatalogIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get('50TA_TOKEN')?.value;

  const ordersPromise = getDraftOrders();
  const quotesPromise = fetchJSON<Quote[]>(`${process.env.NEXT_PUBLIC_API_URL}/quotes/drafts`, token);

  const [prodRes, svcRes] = await Promise.all([
    fetchJSON<Producto>(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, token, { method: 'GET' }),
    fetchJSON<Service>(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, token, { method: 'GET' }),
  ]);

  const [orders, quotesDraft] = await Promise.all([
    ordersPromise,
    quotesPromise.then((r) => (isOk(r) ? r.data : [])),
  ]);

  // Decide qué vista mostrar
  if (isOk(prodRes)) {
    return (
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        {/* Header con título y botón de regresar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
            <FileText className="h-6 w-6 text-[#63B23D]" />
            <h1 className="text-xl md:text-2xl font-bold text-[#0F332D]">Detalles del producto</h1>

            {/* Botón en móviles */}
            <div className="md:hidden ml-auto">
              <ButtonBack href="/catalog" />
            </div>
          </div>

          {/* Botón en pantallas grandes */}
          <div className="hidden md:block">
            <ButtonBack href="/catalog" />
          </div>
        </header>

        <ProductDetail
          producto={prodRes.data}
          drafts={quotesDraft}
          orders={orders}
          getProductImageDataUrl={getProductImageDataUrl}
        />
      </div>
    );
  }

  if (isOk(svcRes)) {
    return (
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        {/* Header con título y botón de regresar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
            <FileText className="h-6 w-6 text-[#63B23D]" />
            <h1 className="text-xl md:text-2xl font-bold text-[#0F332D]">Detalles del servicio</h1>

            {/* Botón en móviles */}
            <div className="md:hidden ml-auto">
              <ButtonBack href="/catalog" />
            </div>
          </div>

          {/* Botón en pantallas grandes */}
          <div className="hidden md:block">
            <ButtonBack href="/catalog" />
          </div>
        </header>

        <ServiceDetail
          service={svcRes.data}
          drafts={quotesDraft}
        />
      </div>
    );
  }

  notFound();
}