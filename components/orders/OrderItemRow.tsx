'use client'

import Image from 'next/image'
import { useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Box } from 'lucide-react'
import { PurchaseOrderItem } from '@/src/schemas'
import { uploadEvidenceAction } from '@/actions/orders/uploadEvidenceAction'
import { useFormStatus } from 'react-dom'           // ➊

type Props = {
  item: PurchaseOrderItem
  orderStatus: 'draft' | 'sent' | 'partially_approved' | 'approved' | 'rejected'
  isAdmin: boolean
  onItemUpdate: (updated: PurchaseOrderItem) => void
}

export default function OrderItemRow ({
  item,
  orderStatus,
  isAdmin,
  onItemUpdate
}: Props) {
  /* estado aislado de esta fila */
  const [rowState, dispatch] = useActionState(uploadEvidenceAction, {
    success: '',
    errors: [],
    item: null
  })

  /* toasts */
  useEffect(() => {
    rowState.errors.forEach(e => toast.error(e))
  }, [rowState.errors])

  useEffect(() => {
    if (rowState.success) toast.success(rowState.success)
  }, [rowState.success])

  /* avisar al padre */
  useEffect(() => {
    if (rowState.item) onItemUpdate(rowState.item)
  }, [rowState.item, onItemUpdate])

  /* puede subir evidencia?  (sent ya NO permite) */
  const canUpload =
    item.status !== 'approved' &&
    ['draft', 'partially_approved'].includes(orderStatus)   // 🟣 sin 'sent'

  return (
    <tr className="hover:bg-gray-50">
      {/* Producto */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {item.product.image_url ? (
            <Image
              src={item.product.image_url}
              alt={item.product.nombre}
              width={40}
              height={40}
              className="rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
              <Box className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <span className="font-medium">{item.product.nombre}</span>
        </div>
      </td>

      {/* Cantidad & costo */}
      <td className="py-3 px-4">{item.cantidad}</td>
      <td className="py-3 px-4">${item.costo_unitario.toFixed(2)}</td>

      {/* Evidencia + form */}
      <td className="py-3 px-4">
        {item.evidenceUrl ? (
          <Image
            src={item.evidenceUrl}
            alt="Evidencia"
            width={60}
            height={60}
            className="rounded object-cover"
          />
        ) : (
          <span className="italic text-gray-400 text-sm">Sin evidencia</span>
        )}

        {canUpload && (
          <form
            action={dispatch}
            className="mt-2 flex items-center gap-2 text-sm"
          >
            <input type="hidden" name="itemId" value={item.id} />
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="text-xs"
            />

            {/* botón con estado usando useFormStatus */}
            <SubmitBtn />
          </form>
        )}
      </td>

      {/* Estado */}
      <td className="py-3 px-4 capitalize">{item.status}</td>

      {/* Placeholder revisión admin */}
      {isAdmin && <td className="py-3 px-4">—</td>}
    </tr>
  )
}

/* Botón desacoplado para poder usar useFormStatus */
function SubmitBtn () {
  const { pending } = useFormStatus()                // ➊
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1 bg-[#174940] text-white rounded hover:bg-[#14533f] disabled:opacity-50"
    >
      {pending ? 'Subiendo…' : 'Subir'}
    </button>
  )
}
