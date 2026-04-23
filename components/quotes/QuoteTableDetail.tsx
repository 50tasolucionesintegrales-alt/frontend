'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Settings, Check } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { QuoteRow } from './QuoteRow'
import { toast } from 'react-toastify'
import { updateQuoteItemsAction } from '@/actions/quotes/UpdateItemsAction'
import { deleteItemAction } from '@/actions/quotes/DeleteItemAction'
import { useRouter } from 'next/navigation'

type MarginKey = `margenPct${number}` | `precioFinal${number}` | `subtotal${number}` | `ganancia${number}`
type ItemWithMargins = Item & Partial<Record<MarginKey, number>>

const formatToEmpresaMap: Record<number, string> = {
  1: 'Goltech',
  2: 'Juan Á.',
  3: 'Alejandra G.',
  4: 'Adrián O.',
  5: 'Mariana L.',
  6: 'Michelle',
  7: 'Chalor',
  8: 'Leyses',
  9: 'Eduardo S.',
  10: 'Jessica R.',
  11: 'Grupo Álamo',
  12: 'Hugo R.',
}

// Definir el tipo correctamente con margenPct12
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
  margenPct11?: number | null;
  margenPct12?: number | null;  // <-- AGREGADO
}

export function QuoteTable({
  quoteId,
  items: initialItems,
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
  
  // Estado para modales de margen por empresa
  const [marginModalOpen, setMarginModalOpen] = useState<number | null>(null)
  const [tempMarginValue, setTempMarginValue] = useState<string>('')
  const [appliedMargins, setAppliedMargins] = useState<Record<number, number | null>>({})

  const [localItems, setLocalItems] = useState<ItemWithMargins[]>(initialItems)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  // Sincronizar items locales cuando cambian los props
  useEffect(() => {
    setLocalItems(initialItems)
    
    // Extraer márgenes actuales de los items para mostrarlos en los botones
    if (initialItems.length > 0) {
      const firstItem = initialItems[0]
      const currentMargins: Record<number, number | null> = {}
      
      selectedFormats.forEach(format => {
        const marginKey = `margenPct${format}` as keyof ItemWithMargins
        const marginValue = (firstItem as any)[marginKey]
        currentMargins[format] = marginValue !== undefined && marginValue !== null ? marginValue : null
      })
      
      setAppliedMargins(currentMargins)
    }
  }, [initialItems, selectedFormats])

  const minWidth = useMemo(() => {
    const base = isProductQuote ? 480 : 380
    const perMargin = 160
    return base + selectedFormats.length * perMargin
  }, [isProductQuote, selectedFormats])

  const handleSaveAll = async () => {
    setIsSaving(true)

    try {
      const dtos: BatchUpdateItemDto[] = localItems.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        costo_unitario: item.costo_unitario,
        margenPct1: (item as any).margenPct1 ?? null,
        margenPct2: (item as any).margenPct2 ?? null,
        margenPct3: (item as any).margenPct3 ?? null,
        margenPct4: (item as any).margenPct4 ?? null,
        margenPct5: (item as any).margenPct5 ?? null,
        margenPct6: (item as any).margenPct6 ?? null,
        margenPct7: (item as any).margenPct7 ?? null,
        margenPct8: (item as any).margenPct8 ?? null,
        margenPct9: (item as any).margenPct9 ?? null,
        margenPct10: (item as any).margenPct10 ?? null,
        margenPct11: (item as any).margenPct11 ?? null,
        margenPct12: (item as any).margenPct12 ?? null,
      }))

      const res = await fetch(`/api/quotes/${quoteId}/items`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dtos),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(json.message || 'Error al guardar los cambios')
        return
      }

      if (Array.isArray(json.items) && json.items.length > 0) {
        setLocalItems(prev => prev.map(localItem => {
          const updated = json.items.find((i: any) => i.id === localItem.id)
          return updated ? { ...localItem, ...updated } : localItem
        }))
      }

      toast.success('¡Cambios guardados con éxito!')

    } catch (error) {
      toast.error('Error al procesar la solicitud')
    } finally {
      setIsSaving(false)
    }
  }

  // Abrir modal para establecer margen
  const openMarginModal = (format: number) => {
    const currentMargin = appliedMargins[format]
    setTempMarginValue(currentMargin !== null ? currentMargin.toString() : '')
    setMarginModalOpen(format)
  }

  // Aplicar margen a todos los items de esta empresa
  const applyMarginToAll = (format: number) => {
    let marginValue: number | null = null
    
    if (tempMarginValue.trim() !== '') {
      const parsed = parseFloat(tempMarginValue)
      if (isNaN(parsed) || parsed < 0 || parsed > 1000) {
        toast.error('El margen debe estar entre 0 y 1000%')
        return
      }
      marginValue = parsed
    }

    // Actualizar margen aplicado
    setAppliedMargins(prev => ({
      ...prev,
      [format]: marginValue
    }))

    // Aplicar a todos los items en el estado local
    setLocalItems(prev =>
      prev.map(item => ({
        ...item,
        [`margenPct${format}`]: marginValue,
      }))
    )

    setMarginModalOpen(null)
    
    if (marginValue !== null) {
      toast.success(`Margen ${marginValue}% aplicado a todos los productos para ${formatToEmpresaMap[format] || `Empresa ${format}`}`)
    } else {
      toast.success(`Margen eliminado para ${formatToEmpresaMap[format] || `Empresa ${format}`}`)
    }
  }

  // Función para eliminar ítem con actualización optimista
  const handleDeleteItem = async (itemId: string) => {
    if (isDeleting === itemId) return
    
    setIsDeleting(itemId)
    
    // Guardar el estado actual para poder revertir en caso de error
    const previousItems = [...localItems]
    
    // Actualización optimista: eliminar del estado local inmediatamente
    setLocalItems(prev => prev.filter(item => item.id !== itemId))
    
    try {
      const result = await deleteItemAction(itemId)
      
      if (result.success) {
        toast.success('Producto eliminado de la cotización')
        // Refrescar para asegurar que todo esté sincronizado
        setTimeout(() => {
          router.refresh()
        }, 100)
      } else {
        // Si hay error, revertir la eliminación optimista
        setLocalItems(previousItems)
        throw new Error(result.error ?? 'Error al eliminar el ítem')
      }
    } catch (error) {
      setLocalItems(previousItems)
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el producto')
    } finally {
      setIsDeleting(null)
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

  const updateItem = useCallback((itemId: string, updates: Partial<ItemWithMargins>) => {
    setLocalItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    )
  }, [])

  return (
    <div className="relative">
      {/* Modal para establecer margen */}
      {marginModalOpen !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#0F332D] mb-2">
              Establecer margen para {formatToEmpresaMap[marginModalOpen] || `Empresa ${marginModalOpen}`}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Este margen se aplicará a todos los productos de la cotización
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margen (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1000"
                    value={tempMarginValue}
                    onChange={(e) => setTempMarginValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174940] focus:border-transparent"
                    placeholder="Ej: 15.5"
                    autoFocus
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Deja vacío para quitar el margen
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => applyMarginToAll(marginModalOpen)}
                  className="flex-1 px-4 py-2 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors"
                >
                  Aplicar a todos
                </button>
                <button
                  onClick={() => setMarginModalOpen(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isSent && (
        <div className="flex flex-col justify-end mb-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando y recalculando...' : 'Guardar y recalcular'}
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-1 pr-2 text-right">
            {isSaving 
              ? 'Calculando precios y guardando cambios...' 
              : 'Si los cambios no se visualizan, prueba mandando la cotización.'
            }
          </p>
        </div>
      )}

      <div className="relative">
        {!atStart && (
          <button
            onClick={() => scrollByX(-320)}
            className="hidden lg:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-2 z-30 bg-white text-[#174940] p-2 rounded-full shadow-md hover:bg-[#f0f7f5]"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {!atEnd && (
          <button
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
                <th className="py-4 px-4 w-[200px] sticky left-0 z-20 bg-[#174940]">
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
                      {empresaNombre}
                    </th>
                  )
                })}
              </tr>

              {!isSent && (
                <tr className="bg-[#f0f7f5]">
                  <td className="sticky left-0 bg-[#f0f7f5] z-20"> </td>
                  {isProductQuote && <td> </td>}
                  <td> </td>

                  {selectedFormats.map((format) => {
                    const currentMargin = appliedMargins[format]
                    return (
                      <td key={`btn-${format}`} className="text-center py-2">
                        <button
                          onClick={() => openMarginModal(format)}
                          className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm
                            ${currentMargin !== null 
                              ? 'bg-[#174940] text-white hover:bg-[#0F332D]' 
                              : 'bg-white text-[#174940] border border-[#174940] hover:bg-[#f0f7f5]'
                            }
                          `}
                        >
                          <Settings size={14} />
                          {currentMargin !== null ? `${currentMargin}%` : 'Establecer margen'}
                          {currentMargin !== null && <Check size={14} />}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              )}
            </thead>

            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {localItems.map((item) => (
                <QuoteRow
                  key={item.id}
                  item={item}
                  setItem={(newItem) => updateItem(item.id, newItem)}
                  isProductQuote={isProductQuote}
                  selectedFormats={selectedFormats}
                  isSent={isSent}
                  onDelete={!isSent ? handleDeleteItem : undefined}
                  isDeleting={isDeleting === item.id}
                  onMarginChange={(format, value) => {
                    // Si el usuario cambia un margen individualmente, actualizar el estado local
                    setLocalItems(prev =>
                      prev.map(it =>
                        it.id === item.id 
                          ? { ...it, [`margenPct${format}`]: value }
                          : it
                      )
                    )
                  }}
                />
              ))}
              
              {localItems.length === 0 && (
                <tr>
                  <td colSpan={2 + (isProductQuote ? 1 : 0) + selectedFormats.length} className="py-12 text-center text-gray-500">
                    No hay {isProductQuote ? 'productos' : 'servicios'} en esta cotización
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}