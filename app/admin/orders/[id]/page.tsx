// app/admin/orders/[id]/page.tsx
import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction'
import { getEvidenceImageDataUrl } from '@/actions/orders/EvidenceImageAction'
import AdminOrderItemsTable from '@/components/admin/orders/AdminOrderItemsTable'
import DeleteOrderButton from '@/components/admin/orders/deleteOrder'
import { ArrowLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

async function getOrder(id: string) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id)
  const status = order.status === 'draft' ? 'Borrador'
    : order.status === 'sent' ? 'Enviada'
      : order.status === 'partially_approved' ? 'Aprobada parcialmente'
        : order.status === 'approved' ? 'Aprobada'
          : order.status === 'rejected' ? 'Rechazada'
            : order.status;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{order.titulo}</h1>
        <div className='flex'>
        <DeleteOrderButton orderId={order.id} />
        <Link href='/admin/orders' className="inline-flex items-center ml-4 pt-2 text-[#174940] hover:text-[#0F332D] mb-4 transition">
          <ArrowLeft size={18} className="mr-1" />
          Volver
        </Link>
        </div>
      </div>

      <p className="text-gray-600">Estado: {status}</p>

      <AdminOrderItemsTable 
        initialItems={order.items} 
        getProductImageDataUrl={getProductImageDataUrl} 
        getEvidenceImageDataUrl={getEvidenceImageDataUrl} 
      />
    </div>
  )
}
