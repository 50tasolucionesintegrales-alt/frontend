'use client'

import { useState, useCallback } from 'react'
import AdminOrderItemRow from './AdminOrderItemRow'
import { PurchaseOrderItem } from '@/src/schemas'

export default function AdminOrderItemsTable({
  initialItems
}: {
  initialItems: PurchaseOrderItem[]
}) {
  const [items, setItems] = useState<PurchaseOrderItem[]>(initialItems)

  const handleItemUpdate = useCallback((updated: PurchaseOrderItem) => {
    setItems(prev =>
      prev.map(it => (it.id === updated.id ? updated : it))
    )
  }, [])

  const hasPending = items.some(i => i.status === 'pending')

  return (
    <div className="overflow-x-auto border border-[#e5e7eb] rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-[#e5e7eb]">
        <thead className="bg-[#174940]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Costo Unitario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Evidencia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Estado
            </th>
            {hasPending && (
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Acción
              </th>
            )}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-[#e5e7eb]">
          {items.map(it => (
            <AdminOrderItemRow
              key={it.id}
              item={it}
              showActions={hasPending && it.status === 'pending'}
              onItemUpdate={handleItemUpdate}
            />
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="bg-white p-8 text-center">
          <div className="text-[#999999] flex flex-col items-center">
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
          </div>
        </div>
      )}
    </div>
  )
}