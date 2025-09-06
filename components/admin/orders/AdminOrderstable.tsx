'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Order } from '@/src/schemas'

type Props = {
  orders: Order[]
  type: 'pending' | 'resolved'
}

export default function AdminOrderTable({ orders, type }: Props) {
  const emptyMsg = useMemo(
    () =>
      type === 'pending'
        ? 'No hay órdenes pendientes en este momento.'
        : 'Todas las órdenes están pendientes de revisión.',
    [type]
  )
  console.log(orders)
  if (!orders.length) {
    return (
      <div className="bg-white p-8 rounded-xl border border-[#e5e7eb] shadow-sm text-center">
        <div className="flex flex-col items-center justify-center text-[#999999]">
          {type === 'pending' ? (
            <Clock className="h-12 w-12 mb-3 text-[#e5e7eb]" />
          ) : (
            <CheckCircle className="h-12 w-12 mb-3 text-[#e5e7eb]" />
          )}
          <p className="text-lg font-medium text-[#174940]">
            {emptyMsg}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-[#e5e7eb] rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-[#e5e7eb]">
        <thead className="bg-[#174940]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Progreso de aprobados
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-[#e5e7eb]">
          {orders.map((o, idx) => {
            const approvedItems = o.items.filter((it) => it.status === 'approved').length
            const totalItems = o.items.length
            const progress = o.progressPct ?? 0
            const fecha = type === 'pending' ? o.sentAt : o.resolvedAt

            return (
              <tr key={o.id} className="hover:bg-[#f0f7f5] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0F332D] font-medium">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0F332D]">
                  {o.titulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#174940]">
                  {o.user?.nombre ?? o.user?.email ?? '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    approvedItems > 0 ? 'bg-[#63B23D]/20 text-[#63B23D]' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {approvedItems}/{totalItems}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-[#63B23D] h-2 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#999999]">
                      {progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#174940]">
                  {fecha ? new Date(fecha).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-[#174940] hover:text-[#0F332D] inline-flex items-center hover:underline"
                  >
                    Ver detalle
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}