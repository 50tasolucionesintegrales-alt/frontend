'use client'

import Image from 'next/image'
import { useState, useEffect, useActionState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'
import { AlertTriangle, Box, XCircle, CheckCircle2, Upload, RefreshCw, Eye } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import { uploadEvidenceAction } from '@/actions/orders/uploadEvidenceAction'
import rejectItemsAction from '@/actions/orders/rejectItemsAction'
import { PurchaseOrderItem } from '@/src/schemas'
import { RejectReasonModal } from '../modals/orders/RejectReasonModal'

function SubmitBtn({ label = 'Subir', icon: Icon = Upload }: { label?: string; icon?: any }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-all ${
        pending 
          ? 'bg-[#174940]/80 text-white' 
          : 'bg-[#174940] text-white hover:bg-[#0F332D]'
      }`}
    >
      {pending ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Icon className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  )
}

export default function OrderItemRow({
  item,
  orderStatus,
  isAdmin,
  onItemUpdate
}: {
  item: PurchaseOrderItem
  orderStatus: 'draft' | 'sent' | 'partially_approved' | 'approved' | 'rejected'
  isAdmin: boolean
  onItemUpdate: (updated: PurchaseOrderItem) => void
}) {
  const [evState, dispatchEv] = useActionState(uploadEvidenceAction, {
    success: '', errors: [], item: null
  })
  const [qtyState, dispatchQty] = useActionState(rejectItemsAction, {
    success: '', errors: [], item: null
  })

  useEffect(() => {
    evState.errors.forEach(e => toast.error(e))
    qtyState.errors.forEach(e => toast.error(e))
    if (evState.success) toast.success(evState.success)
    if (qtyState.success) toast.success(qtyState.success)

    const updated = evState.item ?? qtyState.item
    if (updated) onItemUpdate(updated)
  }, [evState, qtyState, onItemUpdate])

  const canUpload = item.status !== 'approved' && ['draft', 'partially_approved'].includes(orderStatus)
  const canEditQty = ['draft', 'partially_approved'].includes(orderStatus) && item.status !== 'approved'

  const statusBadge = {
    approved: 'bg-[#63B23D]/10 text-[#63B23D]',
    rejected: 'bg-red-100 text-red-600',
    pending: 'bg-yellow-100 text-yellow-600'
  }[item.status] || 'bg-gray-100 text-gray-600'

  return (
    <tr className="border-b border-[#e5e7eb] hover:bg-[#f0f7f5] transition-colors">
      {/* Producto */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {item.product.image_url ? (
              <div className="h-12 w-12 rounded-lg overflow-hidden border border-[#e5e7eb]">
                <Image
                  src={item.product.image_url}
                  alt={item.product.nombre}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center border border-[#e5e7eb]">
                <Box className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-[#0F332D]">{item.product.nombre}</div>
          </div>
        </div>
      </td>

      {/* Cantidad */}
      <td className="px-6 py-4">
        {canEditQty ? (
          <form action={dispatchQty} className="flex items-center gap-2">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="costoUnitario" value={item.costo_unitario} />
            <input
              type="number"
              name="cantidad"
              min={1}
              defaultValue={item.cantidad}
              className="w-20 border border-[#e5e7eb] rounded-lg px-3 py-1.5 text-right focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
            />
            <SubmitBtn label="Actualizar" icon={RefreshCw} />
          </form>
        ) : (
          <span className="font-medium text-[#174940]">{item.cantidad}</span>
        )}
      </td>

      {/* Precio Unitario */}
      <td className="px-6 py-4 text-[#174940] font-medium">
        ${item.costo_unitario.toFixed(2)}
      </td>

      {/* Subtotal */}
      <td className="px-6 py-4 text-[#0F332D] font-bold">
        ${item.subtotal.toFixed(2)}
      </td>

      {/* Evidencia */}
      <td className="px-6 py-4">
        {item.evidenceUrl ? (
          <div className="relative group">
            <div className="h-16 w-16 rounded-lg overflow-hidden border border-[#e5e7eb]">
              <Image
                src={item.evidenceUrl}
                alt="Evidencia"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <a 
              href={item.evidenceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-5 w-5 text-white" />
            </a>
          </div>
        ) : (
          <span className="text-sm text-[#999999] italic">Sin evidencia</span>
        )}

        {canUpload && (
          <form action={dispatchEv} className="mt-3 flex items-center gap-2">
            <input type="hidden" name="itemId" value={item.id} />
            <label className="flex-1">
              <div className="cursor-pointer text-sm px-3 py-1.5 border border-[#e5e7eb] rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                <span className="truncate text-[#174940]">Seleccionar archivo</span>
                <Upload className="h-4 w-4 text-[#999999]" />
              </div>
              <input 
                type="file" 
                name="file" 
                accept="image/*" 
                required 
                className="hidden" 
                onChange={(e) => e.target.form?.requestSubmit()}
              />
            </label>
          </form>
        )}
      </td>

      {/* Estado */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusBadge}`}>
            {item.status}
          </span>
          {item.status === 'rejected' && item.rejectReason && (
            <RejectReasonModal reason={item.rejectReason} />
          )}
        </div>
      </td>
    </tr>
  )
}