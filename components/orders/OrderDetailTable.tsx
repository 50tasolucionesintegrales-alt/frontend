'use client'

import {
  useState,
  useEffect,
  useCallback,
  useActionState,
  useMemo
} from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

import { useAuthClient } from '@/src/context/authClientContext'
import { Producto, PurchaseOrderItem } from '@/src/schemas'

import OrderItemRow from '@/components/orders/OrderItemRow'
import AddItemsModal from '../modals/orders/AddItemsModal'
import sendOrderAction from '@/actions/orders/sendOrderAction'
import { reopenOrderAction } from '@/actions/orders/reOpenAction'

type Props = { 
  order: any; productos: 
  Producto[], 
  getProductImageDataUrl: (imageId: string) => Promise<string | null>,
  getEvidenceImageDataUrl: (imageId: string) => Promise<string | null>
}

export default function OrderDetailTable({ order, productos, getProductImageDataUrl, getEvidenceImageDataUrl }: Props) {
  const { user } = useAuthClient()
  const isAdmin = user?.rol?.includes('admin') ?? false

  // Estado local: items y status (no mutes el prop!)
  const [items, setItems] = useState<PurchaseOrderItem[]>(order.items);
  const [status, setStatus] = useState<'draft' | 'sent' | 'partially_approved' | 'approved' | 'rejected'>(order.status);

  // Derivar “todos con evidencia” desde items (recalcula en cada cambio)
  const allWithEvidence = useMemo(
    () => items.length > 0 && items.every(it => Number(it.evidenceSize) > 0),
    [items]
  );

  const canResend = status === 'partially_approved'

  /* ------------- enviar orden -------------- */
  const [state, dispatch, pending] = useActionState(sendOrderAction, {
    errors: [],
    success: '',
  })

  /* ------------- reabrir orden -------------- */
  const [reopenState, reopenDispatch, reopenPending] = useActionState(reopenOrderAction,{ 
    errors: [], 
    success: '', 
    order: undefined 
  })

  useEffect(() => {
    state.errors.forEach(e => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      setStatus(canResend ? 'partially_approved' : 'sent') // 👈 en vez de mutar prop;
    }
  }, [state.errors, state.success])

  useEffect(() => {
    reopenState.errors.forEach(e => toast.error(e));
    if (reopenState.success && reopenState.order) {
      toast.success(reopenState.success);
      setItems(reopenState.order.items);
      setStatus(reopenState.order.status); // 👈 en vez de mutar prop
    }
  }, [reopenState]);
  
  const handleItemUpdate = useCallback(
    (updated: PurchaseOrderItem) => {
      setItems(prev => prev.map(it => (it.id === updated.id ? updated : it)))
    },
    []
  )

  const handleItemsReplace = useCallback((updatedOrder: any) => {
    setItems(updatedOrder.items)
  }, [])

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0F332D]">{order.titulo}</h1>

        <div className="flex">
          {order.status === 'draft' && (
            <AddItemsModal
              orderId={order.id}
              products={productos}
              onSuccess={handleItemsReplace}
            />
          )}

          <Link
            href="/orders"
            className="inline-flex items-center ml-4 pt-6 text-[#174940] hover:text-[#0F332D] transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="mr-1 group-hover:-translate-x-1 transition-transform"
            />
            Volver al listado
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
        <table className="w-full divide-y divide-[#e5e7eb]">
          <thead className="bg-[#174940]">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                Producto
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                Cantidad
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                Costo unitario
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                Subtotal
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                Evidencia
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-[#e5e7eb]">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-6 py-12 text-center"
                >
                  <EmptyState />
                </td>
              </tr>
            ) : (
              items.map(item => (
                <OrderItemRow
                  key={item.id}
                  item={item}
                  orderStatus={status}
                  isAdmin={isAdmin}
                  onItemUpdate={handleItemUpdate}
                  getProductImageDataUrl={getProductImageDataUrl}
                  getEvidenceImageDataUrl={getEvidenceImageDataUrl}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {(status === 'draft' || status === 'partially_approved') && items.length !== 0 && (
        <form action={dispatch} className="mt-6">
          <input type="hidden" name="orderId" value={order.id} />

          <button
            type="submit"
            disabled={
              (order.status === 'draft' && !allWithEvidence) || pending
            }
            className={`px-6 py-2 rounded-lg font-medium flex items-center
        ${status === 'draft'
                ? allWithEvidence
                  ? 'bg-[#63B23D] text-white hover:bg-[#529e33]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#174940] text-white hover:bg-[#0F332D]'
              }`}
          >
            {/* icono */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {status === 'draft' ? 'Enviar orden' : 'Reenviar orden'}
          </button>

          {/* mensaje sólo para draft */}
          {status === 'draft' && !allWithEvidence && (
            <p className="text-xs text-red-500 mt-2">
              Todos los ítems deben tener evidencia antes de enviar.
            </p>
          )}
        </form>
      )}

      {status === 'sent' && (
        <form action={reopenDispatch} className="mt-6">
          <input type="hidden" name="orderId" value={order.id} />

          <button
            type="submit"
            disabled={reopenPending}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.276 0H20V4m0 0l-3.178 3.178M4 9l3.178-3.178M20 20v-5h-.582M4.582 15H4v5m0 0l3.178-3.178M20 20l-3.178-3.178"
              />
            </svg>
            Reabrir orden
          </button>
        </form>
      )}
    </section>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-[#999999]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 mb-3 text-[#e5e7eb]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <p className="text-lg font-medium text-[#174940]">
        No hay ítems en esta orden
      </p>
      <p className="mt-1 max-w-md">
        Agrega productos para comenzar a gestionar esta orden de compra
      </p>
    </div>
  )
}
