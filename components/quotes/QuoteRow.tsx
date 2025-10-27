'use client'

import { Box, Percent } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type MarginKey = `margenPct${number}` | `precioFinal${number}` | `subtotal${number}` | `ganancia${number}`
type ItemWithMargins = Item & Partial<Record<MarginKey, number>>

export function QuoteRow({
  item,
  setItem,
  isProductQuote,
  selectedFormats,
  isSent,
  getProductImageDataUrl,
}: {
  item: ItemWithMargins
  setItem: (newItem: ItemWithMargins) => void
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
  getProductImageDataUrl: (id: string) => Promise<string | null>
}) {
  const entity = isProductQuote ? item.product! : item.service!
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!isProductQuote || !item.product?.id) {
      setImgSrc(null)
      return
    }
    let active = true
    getProductImageDataUrl(String(item.product.id))
      .then((url) => active && setImgSrc(url))
      .catch(() => active && setImgSrc(null))
    return () => {
      active = false
    }
  }, [isProductQuote, item.product?.id, getProductImageDataUrl])

  const calcularMargen = (formatIndex: number, pct: number) => {
    const subtotal = item.cantidad * item.costo_unitario
    const precioFinal = subtotal + (subtotal * pct / 100)
    const ganancia = precioFinal - subtotal
    setItem({
      ...item,
      [`margenPct${formatIndex}`]: pct,
      [`precioFinal${formatIndex}`]: precioFinal,
      [`subtotal${formatIndex}`]: subtotal,
      [`ganancia${formatIndex}`]: ganancia,
    })
  }

  return (
    <tr className="hover:bg-[#f0f7f5] transition-colors">
      <td className="py-4 px-4 sticky left-0 bg-white z-10 w-[180px]">
        <div className="flex items-center gap-2">
          {isProductQuote ? (
            <div className="h-10 w-10 rounded-lg overflow-hidden border border-[#e5e7eb]">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={entity.nombre}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 bg-gray-100 flex items-center justify-center">
                  <Box className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          ) : null}
          <div className="truncate">{entity.nombre}</div>
        </div>
      </td>

      {isProductQuote && (
        <td className="py-4 px-4 text-center w-[60px]">
          <input
            title='cantidad'
            type="number"
            min={0}
            value={item.cantidad}
            className="w-16 text-center border border-[#e5e7eb] rounded-lg px-1 py-1 bg-gray-100 cursor-not-allowed"
            disabled={true} 
          />
        </td>
      )}


      <td className="py-4 px-4 text-center font-medium text-[#174940] w-[100px]">
        ${item.costo_unitario.toFixed(2)}
      </td>

      {selectedFormats.map((format) => {
        const pct = item[`margenPct${format}`] ?? 0
        const subtotal = item[`subtotal${format}`] ?? item.cantidad * item.costo_unitario
        const precioFinal = item[`precioFinal${format}`] ?? subtotal + subtotal * (pct / 100)
        const ganancia = item[`ganancia${format}`] ?? precioFinal - subtotal

        return (
          <td key={format} className="py-4 px-4 text-center min-w-[120px]">
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <input
                  title='porcentaje'
                  type="number"
                  step="0.1"
                  value={pct}
                  onChange={(e) =>
                    calcularMargen(format, parseFloat(e.target.value) || 0)
                  }
                  className="w-20 text-center px-3 py-1.5 pl-7 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none"
                  disabled={isSent}
                />
                <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="bg-[#f8fafc] p-1 rounded-lg w-full text-center border border-[#e5e7eb] text-xs">
                <div>Precio Final</div>
                <div className="font-bold">${precioFinal.toFixed(2)}</div>
                <div className="border-t border-[#e5e7eb] my-0.5" />
                <div>Subtotal</div>
                <div className="font-bold">${subtotal.toFixed(2)}</div>
                <div className="border-t border-[#e5e7eb] my-0.5" />
                <div>Ganancia</div>
                <div className="font-bold">${ganancia.toFixed(2)}</div>
              </div>
            </div>
          </td>
        )
      })}
    </tr>
  )
}