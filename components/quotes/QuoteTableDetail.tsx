'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { QuoteRow } from './QuoteRow'
import { toast } from 'react-toastify'

type MarginKey = `margenPct${number}` | `precioFinal${number}` | `subtotal${number}` | `ganancia${number}`
type ItemWithMargins = Item & Partial<Record<MarginKey, number>>

const PRESET_PCT = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

const formatToEmpresaMap: Record<number, string> = {
    1: 'Goltech',
    2: 'Juan Ángel Bazán',
    3: 'Alejandra G. Hernández',
    4: 'Adrián Orihuela',
    5: 'Mariana Loeza',
    6: 'Michelle',
    7: 'Chalor',
    8: 'Leyses Soluciones',
    9: 'Eduardo Suárez (ES)',
    10: 'Jessica Rabadán',
}


export function QuoteTable({
  items,
  isProductQuote,
  selectedFormats,
  isSent,
  getProductImageDataUrl,
}: {
  quoteId: string
  items: Item[]
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
  getProductImageDataUrl: (id: string) => Promise<string | null>
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [localItems, setLocalItems] = useState<ItemWithMargins[]>(items)
  const [columnCheckboxes, setColumnCheckboxes] = useState<Record<number, boolean>>(
    selectedFormats.reduce((acc, n) => ({ ...acc, [n]: false }), {})
  )

  const minWidth = useMemo(() => {
    const base = isProductQuote ? 480 : 380
    const perMargin = 140
    return base + selectedFormats.length * perMargin
  }, [isProductQuote, selectedFormats])

  const calcularMargenes = (item: ItemWithMargins, format: number) => {
    const pct = item[`margenPct${format}`] ?? 0
    const subtotal = item.cantidad * item.costo_unitario
    const precioFinal = subtotal + subtotal * (pct / 100)
    const ganancia = precioFinal - subtotal
    return { subtotal, precioFinal, ganancia }
  }

  const calcularTodo = () => {
    const updated = localItems.map((item) => {
      const newItem = { ...item }
      selectedFormats.forEach((format) => {
        const res = calcularMargenes(newItem, format)
        newItem[`subtotal${format}`] = res.subtotal
        newItem[`precioFinal${format}`] = res.precioFinal
        newItem[`ganancia${format}`] = res.ganancia
      })
      return newItem
    })
    setLocalItems(updated)
    toast.success('Todos los márgenes recalculados')
  }

  const toggleColumnMargin = (format: number, checked: boolean) => {
    setColumnCheckboxes((prev) => ({ ...prev, [format]: checked }))
    const formatIndex = selectedFormats.indexOf(format)
    const pctDefault = checked ? PRESET_PCT[formatIndex] ?? 0 : 0
    setLocalItems((prev) =>
      prev.map((item) => {
        const { subtotal } = calcularMargenes(item, format)
        return {
          ...item,
          [`margenPct${format}`]: pctDefault,
          [`subtotal${format}`]: subtotal,
          [`precioFinal${format}`]: subtotal + subtotal * (pctDefault / 100),
          [`ganancia${format}`]: subtotal * (pctDefault / 100),
        }
      })
    )
  }

  const handleScrollState = () => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setAtStart(scrollLeft <= 2)
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 2)
  }

  useEffect(() => {
    handleScrollState()
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => handleScrollState()
    el.addEventListener('scroll', onScroll, { passive: true })
    const r = new ResizeObserver(() => handleScrollState())
    r.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      r.disconnect()
    }
  }, [])

  const scrollByX = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' })

  return (
    <div className="relative">
      <div className="flex justify-end mb-2">
        {!isSent && (
          <button
            onClick={calcularTodo}
            className="px-4 py-2 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors"
          >
            Calcular todo
          </button>
        )}
      </div>

      <div className="hidden md:block relative">
        {!atStart && (
          <button
            onClick={() => scrollByX(-320)}
            className="hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-2 z-20 bg-white text-[#174940] p-2 rounded-full shadow-md hover:bg-[#f0f7f5]"
            aria-label="Scroll izquierdo"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {!atEnd && (
          <button
            onClick={() => scrollByX(320)}
            className="hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-2 z-20 bg-white text-[#174940] p-2 rounded-full shadow-md hover:bg-[#f0f7f5]"
            aria-label="Scroll derecho"
          >
            <ChevronRight size={22} />
          </button>
        )}

        <div
          ref={scrollerRef}
          className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <table className="w-full divide-y divide-[#e5e7eb]" style={{ minWidth }}>
           <thead className="bg-[#174940] text-white text-sm uppercase tracking-wider">
            <tr>
              <th className="py-4 px-4 sticky left-0 bg-[#174940] z-20 w-[180px]">
                {isProductQuote ? 'Producto' : 'Servicio'}
              </th>
              {isProductQuote && <th className="py-4 px-4">Cantidad</th>}
              <th className="py-4 px-4">Costo Unitario</th>
              {selectedFormats.map((format) => {
                // Mapeo de formato → empresa
                const empresaNombre = formatToEmpresaMap[format] ?? `Formato ${format}`
                return (
                  <th key={format} className="py-4 px-4 text-center">
                    Margen {empresaNombre}
                  </th>
                )
              })}
            </tr>

            {/* Checkbox debajo de cada columna */}
            {!isSent && (
              <tr className="bg-[#f0f7f5]">
                <td colSpan={isProductQuote ? 3 : 2}></td>
                {selectedFormats.map((format) => (
                  <td key={`chk-${format}`} className="text-center py-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-[#63B23D]">
                      <input
                        title="checkbox"
                        type="checkbox"
                        checked={!!columnCheckboxes[format]}
                        onChange={(e) => toggleColumnMargin(format, e.target.checked)}
                        className="w-4 h-4 accent-[#174940]"
                      />
                      PREDET.
                    </label>
                  </td>
                ))}
              </tr>
            )}
          </thead>


            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {localItems.map((item, idx) => (
                <QuoteRow
                  key={item.id}
                  item={item}
                  setItem={(newItem) =>
                    setLocalItems((prev) =>
                      prev.map((it, i) => (i === idx ? newItem : it))
                    )
                  }
                  isProductQuote={isProductQuote}
                  selectedFormats={selectedFormats}
                  isSent={isSent}
                  getProductImageDataUrl={getProductImageDataUrl}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}