'use client'

import { Box, Percent } from 'lucide-react'
import type { Item } from '@/src/schemas'
import Image from 'next/image'

type MarginKey = `margenPct${number}` | `precioFinal${number}` | `subtotal${number}` | `ganancia${number}`
type ItemWithMargins = Item & Partial<Record<MarginKey, number>>

export function QuoteRow({
  item,
  setItem,
  isProductQuote,
  selectedFormats,
  isSent,
}: {
  item: ItemWithMargins
  setItem: (newItem: ItemWithMargins) => void
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
}) {
  const entity = isProductQuote ? item.product! : item.service!

  const imgSrc = isProductQuote && item.product?.id
    ? (item as Item).imageUrl
    : null

  // Al cambiar un porcentaje, actualizamos el margen localmente (y calculamos valores temporales de UX)
  const calcularMargen = (format: number, pct: number) => {
    const key = `margenPct${format}` as keyof ItemWithMargins
    // actualizamos solo el porcentaje; los precios finales y subtotales los calculará el backend
    // pero podemos mostrar un cálculo temporal para buena UX
    const cantidad = Number(item.cantidad) || 0
    const costo = Number(item.costo_unitario) || 0
    const subtotal = +(cantidad * costo).toFixed(2)
    const precioFinal = +(subtotal * (1 + (pct || 0) / 100)).toFixed(2)
    const ganancia = +(precioFinal - subtotal).toFixed(2)

    setItem({
      ...item,
      [key]: pct,
      // también dejamos estos valores temporales para mostrar inmediatamente
      [`subtotal${format}`]: subtotal,
      [`precioFinal${format}`]: precioFinal,
      [`ganancia${format}`]: ganancia,
    } as ItemWithMargins)
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
        ${Number(item.costo_unitario).toFixed(2)}
      </td>

      {selectedFormats.map((format) => {
        const keyPct = `margenPct${format}` as keyof ItemWithMargins
        const keySub = `subtotal${format}` as keyof ItemWithMargins
        const keyPrecio = `precioFinal${format}` as keyof ItemWithMargins
        const keyGan = `ganancia${format}` as keyof ItemWithMargins

        const pct = Number(item[keyPct]) || 0
        const subtotal = Number(item[keySub]) || (Number(item.cantidad) * Number(item.costo_unitario))
        const precioFinal = Number(item[keyPrecio]) || (subtotal * (1 + (pct / 100)))
        const ganancia = Number(item[keyGan]) || (precioFinal - subtotal)

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
                <div className="font-bold">${Number(precioFinal).toFixed(2)}</div>
                <div className="border-t border-[#e5e7eb] my-0.5" />
                <div>Subtotal</div>
                <div className="font-bold">${Number(subtotal).toFixed(2)}</div>
                <div className="border-t border-[#e5e7eb] my-0.5" />
                <div>Ganancia</div>
                <div className="font-bold">${Number(ganancia).toFixed(2)}</div>
              </div>
            </div>
          </td>
        )
      })}
    </tr>
  )
}
