import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction';
import ProductDetail from '@/components/catalog/productoDetalle';
import ServiceDetail from '@/components/catalog/ServicioDetalle';
import getDraftOrders from '@/src/lib/orders/getDraftOrders';
import { Producto, Quote, Service } from '@/src/schemas';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

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
  const { id } = await params
  const token = (await cookies()).get('50TA_TOKEN')?.value;

  const ordersPromise = getDraftOrders();
  const quotesPromise = fetchJSON<Quote[]>(`${process.env.NEXT_PUBLIC_API_URL}/quotes/drafts`, token);

  // Llamamos en paralelo; fetchJSON no lanza, siempre resuelve FetchResult
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
      <ProductDetail
        producto={prodRes.data}
        drafts={quotesDraft}
        orders={orders}
        getProductImageDataUrl={getProductImageDataUrl}
      />
    );
  }

  if (isOk(svcRes)) {
    return (
      <ServiceDetail
        service={svcRes.data}
        drafts={quotesDraft}
      />
    );
  }

  // Si ambos endpoints devolvieron no-ok
  notFound();
}