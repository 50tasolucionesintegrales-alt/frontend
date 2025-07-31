'use client'

import Image from 'next/image'
import { useState, useEffect, useActionState } from 'react'
import { toast } from 'react-toastify'
import { approveItemAction } from '@/actions/admin/orders/approveItemAction'
import { PurchaseOrderItem } from '@/src/schemas'
import { RechazarModal } from '@/components/modals/admin/rejectOderModal'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, XCircle, Eye, Loader2 } from 'lucide-react'

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1.5 text-sm rounded-md bg-[#63B23D] text-white hover:bg-[#529e33] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4 mr-1" />
          {label}
        </>
      )}
    </button>
  )
}

type RowProps = {
  item: PurchaseOrderItem
  showActions: boolean
  onItemUpdate: (updated: PurchaseOrderItem) => void
  className?: string
}

export default function AdminOrderItemRow({
  item,
  showActions,
  onItemUpdate,
  className = ''
}: RowProps) {
  const [status, setStatus] = useState(item.status)
  const [state, dispatch] = useActionState(approveItemAction, {
    success: '',
    errors: [],
    item: null
  })

  useEffect(() => {
    state.errors.forEach(e => toast.error(e))
    if (state.item) {
      setStatus(state.item.status)
      onItemUpdate(state.item)
    }
    if (state.success) toast.success(state.success)
  }, [state])

  const canAct = showActions && status === 'pending'
  const statusColor = {
    approved: 'text-[#63B23D] bg-[#63B23D]/10',
    rejected: 'text-red-600 bg-red-100',
    pending: 'text-yellow-600 bg-yellow-100'
  }

  return (
    <tr className={`text-sm ${className}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <Image
              src={item.product.image_url}
              alt={item.product.nombre}
              width={40}
              height={40}
              className="rounded-md object-cover h-full w-full"
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-[#0F332D]">{item.product.nombre}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-[#174940]">
        {item.cantidad}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-[#174940] font-medium">
        ${item.costo_unitario.toFixed(2)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {item.evidenceUrl ? (
          <a
            href={item.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#174940] hover:text-[#0F332D] inline-flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver evidencia
          </a>
        ) : (
          <span className="text-[#999999]">—</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[status]}`}>
          {status}
        </span>
      </td>

      {showActions && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {canAct ? (
            <div className="flex items-center space-x-2">
              <form action={dispatch} className="inline-flex">
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="status" value="approved" />
                <SubmitBtn label="Aprobar" />
              </form>

              <RechazarModal 
                itemId={item.id} 
                disabled={false}
              />
            </div>
          ) : (
            <span className="text-[#999999]">—</span>
          )}
        </td>
      )}
    </tr>
  )
}