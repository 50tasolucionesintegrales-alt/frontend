'use client'

import { useState, useEffect, useActionState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { approveItemAction } from '@/actions/admin/orders/approveItemAction'
import { PurchaseOrderItem } from '@/src/schemas'
import { RechazarModal } from '@/components/modals/admin/rejectOderModal'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Eye, Loader2, Box } from 'lucide-react'
import Image from 'next/image'

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
  getProductImageDataUrl: (imageId: string) => Promise<string | null>
  getEvidenceImageDataUrl: (imageId: string) => Promise<string | null>
  onOpenEvidence: (src: string | null) => void
}

export default function AdminOrderItemRow({
  item,
  showActions,
  onItemUpdate,
  className = '',
  getProductImageDataUrl,
  getEvidenceImageDataUrl,
  onOpenEvidence
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
  }, [state, onItemUpdate])

  const canAct = showActions && status === 'pending'
  const statusColor = {
    Aprovado: 'text-[#63B23D] bg-[#63B23D]/10',
    Rechazado: 'text-red-600 bg-red-100',
    Pendiente: 'text-yellow-600 bg-yellow-100'
  }

  const statusItem = status === 'approved' ? 'Aprovado'
    : status === 'rejected' ? 'Rechazado'
      : 'Pendiente';

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
    } catch (e) {
      if (!active) return;
      setError((e as Error).message || 'No se pudo cargar la imagen');
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
    } catch (e) {
      if (!active) return;
      setEviError((e as Error).message || 'No se pudo cargar la evidencia');
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
    <>
      <tr className={`text-sm ${className}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
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
                <Image
                  src={imgSrc}
                  alt={item.product.nombre}
                  width={400}          // 👈 tamaño base obligatorio
                  height={400}
                  loading="lazy"
                  onLoad={() => setLoaded(true)}
                  className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                  unoptimized          // 👈 evita error si es blob/base64 o URL externa sin config
                />
              )}

              {/* Estado: Sin imagen o Error */}
              {!loading && (!imgSrc || error) && (
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center border border-[#e5e7eb]">
                  <Box className="h-5 w-5 text-gray-400" />
                </div>
              )}
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
              <Image
                src={eviImgSrc}
                alt="Evidencia de recepción"
                width={600}          // 👈 ajusta según el contenedor
                height={400}
                loading="lazy"
                onLoad={() => setEviLoaded(true)}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${eviLoaded ? "opacity-100" : "opacity-0"
                  }`}
                unoptimized
              />
            )}

            {/* Sin evidencia / Error */}
            {!eviLoading && (!eviImgSrc || eviError) && (
              <span className="text-xs text-gray-500">Sin evidencia</span>
            )}
          </div>

          {/* Ver en modal */}
          {eviImgSrc && !eviError && (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenEvidence(eviImgSrc)}
                className="inline-flex items-center gap-1 text-[#174940] hover:underline text-sm"
                title="Ver evidencia completa"
              >
                <Eye className="h-4 w-4" />
                Ver completo
              </button>
            </div>
          )}

        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[statusItem]}`}>
            {statusItem}
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
    </>
  )
}