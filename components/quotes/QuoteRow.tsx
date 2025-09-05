'use client'
import Link from 'next/link'
import { Box, Percent, Edit3 } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { useEffect, useState } from 'react'

export function QuoteRow({
  item, isProductQuote, selectedFormats, isSent, onSubmit, quoteId, getProductImageDataUrl
}: {
  item: Item
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
  onSubmit: (fd: FormData)=>void
  quoteId: string
  getProductImageDataUrl: (id: string) => Promise<string | null>
}) {
  const entity = isProductQuote ? item.product! : item.service!

  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isProductQuote || !item.product?.id) {
      setImgSrc(null)
      return
    }
    let active = true
    setLoading(true)
    getProductImageDataUrl(String(item.product.id))
      .then((url) => { if (active) setImgSrc(url) })
      .catch(() => { if (active) setImgSrc(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isProductQuote, item.product?.id, getProductImageDataUrl])

  return (
    <tr className="hover:bg-[#f0f7f5] transition-colors">
      {/* Producto/Servicio (sticky) */}
      <td className="py-4 px-6 sticky left-0 bg-white z-10">
        <div className="flex items-center gap-4">
          {/* SOLO productos muestran imagen/badge */}
          {isProductQuote ? (
            <div className="flex-shrink-0">
              {loading ? (
                <div className="h-12 w-12 rounded-lg border border-[#e5e7eb] bg-gray-100 animate-pulse" />
              ) : imgSrc ? (
                <div className="h-12 w-12 rounded-lg overflow-hidden border border-[#e5e7eb]">
                  <img src={imgSrc} alt={entity.nombre} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center border border-[#e5e7eb]">
                  <Box className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
          ) : null}

          <div>
            <div className="font-medium text-[#0F332D]">{entity.nombre}</div>
            {isProductQuote ? (
              (entity as any).link_compra ? (
                <Link
                  href={(entity as any).link_compra}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#63B23D] hover:underline flex items-center mt-1"
                >
                  Comprar producto
                </Link>
              ) : null
            ) : (entity as any).link ? (
              <Link
                href={(entity as any).link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#63B23D] hover:underline flex items-center mt-1"
              >
                Ver detalles del servicio
              </Link>
            ) : (
              <div className="text-sm text-[#999999] mt-1">
                {(entity as any).descripcion?.slice(0, 80) ?? '—'}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Cantidad → SOLO productos muestran la celda */}
      {isProductQuote && (
        <td className="py-4 px-6">
          <input
            type="number"
            name="cantidad"
            defaultValue={item.cantidad}
            className={`w-20 px-3 py-1.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all ${isSent ? 'bg-gray-100' : 'bg-white'}`}
            form={`form-${item.id}`}
            disabled={isSent}
            min={1}
          />
        </td>
      )}

      {/* Costo Unitario */}
      <td className="py-4 px-6">
        <div className="text-[#174940] font-medium text-center">
          ${item.costo_unitario.toFixed(2)}
        </div>
      </td>

      {/* Márgenes dinámicos */}
      {selectedFormats.map(n => {
        const pct = (item as any)[`margenPct${n}`]
        const precio = (item as any)[`precioFinal${n}`]
        const subtotal = (item as any)[`subtotal${n}`]
        return (
          <td key={n} className="py-4 px-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <input
                  type="number"
                  step="0.01"
                  name={`margenPct${n}`}
                  defaultValue={pct}
                  className={`w-24 px-3 py-1.5 pl-8 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all text-center ${isSent ? 'bg-gray-100' : 'bg-white'}`}
                  form={`form-${item.id}`}
                  disabled={isSent}
                />
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
              </div>
              <div className="bg-[#f8fafc] p-2 rounded-lg w-full text-center border border-[#e5e7eb]">
                <div className="text-xs font-medium text-[#174940] mb-1">Precio Final</div>
                <div className="text-sm font-bold text-[#0F332D]">${precio?.toFixed(2) ?? '—'}</div>
                <div className="border-t border-[#e5e7eb] my-1" />
                <div className="text-xs font-medium text-[#174940] mb-1">Subtotal</div>
                <div className="text-sm font-bold text-[#0F332D]">${subtotal?.toFixed(2) ?? '—'}</div>
              </div>
            </div>
          </td>
        )
      })}

      {/* Acción (sticky) */}
      {!isSent && (
        <td className="py-4 px-6 sticky right-0 bg-white z-10">
          <form id={`form-${item.id}`} action={onSubmit}>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="quoteId" value={quoteId} />

            {/* Para SERVICIOS: manda cantidad escondida aquí */}
            {!isProductQuote && (
              <input type="hidden" name="cantidad" value={item.cantidad} />
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center gap-1"
            >
              <Edit3 className="h-4 w-4" />
              <span>Calcular</span>
            </button>
          </form>
        </td>
      )}
    </tr>
  )
}
