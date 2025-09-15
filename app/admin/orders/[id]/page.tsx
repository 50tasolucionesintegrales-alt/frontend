import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction';
import { getEvidenceImageDataUrl } from '@/actions/orders/EvidenceImageAction';
import AdminOrderItemsTable from '@/components/admin/orders/AdminOrderItemsTable';
import DeleteOrderButton from '@/components/admin/orders/deleteOrder';
import { cookies } from 'next/headers';
import ButtonBack from '@/components/ui/ButtonBack';

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

  const statusText = order.status === 'draft' ? 'Borrador'
    : order.status === 'sent' ? 'Enviada'
      : order.status === 'partially_approved' ? 'Aprobada parcialmente'
        : order.status === 'approved' ? 'Aprobada'
          : order.status === 'rejected' ? 'Rechazada'
            : order.status;

  const statusColor = order.status === 'draft' ? 'bg-gray-200 text-gray-800'
    : order.status === 'sent' ? 'bg-blue-100 text-blue-800'
      : order.status === 'partially_approved' ? 'bg-yellow-100 text-yellow-800'
        : order.status === 'approved' ? 'bg-green-100 text-green-800'
          : order.status === 'rejected' ? 'bg-red-100 text-red-800'
            : 'bg-gray-200 text-gray-800';

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

      {/* Header con título y botón de regresar */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
          <h1 className="text-2xl font-bold text-[#174940]">
            Nombre de la orden: {order.titulo}
          </h1>
          {/* Botón al lado del título en móviles */}
          <div className="md:hidden">
            <ButtonBack href="/admin/orders" />
          </div>
        </div>

        {/* Botón en pantallas grandes */}
        <div className="hidden md:block">
          <ButtonBack href="/admin/orders" />
        </div>
      </header>


        {/* Estado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className={`inline-block px-4 py-2 rounded-lg font-semibold ${statusColor}`}>
            Estado: {statusText}
          </p>
          <DeleteOrderButton orderId={order.id} />
        </div>

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