'use client'

import { useState } from 'react'
import { Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { Item } from '@/src/schemas'
import { toast } from 'react-toastify'

type MarginKey = `margenPct${number}` | `precioFinal${number}` | `subtotal${number}` | `ganancia${number}`
type ItemWithMargins = Item & Partial<Record<MarginKey, number>> & {
  unidad?: string
}

interface QuoteRowProps {
  item: ItemWithMargins
  setItem: (item: ItemWithMargins) => void
  isProductQuote: boolean
  selectedFormats: number[]
  isSent: boolean
  onDelete?: (itemId: string) => Promise<void>
  onMarginChange?: (format: number, value: number | null) => void
  isDeleting?: boolean 
}

export function QuoteRow({ 
  item, 
  setItem, 
  isProductQuote, 
  selectedFormats, 
  isSent,
  onDelete,
  onMarginChange,
  isDeleting = false
}: QuoteRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [expanded, setExpanded] = useState(false)

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

  const handleQuantityChange = (value: string) => {
    const numValue = Math.max(1, parseInt(value) || 1)
    setItem({ ...item, cantidad: numValue })
  }

  const handleCostChange = (value: string) => {
    const numValue = Math.max(0, parseFloat(value) || 0)
    setItem({ ...item, costo_unitario: numValue })
  }

  const handleMarginChange = (format: number, value: string) => {
    let numValue: number | null = null
    
    if (value === '' || value === '-') {
      numValue = null
    } else {
      const parsed = parseFloat(value)
      numValue = isNaN(parsed) ? null : Math.max(0, parsed)
    }
    
    const marginKey = `margenPct${format}` as keyof ItemWithMargins
    const updatedItem = { 
      ...item, 
      [marginKey]: numValue 
    }
    
    setItem(updatedItem)
    
    if (onMarginChange) {
      onMarginChange(format, numValue)
    }
  }

  const getCalculatedValues = (format: number) => {
    const marginKey = `margenPct${format}` as keyof ItemWithMargins;
    const precioKey = `precioFinal${format}` as keyof ItemWithMargins;
    const subtotalKey = `subtotal${format}` as keyof ItemWithMargins;
    const gananciaKey = `ganancia${format}` as keyof ItemWithMargins;
    
    const marginValue = (item as any)[marginKey] ?? 0;
    const precioFinal = (item as any)[precioKey] ?? 0;
    const subtotalConMargen = (item as any)[subtotalKey] ?? 0;
    const gananciaBackend = (item as any)[gananciaKey] ?? 0;
    
    const costo = item.costo_unitario || 0;
    const cantidad = item.cantidad || 0;
    const subtotalBase = costo * cantidad;
    
    let precioFinalCalc = precioFinal || costo;
    let subtotalConMargenCalc = subtotalConMargen || subtotalBase;
    let gananciaCalc = gananciaBackend;
    
    if (gananciaCalc === 0 && subtotalConMargenCalc > 0 && subtotalBase > 0) {
      gananciaCalc = subtotalConMargenCalc - subtotalBase;
    }
    
    if (gananciaCalc === 0 && marginValue > 0 && costo > 0 && cantidad > 0) {
      precioFinalCalc = costo * (1 + marginValue / 100);
      subtotalConMargenCalc = precioFinalCalc * cantidad;
      gananciaCalc = subtotalConMargenCalc - subtotalBase;
    }
    
    return {
      marginValue,
      precioFinal: precioFinalCalc,
      subtotalBase,
      subtotalConMargen: subtotalConMargenCalc,
      ganancia: gananciaCalc
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value)
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    try {
      await onDelete(item.id)
      toast.success('Producto eliminado de la cotización')
      setShowDeleteConfirm(false)
    } catch (error) {
      toast.error('Error al eliminar el producto')
    }
  }

  const itemName = item.product?.nombre || item.service?.nombre || 'Sin nombre'
  const itemDescription = item.product?.descripcion || item.service?.descripcion || 'Sin descripción'
  const itemImage = (item as any).imageUrl

  return (
    <>
      {/* Vista móvil compacta */}
      <tr className="hover:bg-[#f9fafb] group lg:hidden">
        <td className="py-3 px-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {!isSent && onDelete && (
                  <div className="relative flex-shrink-0">
                    {showDeleteConfirm ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          {isDeleting ? '...' : 'Sí'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {itemImage && (
                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={itemImage}
                        alt={itemName}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#0F332D] truncate">{itemName}</div>
                    {isProductQuote && (
                      <div className="text-sm text-gray-600">
                        {item.cantidad || 1} × {formatCurrency(item.costo_unitario || 0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 flex items-center gap-1 text-sm text-[#174940] hover:text-[#0F332D]"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={14} /> Ocultar detalles
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} /> Ver detalles
                  </>
                )}
              </button>
              
              {expanded && (
                <div className="mt-3 space-y-3 border-t pt-3">
                  {isProductQuote && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                        <div className="w-full px-2 py-1 border border-gray-300 rounded text-center bg-gray-50">
                          {item.cantidad || 1}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Costo Unit.</label>
                        <div className="w-full px-2 py-1 border border-gray-300 rounded text-right bg-gray-50">
                          {formatCurrency(item.costo_unitario || 0)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedFormats.map((format) => {
                    const { marginValue, precioFinal, subtotalBase, subtotalConMargen, ganancia } = getCalculatedValues(format)
                    const empresaNombre = formatToEmpresaMap[format] ?? `F${format}`
                    
                    return (
                      <div key={format} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-sm mb-2">{empresaNombre}</div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-xs text-gray-500">Margen</div>
                            {isSent ? (
                              <div>{marginValue}%</div>
                            ) : (
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={marginValue === null ? '' : marginValue}
                                onChange={(e) => handleMarginChange(format, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                placeholder="%"
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Precio Final</div>
                            <div className="font-semibold">{formatCurrency(precioFinal)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Subtotal Base</div>
                            <div>{formatCurrency(subtotalBase)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Subtotal + Margen</div>
                            <div className="font-semibold">{formatCurrency(subtotalConMargen)}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-xs text-gray-500">Ganancia</div>
                            <div className={`font-semibold ${ganancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(ganancia)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </td>
       </tr>

      {/* Vista desktop - columnas optimizadas */}
      <tr className="hover:bg-[#f9fafb] group hidden lg:table-row">
        {/* Columna de Producto/Servicio - más ancha */}
        <td className="py-4 px-4 sticky left-0 z-10 bg-white min-w-[280px] max-w-[400px]">
          <div className="flex items-center gap-3">
            {!isSent && onDelete && (
              <div className="relative flex-shrink-0">
                {showDeleteConfirm ? (
                  <div className="flex flex-col items-center gap-1 w-24">
                    <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
                    <div className="flex gap-1">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {isDeleting ? '...' : 'Sí'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {itemImage && (
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={itemImage}
                    alt={itemName}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[#0F332D] truncate">{itemName}</div>
                <div className="text-sm text-gray-600 line-clamp-2 break-words">{itemDescription}</div>
                {item.unidad && (
                  <div className="text-xs text-gray-500 mt-1">
                    Unidad: {item.unidad}
                  </div>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Cantidad - columna angosta */}
        {isProductQuote && (
          <td className="py-4 px-2 w-[70px]">
            <div className="text-center font-medium">{item.cantidad}</div>
          </td>
        )}

        {/* Costo Unitario - columna angosta */}
        <td className="py-4 px-2 w-[100px]">
          <div className="font-medium text-right whitespace-nowrap">{formatCurrency(item.costo_unitario || 0)}</div>
        </td>

        {/* Columnas de márgenes - mantienen su tamaño */}
        {selectedFormats.map((format) => {
          const empresaNombre = formatToEmpresaMap[format] ?? `Formato ${format}`
          const { marginValue, precioFinal, subtotalBase, subtotalConMargen, ganancia } = getCalculatedValues(format)
          
          return (
            <td key={format} className="py-4 px-3 min-w-[140px]">
              <div className="space-y-2">
                <div>
                  {isSent ? (
                    <div className="font-medium text-center text-sm">
                      {marginValue !== null && marginValue !== undefined ? `${marginValue}%` : '0%'}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1000"
                        value={marginValue === null ? '' : marginValue}
                        onChange={(e) => handleMarginChange(format, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#174940] focus:border-transparent pr-6 text-sm"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                        %
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-0.5 text-center">Precio final</div>
                  <div className="font-semibold text-[#174940] text-center text-sm whitespace-nowrap">
                    {formatCurrency(precioFinal)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-0.5 text-center">Subtotal base</div>
                  <div className="font-medium text-gray-700 text-center text-sm whitespace-nowrap">
                    {formatCurrency(subtotalBase)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-0.5 text-center">Subtotal + margen</div>
                  <div className="font-semibold text-center text-sm whitespace-nowrap">
                    {formatCurrency(subtotalConMargen)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-0.5 text-center">Ganancia</div>
                  <div className={`font-semibold text-center text-sm whitespace-nowrap ${ganancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(ganancia)}
                  </div>
                </div>
              </div>
            </td>
          )
        })}
      </tr>
    </>
  )
}