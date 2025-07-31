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
import { Box } from 'lucide-react'

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
      // llamamos a la función asíncrona pero no devolvemos su Promise
      updateItemAction({ errors: [], success: '' }, formData)
        .then(res => {
          if (res?.error) {
            toast.error(res.error)
            return
          }
          if (res?.item) {
            setItems(prev =>
              prev.map(i => (i.id === res.item!.id ? res.item! : i))
            )
            toast.success('Ítem actualizado')
            router.refresh()
          }
        })
    })
  }


  return (
    <section className="mb-12">
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#174940] text-white">
            <tr>
              <th className="py-3 px-4 text-left">
                {isProductQuote ? 'Producto' : 'Servicio'}
              </th>
              <th className="py-3 px-4 text-left">Cantidad</th>
              <th className="py-3 px-4 text-left">Costo Unitario</th>
              <th className="py-3 px-4 text-left">Margen 1</th>
              <th className="py-3 px-4 text-left">Margen 2</th>
              <th className="py-3 px-4 text-left">Margen 3</th>
              <th className="py-3 px-4 text-left">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => {
              // abstraemos el “entity” (producto o servicio)
              const entity = isProductQuote ? item.product! : item.service!
              const imageUrl = isProductQuote ? (entity as any).image_url : undefined

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={entity.nombre}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                          <Box className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{entity.nombre}</div>
                        {isProductQuote ? (
                          <Link
                            href={(entity as any).link_compra}
                            target="_blank"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Comprar
                          </Link>
                        ) : (
                          // para servicios, usa su link o muestra descripción
                          (entity as any).link ? (
                            <Link
                              href={(entity as any).link}
                              target="_blank"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Ver detalle
                            </Link>
                          ) : (
                            <div className="text-sm text-gray-500">
                              {(entity as any).descripcion?.slice(0, 30)}…
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Cantidad editable */}
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      name="cantidad"
                      defaultValue={item.cantidad}
                      className="w-16 px-2 py-1 border rounded"
                      form={`form-${item.id}`}
                      disabled={isSent}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-sm text-gray-800">
                      ${item.costo_unitario.toFixed(2)}
                    </div>
                  </td>

                  {/** Márgenes 1,2,3 idénticos al de productos */}
                  {[1, 2, 3].map(n => {
                    const pct = (item as any)[`margenPct${n}`]
                    const precio = (item as any)[`precioFinal${n}`]
                    const subtotal = (item as any)[`subtotal${n}`]
                    return (
                      <td key={n} className="py-3 px-2">
                        <input
                          type="number"
                          step="0.01"
                          name={`margenPct${n}`}
                          defaultValue={pct}
                          className="w-16 px-2 py-1 border rounded"
                          form={`form-${item.id}`}
                          disabled={isSent}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          +{pct}%<br />
                          {precio != null ? `$${precio.toFixed(2)}` : '—'} / Sub: {subtotal != null ? `$${subtotal.toFixed(2)}` : '—'}
                        </div>
                      </td>
                    )
                  })}

                  {/* Botón de actualizar */}
                  <td className="py-3 px-2">
                    <form id={`form-${item.id}`} action={handleSubmit}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <input type="hidden" name="quoteId" value={quote.id} />
                      <button
                        type="submit"
                        className="text-sm px-3 py-1 bg-[#174940] text-white rounded hover:bg-[#14533f]"
                        disabled={isPending || isSent}
                      >
                        {isPending ? '...' : 'Actualizar'}
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Acciones finales: Generar PDFs o Ver PDFs y Reabrir */}
      {!isSent ? (
        <form action={dispatch} className="mt-6">
          <input type="hidden" name="quoteId" value={quote.id} />
          <button
            type="submit"
            className="px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f] font-semibold"
          >
            Generar PDFs
          </button>
        </form>
      ) : (
        <div className="mt-6 flex flex-wrap gap-4">
          {quote.pdf1 && <a href={quote.pdf1} target="_blank" className="btn-primary">Ver PDF Margen 1</a>}
          {quote.pdf2 && <a href={quote.pdf2} target="_blank" className="btn-primary">Ver PDF Margen 2</a>}
          {quote.pdf3 && <a href={quote.pdf3} target="_blank" className="btn-primary">Ver PDF Margen 3</a>}

          <form action={dispatchR}>
            <input type="hidden" name="quoteId" value={quote.id} />
            <button type="submit" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
              Reabrir cotización
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
