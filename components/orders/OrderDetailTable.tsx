'use client'

import {
  useState,
  useEffect,
  useCallback,
  useActionState
} from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

import { useAuthClient } from '@/src/context/authClientContext'
import { Producto, PurchaseOrderItem } from '@/src/schemas'

import OrderItemRow from '@/components/orders/OrderItemRow'
import AddItemsModal from '../modals/orders/AddItemsModal'
import sendOrderAction from '@/actions/orders/sendOrderAction'

type Props = { order: any; productos: Producto[] }

export default function OrderDetailTable({ order, productos }: Props) {
  const { user } = useAuthClient()
  const isAdmin = user?.rol?.includes('admin') ?? false

  const [items, setItems] = useState<PurchaseOrderItem[]>(order.items)

  /* ------------- enviar orden -------------- */
  const [state, dispatch] = useActionState(sendOrderAction, {
    errors: [] as string[],
    success: ''
  })

  useEffect(() => {
    state.errors.forEach(e => toast.error(e))
    if (state.success) toast.success(state.success)
  }, [state.errors, state.success])

  /* ---------- callbacks estables ---------- */
  /** actualizar UN ítem (subida de evidencia) */
  const handleItemUpdate = useCallback(
    (updated: PurchaseOrderItem) => {
      setItems(prev => prev.map(it => (it.id === updated.id ? updated : it)))
    },
    [] // referencia estable
  )

  /** reemplazar todos los ítems (cuando agregas productos) */
  const handleItemsReplace = useCallback((updatedOrder: any) => {
    setItems(updatedOrder.items)
  }, [])

  /* ---------------------------------------- */
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
                Evidencia
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                Estado
              </th>
              {isAdmin && (
                <th className="py-3 px-6 text-left text-sm font-medium text-white uppercase">
                  Revisión
                </th>
              )}
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
                  orderStatus={order.status}
                  isAdmin={isAdmin}
                  onItemUpdate={handleItemUpdate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {order.status === 'draft' && items.length !== 0 && (
        <form action={dispatch} className="mt-6">
          <input type="hidden" name="orderId" value={order.id} />
          <button
            type="submit"
            className="px-6 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] font-medium flex items-center"
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Enviar orden
          </button>
        </form>
      )}
    </section>
  )
}

/* ---------- pequeño componente vacío ---------- */
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
