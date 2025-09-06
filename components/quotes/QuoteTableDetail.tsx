'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { QuoteRow } from './QuoteRow'
import Image from 'next/image'

type MarginKey =
  | `margenPct${number}`
  | `precioFinal${number}`
  | `subtotal${number}`;

type ItemWithMargins = Item & Partial<Record<MarginKey, number>>;


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

  const minWidth = useMemo(() => {
    const base = isProductQuote ? 880 : 760
    const perMargin = 220
    return base + selectedFormats.length * perMargin
  }, [isProductQuote, selectedFormats])

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

        {!atStart && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10" />
        )}
        {!atEnd && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />
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
            </thead>

            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {items.map((item) => (
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

      <div className="md:hidden space-y-3">
        {items.map((item) => (
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

function MobileQuoteCard({
  quoteId,
  item,
  isProductQuote,
  selectedFormats,
  isSent,
  onSubmit,
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

          <div className="mt-2 grid grid-cols-2 gap-2">
            {isProductQuote && (
              <label className="block">
                <span className="text-xs text-gray-500">Cantidad</span>
                <input
                  type="number"
                  name="cantidad"
                  defaultValue={item.cantidad}
                  min={1}
                  disabled={isSent}
                  form={`m-form-${item.id}`}
                  className="mt-1 w-full border border-[#e5e7eb] rounded-lg px-2 py-1.5 text-sm"
                />
              </label>
            )}

            <label className="block">
              <span className="text-xs text-gray-500">Costo unitario</span>
              <div className="mt-1 font-medium text-[#174940]">
                ${item.costo_unitario.toFixed(2)}
              </div>
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {selectedFormats.map((n) => {
              const it = item as ItemWithMargins;
              const pct = it[`margenPct${n}`];
              const precio = it[`precioFinal${n}`];
              const subtotal = it[`subtotal${n}`];
              return (
                <div key={n} className="border border-[#e5e7eb] rounded-lg p-2">
                  <div className="text-[10px] text-gray-500">Margen {n}</div>
                  <input
                    title='margen'
                    type="number"
                    step="0.01"
                    name={`margenPct${n}`}
                    defaultValue={pct}
                    disabled={isSent}
                    form={`m-form-${item.id}`}
                    className="mt-1 w-full border border-[#e5e7eb] rounded px-2 py-1 text-sm"
                  />
                  <div className="mt-2 text-[11px] text-gray-500">Precio final</div>
                  <div className="text-sm font-semibold">${precio?.toFixed(2) ?? '—'}</div>
                  <div className="mt-1 text-[11px] text-gray-500">Subtotal</div>
                  <div className="text-sm font-semibold">${subtotal?.toFixed(2) ?? '—'}</div>
                </div>
              )
            })}
          </div>

          {!isSent && (
            <form id={`m-form-${item.id}`} action={onSubmit} className="mt-3">
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="quoteId" value={quoteId} />
              {!isProductQuote && (
                <input type="hidden" name="cantidad" value={item.cantidad} />
              )}
              <button
                type="submit"
                className="w-full mt-2 px-3 py-2 bg-[#63B23D] text-white rounded-lg text-sm"
              >
                Calcular
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
