'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Quote, Item } from '@/src/schemas'
import { updateItemAction } from '@/actions/quotes/updateItemAction'
import sendQuoteAction from '@/actions/quotes/sendQuoteAction'
import { toast } from 'react-toastify'
import { useTransition, useState, useActionState, useEffect } from 'react'
import reOpenQuoteAction from '@/actions/quotes/reOpenQuoteAction'
import { useRouter } from 'next/navigation'
import { Box, FileText, RefreshCw, Download, Edit3, Percent, DollarSign } from 'lucide-react'

type Props = {
  quote: Quote
}

export default function QuoteDetailTable({ quote }: Props) {
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState<Item[]>(quote.items)
  const [state, dispatch] = useActionState(sendQuoteAction, {
    errors: [], success: ''
  })
  const [stateR, dispatchR] = useActionState(reOpenQuoteAction, {
    errors: [], success: ''
  })
  const router = useRouter()

  const isSent = quote.status === 'sent'
  const isProductQuote = quote.tipo === 'productos'

  useEffect(() => {
    state.errors?.forEach(e => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      router.refresh()
    }
  }, [state])

  useEffect(() => {
    stateR.errors?.forEach(e => toast.error(e))
    if (stateR.success) {
      toast.success(stateR.success)
      router.refresh()
    }
  }, [stateR])

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      updateItemAction({ errors: [], success: '' }, formData)
        .then(res => {
          if (res?.error) {
            toast.error(res.error)
            return
          }
          if (res?.item) {
            setItems(prev =>
              prev.map(i => (i.id === res.item!.id ? res.item! : i)))
            toast.success('Ítem actualizado')
            router.refresh()
          }
        })
    })
  }

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] overflow-hidden">
        <table className="w-full divide-y divide-[#e5e7eb]">
          <thead className="bg-[#174940]">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                {isProductQuote ? 'Producto' : 'Servicio'}
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                Cantidad
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                Costo Unitario
              </th>
              {[1, 2, 3].map(n => (
                <th key={n} className="py-4 px-6 text-center text-sm font-medium text-white uppercase tracking-wider">
                  <div className="flex flex-col items-center">
                    <span>Margen {n}</span>
                    <div className="flex items-center mt-1">
                      <Percent className="h-3 w-3 mr-1" />
                      <DollarSign className="h-3 w-3" />
                    </div>
                  </div>
                </th>
              ))}
              {!isSent && <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">Acción</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e5e7eb]">
            {items.map(item => {
              const entity = isProductQuote ? item.product! : item.service!
              const imageUrl = isProductQuote ? (entity as any).image_url : undefined

              return (
                <tr key={item.id} className="hover:bg-[#f0f7f5] transition-colors">
                  {/* Columna de Producto/Servicio */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {imageUrl ? (
                          <div className="h-12 w-12 rounded-lg overflow-hidden border border-[#e5e7eb]">
                            <Image
                              src={imageUrl}
                              alt={entity.nombre}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center border border-[#e5e7eb]">
                            <Box className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-[#0F332D]">{entity.nombre}</div>
                        {isProductQuote ? (
                          <Link
                            href={(entity as any).link_compra}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#63B23D] hover:underline flex items-center mt-1"
                          >
                            <span>Comprar producto</span>
                          </Link>
                        ) : (
                          (entity as any).link ? (
                            <Link
                              href={(entity as any).link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#63B23D] hover:underline flex items-center mt-1"
                            >
                              <span>Ver detalles del servicio</span>
                            </Link>
                          ) : (
                            <div className="text-sm text-[#999999] mt-1">
                              {(entity as any).descripcion?.slice(0, 50)}...
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Cantidad editable */}
                  <td className="py-4 px-6">
                    <input
                      type="number"
                      name="cantidad"
                      defaultValue={item.cantidad}
                      className={`w-20 px-3 py-1.5 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all ${
                        isSent ? 'bg-gray-100' : 'bg-white'
                      }`}
                      form={`form-${item.id}`}
                      disabled={isSent}
                    />
                  </td>

                  {/* Costo Unitario */}
                  <td className="py-4 px-6">
                    <div className="text-[#174940] font-medium text-center">
                      ${item.costo_unitario.toFixed(2)}
                    </div>
                  </td>

                  {/* Columnas de Márgenes */}
                  {[1, 2, 3].map(n => {
                    const pct = (item as any)[`margenPct${n}`]
                    const precio = (item as any)[`precioFinal${n}`]
                    const subtotal = (item as any)[`subtotal${n}`]
                    
                    return (
                      <td key={n} className="py-4 px-6">
                        <div className="flex flex-col items-center">
                          {/* Input de margen */}
                          <div className="relative mb-2">
                            <input
                              type="number"
                              step="0.01"
                              name={`margenPct${n}`}
                              defaultValue={pct}
                              className={`w-24 px-3 py-1.5 pl-8 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all text-center ${
                                isSent ? 'bg-gray-100' : 'bg-white'
                              }`}
                              form={`form-${item.id}`}
                              disabled={isSent}
                            />
                            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#999999]" />
                          </div>

                          {/* Detalles de precios */}
                          <div className="bg-[#f8fafc] p-2 rounded-lg w-full text-center border border-[#e5e7eb]">
                            <div className="text-xs font-medium text-[#174940] mb-1">
                              Precio Final
                            </div>
                            <div className="text-sm font-bold text-[#0F332D]">
                              ${precio?.toFixed(2) || '—'}
                            </div>
                            
                            <div className="border-t border-[#e5e7eb] my-1"></div>
                            
                            <div className="text-xs font-medium text-[#174940] mb-1">
                              Subtotal
                            </div>
                            <div className="text-sm font-bold text-[#0F332D]">
                              ${subtotal?.toFixed(2) || '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                    )
                  })}

                  {/* Botón de actualizar */}
                  {!isSent && (
                    <td className="py-4 px-6">
                      <form id={`form-${item.id}`} action={handleSubmit}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="quoteId" value={quote.id} />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center gap-1 disabled:opacity-50"
                          disabled={isPending || isSent}
                        >
                          {isPending ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit3 className="h-4 w-4" />
                          )}
                          <span>Actualizar</span>
                        </button>
                      </form>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Acciones finales */}
      <div className="mt-8">
        {!isSent ? (
          <form action={dispatch} className="flex justify-start">
            <input type="hidden" name="quoteId" value={quote.id} />
            <button
              type="submit"
              className="px-6 py-3 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors flex items-center gap-2 font-medium"
            >
              <FileText className="h-5 w-5" />
              <span>Generar PDFs de cotización</span>
            </button>
          </form>
        ) : (
          <div className="flex flex-wrap gap-4 items-center">
            {quote.pdf1 && (
              <a 
                href={quote.pdf1} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center gap-2 font-medium"
              >
                <Download className="h-5 w-5" />
                <span>PDF Margen 1</span>
              </a>
            )}
            {quote.pdf2 && (
              <a 
                href={quote.pdf2} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center gap-2 font-medium"
              >
                <Download className="h-5 w-5" />
                <span>PDF Margen 2</span>
              </a>
            )}
            {quote.pdf3 && (
              <a 
                href={quote.pdf3} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center gap-2 font-medium"
              >
                <Download className="h-5 w-5" />
                <span>PDF Margen 3</span>
              </a>
            )}

            <form action={dispatchR}>
              <input type="hidden" name="quoteId" value={quote.id} />
              <button 
                type="submit" 
                className="px-6 py-3 bg-white border border-[#e5e7eb] text-[#0F332D] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Reabrir cotización</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}