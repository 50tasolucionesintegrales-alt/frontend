'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { QuoteRow } from './QuoteRow'
import Image from 'next/image'
import { updateItemAction } from '@/actions/quotes/updateItemAction'
import { toast } from 'react-toastify'

type MarginKey = `margenPct${number}` | `precioFinal${number}` | `subtotal${number}`
type ItemWithMargins = Item & Partial<Record<MarginKey, number>>

export function QuoteTable({
  quoteId,
  items,
  isProductQuote,
  selectedFormats,
  isSent,
  onSubmit,
  getProductImageDataUrl,
}: {
  quoteId: string
  items: Item[]
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
  onSubmit: (fd: FormData) => void
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
    const base = isProductQuote ? 880 : 760
    const perMargin = 220
    return base + selectedFormats.length * perMargin
  }, [isProductQuote, selectedFormats])

  // Aplica o borra márgenes de una columna
  const toggleColumnMargin = async (column: number, checked: boolean) => {
    setColumnCheckboxes((prev) => ({ ...prev, [column]: checked }))
    const updatedItems = localItems.map((item) => {
      const newItem = { ...item }
      if (checked) newItem[`margenPct${column}`] = column * 5
      else newItem[`margenPct${column}`] = undefined
      return newItem
    })
    setLocalItems(updatedItems)

    // Actualiza cada fila en el servidor
    for (const item of updatedItems) {
      const fd = new FormData()
      fd.append('itemId', item.id)
      fd.append('quoteId', quoteId)
      fd.append(`margenPct${column}`, String(item[`margenPct${column}`] ?? ''))
      try {
        const res = await updateItemAction({ errors: [], success: '' }, fd)
        if (res?.error) toast.error(res.error)
      } catch (err) {
        console.error(err)
        toast.error('Error actualizando margen')
      }
    }
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
            <thead className="bg-[#174940]">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider sticky left-0 bg-[#174940] z-20">
                  {isProductQuote ? 'Producto' : 'Servicio'}
                </th>

                {isProductQuote && (
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Cantidad
                  </th>
                )}

                <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Costo Unitario
                </th>

                {selectedFormats.map((n) => (
                  <th
                    key={n}
                    className="py-4 px-6 text-center text-sm font-medium text-white uppercase tracking-wider"
                  >
                    Margen {n}
                  </th>
                ))}

                {!isSent && (
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider sticky right-0 bg-[#174940] z-20">
                    Acción
                  </th>
                )}
              </tr>

              {/* Checkbox debajo de cada columna */}
              <tr className="bg-[#f0f7f5]">
                <td colSpan={isProductQuote ? 3 : 2}></td>
                {selectedFormats.map((n) => (
                  <td key={`chk-${n}`} className="text-center py-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        title='checkbox'
                        type="checkbox"
                        checked={!!columnCheckboxes[n]}
                        onChange={(e) => toggleColumnMargin(n, e.target.checked)}
                        className="w-4 h-4 accent-[#174940]"
                      />
                    </label>
                  </td>
                ))}
                { !isSent && <td></td> }
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {localItems.map((item) => (
                <QuoteRow
                  key={item.id}
                  item={item}
                  isProductQuote={isProductQuote}
                  selectedFormats={selectedFormats}
                  isSent={isSent}
                  onSubmit={onSubmit}
                  quoteId={quoteId}
                  getProductImageDataUrl={getProductImageDataUrl}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {localItems.map((item) => (
          <MobileQuoteCard
            key={item.id}
            quoteId={quoteId}
            item={item}
            isProductQuote={isProductQuote}
            selectedFormats={selectedFormats}
            isSent={isSent}
            onSubmit={onSubmit}
            getProductImageDataUrl={getProductImageDataUrl}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------- Mobile card ----------------
function MobileQuoteCard({
  item,
  isProductQuote,
  getProductImageDataUrl,
}: {
  quoteId: string
  item: Item
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
  onSubmit: (fd: FormData) => void
  getProductImageDataUrl: (id: string) => Promise<string | null>
}) {
  const entity = isProductQuote ? item.product! : item.service!
  const [img, setImg] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (isProductQuote && item.product?.id) {
      getProductImageDataUrl(String(item.product.id))
        .then((u) => active && setImg(u ?? null))
        .catch(() => active && setImg(null))
    } else {
      setImg(null)
    }
    return () => {
      active = false
    }
  }, [isProductQuote, item.product?.id, getProductImageDataUrl])

  return (
    <div className="border border-[#e5e7eb] rounded-xl p-3 bg-white">
      <div className="flex items-start gap-3">
        {isProductQuote && (
          <div className="h-14 w-14 rounded-lg border border-[#e5e7eb] overflow-hidden bg-gray-50 flex items-center justify-center">
            {img ? (
              <Image
                src={img ?? "/placeholder.png"}
                alt={entity.nombre}
                width={400}
                height={400}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="text-xs text-gray-400">Sin img</div>
            )}
          </div>
        )}

        <div className="flex-1">
          <div className="font-medium text-[#0F332D]">{entity.nombre}</div>
          {!isProductQuote && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              {entity.descripcion ?? '—'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
