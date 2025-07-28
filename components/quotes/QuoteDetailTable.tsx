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

type Props = {
  quote: Quote
}

export default function QuoteDetailTable({ quote }: Props) {
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState<Item[]>(quote.items)
  const [state, dispatch] = useActionState(sendQuoteAction, {
    errors: [],
    success: ''
  })

  const router = useRouter()
  const isSent = quote.status === 'sent'

  const [stateR, dispatchR] = useActionState(reOpenQuoteAction, {
    errors: [],
    success: ''
  })

  useEffect(() => {
    state.errors?.forEach(e => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      router.refresh()
    }
  }, [state])

  useEffect(() => {
    console.log(stateR)
    stateR.errors?.forEach(e => toast.error(e))
    if (stateR.success) {
      toast.success(stateR.success)
      router.refresh()
    }
  }, [stateR])

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateItemAction({ errors: [], success: '' }, formData)

      if (res?.error) {
        toast.error(res.error)
        return
      }

      if (res?.item) {
        setItems(prev => prev.map(i => (i.id === res.item.id ? res.item : i)))
        toast.success('Ítem actualizado')
      }
    })
  }


  return (
    <section className="mb-12">
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#174940] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Producto</th>
              <th className="py-3 px-4 text-left">Cantidad</th>
              <th className="py-3 px-4 text-left">Costo Unitario</th>
              <th className="py-3 px-4 text-left">Margen 1</th>
              <th className="py-3 px-4 text-left">Margen 2</th>
              <th className="py-3 px-4 text-left">Margen 3</th>
              <th className="py-3 px-4 text-left">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.nombre}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{item.product.nombre}</div>
                      <Link href={item.product.link_compra} target="_blank" className="text-sm text-blue-600 hover:underline">
                        Comprar
                      </Link>
                    </div>
                  </div>
                </td>

                {/* Formulario por ítem */}
                <td className="py-3 px-2">
                  <input
                    type="number"
                    name="cantidad"
                    defaultValue={item.cantidad}
                    className="w-16 px-2 py-1 border rounded"
                    form={`form-${item.id}`}
                    disabled={!!isSent}
                  />
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm text-gray-800">${item.costo_unitario.toFixed(2)}</div>
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    step="0.01"
                    name="margenPct1"
                    defaultValue={item.margenPct1}
                    className="w-16 px-2 py-1 border rounded"
                    form={`form-${item.id}`}
                    disabled={!!isSent}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    +{item.margenPct1}%<br />
                    {item.precioFinal1 != null ? `$${item.precioFinal1.toFixed(2)}` : '—'} / Subtotal:{' '}
                    {item.subtotal1 != null ? `$${item.subtotal1.toFixed(2)}` : '—'}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    step="0.01"
                    name="margenPct2"
                    defaultValue={item.margenPct2}
                    className="w-16 px-2 py-1 border rounded"
                    form={`form-${item.id}`}
                    disabled={!!isSent}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    +{item.margenPct2}%<br />
                    {item.precioFinal2 != null ? `$${item.precioFinal2.toFixed(2)}` : '—'} / Subtotal:{' '}
                    {item.subtotal2 != null ? `$${item.subtotal2.toFixed(2)}` : '—'}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    step="0.01"
                    name="margenPct3"
                    defaultValue={item.margenPct3}
                    className="w-16 px-2 py-1 border rounded"
                    form={`form-${item.id}`}
                    disabled={!!isSent}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    +{item.margenPct3}%<br />
                    {item.precioFinal3 != null ? `$${item.precioFinal3.toFixed(2)}` : '—'} / Subtotal:{' '}
                    {item.subtotal3 != null ? `$${item.subtotal3.toFixed(2)}` : '—'}
                  </div>
                </td>

                <td className="py-3 px-2">
                  <form id={`form-${item.id}`} action={handleSubmit}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="quoteId" value={quote.id} />
                    <button
                      type="submit"
                      className="text-sm px-3 py-1 bg-[#174940] text-white rounded hover:bg-[#14533f]"
                      disabled={isPending || !!isSent}
                    >
                      {isPending ? '...' : 'Actualizar'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Acciones finales */}
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
          {/* PDFs */}
          {quote.pdf1 && (
            <a href={quote.pdf1} target="_blank" className="px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f] font-semibold">
              Ver PDF Margen 1
            </a>
          )}
          {quote.pdf2 && (
            <a href={quote.pdf2} target="_blank" className="px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f] font-semibold">
              Ver PDF Margen 2
            </a>
          )}
          {quote.pdf3 && (
            <a href={quote.pdf3} target="_blank" className="px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f] font-semibold">
              Ver PDF Margen 3
            </a>
          )}

          {/* Reabrir cotización (solo admins) */}
          <form
            action={dispatchR}
          >
            <input type="hidden" name='quoteId' value={quote.id} />
            <button 
              type='submit' 
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Reabrir cotización
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
