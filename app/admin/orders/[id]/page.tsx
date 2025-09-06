import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction';
import { getEvidenceImageDataUrl } from '@/actions/orders/EvidenceImageAction';
import AdminOrderItemsTable from '@/components/admin/orders/AdminOrderItemsTable';
import DeleteOrderButton from '@/components/admin/orders/deleteOrder';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getOrder(id: string) {
  const token = (await cookies()).get('50TA_TOKEN')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  const status = order.status === 'draft' ? 'Borrador'
    : order.status === 'sent' ? 'Enviada'
      : order.status === 'partially_approved' ? 'Aprobada parcialmente'
        : order.status === 'approved' ? 'Aprobada'
          : order.status === 'rejected' ? 'Rechazada'
            : order.status;

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShoppingCart size={28} className="text-[#63B23D]" />
            <h1 className="text-3xl font-bold text-[#174940]">{order.titulo}</h1>
          </div>

          <div className="flex items-center gap-2">
            <DeleteOrderButton orderId={order.id} />
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 px-2.5 py-2
                         text-sm bg-white border border-gray-200 rounded-lg shadow-sm
                         text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Volver</span>
            </Link>
          </div>
        </header>

        {/* Estado */}
        <p className="text-gray-600 text-sm md:text-base">Estado: {status}</p>

        {/* Items de la orden */}
        <AdminOrderItemsTable 
          initialItems={order.items} 
          getProductImageDataUrl={getProductImageDataUrl} 
          getEvidenceImageDataUrl={getEvidenceImageDataUrl} 
        />
      </div>
    </div>
  );
}