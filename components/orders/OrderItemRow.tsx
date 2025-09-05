'use client'

import Image from 'next/image'
import { useState, useEffect, useActionState, useCallback } from 'react'
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
      className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-all ${pending
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
  onItemUpdate,
  getProductImageDataUrl,
  getEvidenceImageDataUrl
}: {
  item: PurchaseOrderItem
  orderStatus: 'draft' | 'sent' | 'partially_approved' | 'approved' | 'rejected'
  isAdmin: boolean
  onItemUpdate: (updated: PurchaseOrderItem) => void
  getProductImageDataUrl: (imageId: string) => Promise<string | null>
  getEvidenceImageDataUrl: (imageId: string) => Promise<string | null>
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
    if (evState.success) {
      toast.success(evState.success)
      fetchImageEvidencia(); // ⬅️ Refresca la imagen de evidencia al subir una nueva
    }
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

  //Fetch Imagenes de productos
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImageProductos = useCallback(async () => {
    setLoading(true);
    setLoaded(false);
    setError(null);
    setImgSrc(null);

    let active = true;
    try {
      const url = await getProductImageDataUrl(item.product.id);
      if (!active) return;
      if (!url) {
        // 404 o sin imagen
        setImgSrc(null);
      } else {
        setImgSrc(url);
      }
    } catch (e: any) {
      if (!active) return;
      setError(e?.message || 'No se pudo cargar la imagen');
      setImgSrc(null);
    } finally {
      if (active) setLoading(false);
    }

    return () => { active = false; };
  }, [item.product.id, getProductImageDataUrl]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchImageProductos();
    })();
    return () => { cancelled = true; };
  }, [fetchImageProductos]);

  //Fetch imagenes de evidencia
  const [eviImgSrc, setEviImgSrc] = useState<string | null>(null);
  const [eviLoading, setEviLoading] = useState(false);
  const [eviLoaded, setEviLoaded] = useState(false);
  const [eviError, setEviError] = useState<string | null>(null);

  // ⬇️ Trae la evidencia usando el ID del ÍTEM
  const fetchImageEvidencia = useCallback(async () => {
    setEviLoading(true);
    setEviLoaded(false);
    setEviError(null);
    setEviImgSrc(null);

    let active = true;
    try {
      const url = await getEvidenceImageDataUrl(String(item.id)); // 👈 antes usabas product.id
      if (!active) return;
      setEviImgSrc(url ?? null);
    } catch (e: any) {
      if (!active) return;
      setEviError(e?.message || 'No se pudo cargar la evidencia');
      setEviImgSrc(null);
    } finally {
      if (active) setEviLoading(false);
    }

    return () => { active = false; };
  }, [item.id, getEvidenceImageDataUrl]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchImageEvidencia();
    })();
    return () => { cancelled = true; };
  }, [fetchImageEvidencia]);


  return (
    <tr className="border-b border-[#e5e7eb] hover:bg-[#f0f7f5] transition-colors">
      {/* Producto */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div
            className="relative h-10 overflow-hidden rounded-t-xl"
            aria-busy={loading ? 'true' : 'false'}
            aria-live="polite"
          >
            {/* Estado: Cargando (skeleton + spinner) */}
            {loading && (
              <div className="absolute inset-0 animate-pulse bg-gray-100" />
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-6 w-6 animate-spin"
                  viewBox="0 0 24 24"
                  aria-label="Cargando imagen"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" fill="currentColor" className="opacity-75" />
                </svg>
              </div>
            )}

            {/* Estado: Éxito (con fade-in al cargar) */}
            {imgSrc && !error && (
              <img
                src={imgSrc}
                alt={item.product.nombre}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              />
            )}

            {/* Estado: Sin imagen o Error */}
            {!loading && (!imgSrc || error) && (
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
        <div
          className="relative w-28 h-28 rounded-lg border border-[#e5e7eb] bg-white flex items-center justify-center overflow-hidden"
          aria-busy={eviLoading ? 'true' : 'false'}
          aria-live="polite"
        >
          {/* Cargando */}
          {eviLoading && (
            <>
              <div className="absolute inset-0 animate-pulse bg-gray-100" />
              <svg className="relative h-6 w-6 animate-spin text-gray-500" viewBox="0 0 24 24" aria-label="Cargando evidencia">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" fill="currentColor" className="opacity-75" />
              </svg>
            </>
          )}

          {/* Imagen completa (object-contain para NO recortar) */}
          {eviImgSrc && !eviError && !eviLoading && (
            <img
              src={eviImgSrc}
              alt="Evidencia de recepción"
              loading="lazy"
              decoding="async"
              onLoad={() => setEviLoaded(true)}
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${eviLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {/* Sin evidencia / Error */}
          {!eviLoading && (!eviImgSrc || eviError) && (
            <span className="text-xs text-gray-500">Sin evidencia</span>
          )}
        </div>

        {/* (Opcional) botón para ver en grande en un modal/lightbox */}
        {eviImgSrc && !eviError && (
          <button
            type="button"
            onClick={() => window.open(eviImgSrc as string, '_blank', 'noopener,noreferrer')}
            className="mt-2 inline-flex items-center gap-1 text-[#174940] hover:underline text-sm"
            title="Ver evidencia completa"
          >
            <Eye className="h-4 w-4" />
            Ver completo
          </button>
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