'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { QuoteRow } from './QuoteRow'
import { toast } from 'react-toastify'
import { updateQuoteItemsAction } from '@/actions/quotes/UpdateItemsAction'
import { useRouter } from 'next/navigation'

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

type BatchUpdateItemDto = {
  id: string;
  cantidad?: number;
  costo_unitario?: number;
  margenPct1?: number | null;
  margenPct2?: number | null;
  margenPct3?: number | null;
  margenPct4?: number | null;
  margenPct5?: number | null;
  margenPct6?: number | null;
  margenPct7?: number | null;
  margenPct8?: number | null;
  margenPct9?: number | null;
  margenPct10?: number | null;
}

export function QuoteTable({
  quoteId,
  items,
  isProductQuote,
  selectedFormats,
  isSent,
}: {
  quoteId: string
  items: Item[]
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [columnCheckboxes, setColumnCheckboxes] = useState<Record<number, boolean>>(
    selectedFormats.reduce((acc, n) => ({ ...acc, [n]: false }), {})
  )

  const [localItems, setLocalItems] = useState<ItemWithMargins[]>(items)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const minWidth = useMemo(() => {
    const base = isProductQuote ? 480 : 380
    const perMargin = 140
    return base + selectedFormats.length * perMargin
  }, [isProductQuote, selectedFormats])

  const handleSaveAll = async () => {
    setIsSaving(true)

    const dtos: BatchUpdateItemDto[] = localItems.map(item => ({
      id: item.id,
      cantidad: item.cantidad,
      costo_unitario: item.costo_unitario,
      margenPct1: (item as Item).margenPct1 ?? null,
      margenPct2: (item as Item).margenPct2 ?? null,
      margenPct3: (item as Item).margenPct3 ?? null,
      margenPct4: (item as Item).margenPct4 ?? null,
      margenPct5: (item as Item).margenPct5 ?? null,
      margenPct6: (item as Item).margenPct6 ?? null,
      margenPct7: (item as Item).margenPct7 ?? null,
      margenPct8: (item as Item).margenPct8 ?? null,
      margenPct9: (item as Item).margenPct9 ?? null,
      margenPct10: (item as Item).margenPct10 ?? null,
    }))

    const result = await updateQuoteItemsAction(quoteId, dtos)

    if (result.success) {
      toast.success('¡Cambios guardados con éxito!')
      const returnedItems = (result).items
      if (Array.isArray(returnedItems) && returnedItems.length > 0) {
        setLocalItems(returnedItems as ItemWithMargins[])
      } else {
        router.refresh()
      }
    } else {
      toast.error(result.error || 'Error al guardar.')
    }
    setIsSaving(false)
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

  const toggleColumnMargin = (format: number, checked: boolean) => {
    setColumnCheckboxes(prev => ({ ...prev, [format]: checked }))
    const preset = PRESET_PCT[format - 1] ?? PRESET_PCT[0]
    setLocalItems(prev =>
      prev.map(it => ({
        ...it,
        [`margenPct${format}`]: checked ? preset : null,
      }))
    )
  }

  return (
    <div className="relative">

      {!isSent && (
        <div className="flex flex-col justify-end mb-4">
          <div className="flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors"
            >
              {isSaving ? 'Calculando...' : 'Calcular todos los cambios'}
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-1 pr-2 text-right">
            Antes de enviar la cotización, asegúrate de calcular todos los precios para que se guarden correctamente.
          </p>
        </div>
      )}

      <div className="relative">

        {!atStart && (
          <button
            title='start'
            onClick={() => scrollByX(-320)}
            className="hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-2 z-30 bg-white text-[#174940] p-2 rounded-full shadow-md hover:bg-[#f0f7f5]"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {!atEnd && (
          <button
            title='end'
            onClick={() => scrollByX(320)}
            className="hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-2 z-30 bg-white text-[#174940] p-2 rounded-full shadow-md hover:bg-[#f0f7f5]"
          >
            <ChevronRight size={22} />
          </button>
        )}

        <div
          ref={scrollerRef}
          className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-x-auto"
        >
          <table className="divide-y divide-[#e5e7eb]" style={{ minWidth }}>
            <thead className="bg-[#174940] text-white text-sm uppercase tracking-wider">
              <tr>
                <th
                  className="
                    py-4 px-4 w-[180px]
                    sticky left-0 z-20 bg-[#174940]
                  "
                >
                  {isProductQuote ? 'Producto' : 'Servicio'}
                </th>

                {isProductQuote && (
                  <th className="py-4 px-4">
                    Cantidad
                  </th>
                )}

                <th className="py-4 px-4">Costo Unitario</th>

                {selectedFormats.map((format) => {
                  const empresaNombre = formatToEmpresaMap[format] ?? `Formato ${format}`
                  return (
                    <th key={format} className="py-4 px-4 text-center">
                      Margen {empresaNombre}
                    </th>
                  )
                })}
              </tr>

              {!isSent && (
                <tr className="bg-[#f0f7f5]">
                  <td
                    className="sticky left-0 bg-[#f0f7f5] z-20"
                  ></td>

                  {isProductQuote && <td></td>}
                  <td></td>

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
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
