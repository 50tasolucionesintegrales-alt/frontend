import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction';
import ProductDetail from '@/components/catalog/productoDetalle';
import getDraftOrders from '@/src/lib/orders/getDraftOrders';
import { Producto, Quote } from '@/src/schemas';
import { cookies } from 'next/headers';
import ButtonBack from '@/components/ui/ButtonBack';
import { FileText } from 'lucide-react';
import { notFound } from 'next/navigation';

async function fetchJSON<T>(url: string, token?: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const token = (await cookies()).get('50TA_TOKEN')?.value;

  const [producto, drafts, orders] = await Promise.all([
    fetchJSON<Producto>(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, token),
    fetchJSON<Quote[]>(`${process.env.NEXT_PUBLIC_API_URL}/quotes/drafts`, token),
    getDraftOrders(),
  ]);

  if (!producto) notFound();

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
          <FileText className="h-6 w-6 text-[#63B23D]" />
          <h1 className="text-xl md:text-2xl font-bold text-[#0F332D]">Detalles del producto</h1>
          <div className="md:hidden ml-auto"><ButtonBack href="/catalog" /></div>
        </div>
        <div className="hidden md:block"><ButtonBack href="/catalog" /></div>
      </header>

      <ProductDetail
        producto={producto}
        drafts={drafts ?? []}
        orders={orders}
        getProductImageDataUrl={getProductImageDataUrl}
      />
    </div>
  );
}