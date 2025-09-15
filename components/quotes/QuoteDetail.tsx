'use client'

import { startTransition, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Quote, Item } from '@/src/schemas'
import sendQuoteAction from '@/actions/quotes/sendQuoteAction'
import reOpenQuoteAction from '@/actions/quotes/reOpenQuoteAction'
import { updateItemAction } from '@/actions/quotes/updateItemAction'
import { FileText } from 'lucide-react'

import { useSelectedFormats } from './hooks/useSelectedFormats'
import { useStableItems } from './hooks/useStableItems'
import { FormatsPicker } from './FormatsPicker'
import { QuoteTable } from './QuoteTableDetail'
import { PdfButtons } from './PDFButtons'

export default function QuoteDetail({ quote, getProductImageDataUrl }: { quote: Quote, getProductImageDataUrl: (id: string) => Promise<string | null> }) {
  const router = useRouter()
  const { items, setItems } = useStableItems(String(quote.id), quote.items as Item[])
  const { selected, toggle, selectAll, clearAll } =
    useSelectedFormats(`quote:${quote.id}:formats`, [1,2,3])

  const isSent = quote.status === 'sent'
  const isProductQuote = quote.tipo === 'productos'

  const [stateSend, dispatchSend]   = useActionState(sendQuoteAction, { errors: [], success: '' })
  const [stateReopen, dispatchReopen] = useActionState(reOpenQuoteAction, { errors: [], success: '' })

  // toasts + refresh
  useEffect(() => {
    stateSend.errors?.forEach(e => toast.error(e))
    if (stateSend.success) { toast.success(stateSend.success); router.refresh() }
  }, [stateSend, router])

  useEffect(() => {
    stateReopen.errors?.forEach(e => toast.error(e))
    if (stateReopen.success) { toast.success(stateReopen.success); router.refresh() }
  }, [stateReopen, router])

  // update item (server action)
  const handleUpdateItem = (fd: FormData) => {
    startTransition(() => {
      updateItemAction({ errors: [], success: '' }, fd).then(res => {
        if (res?.error) return toast.error(res.error)
        if (res?.item) {
          setItems(prev => prev.map(i => (i.id === res.item.id ? res.item : i)))
          toast.success('Ítem actualizado')
          router.refresh()
        }
      })
    })
  }

  return (
    <section className="mb-12">
      {!isSent && (
        <FormatsPicker
          selected={selected}
          toggle={toggle}
          selectAll={selectAll}
          clearAll={clearAll}
        />
      )}

      <QuoteTable
        quoteId={String(quote.id)}
        items={items}
        isProductQuote={isProductQuote}
        selectedFormats={selected}
        isSent={isSent}
        onSubmit={handleUpdateItem}
        getProductImageDataUrl={getProductImageDataUrl}
      />

      <div className="mt-8">
        {!isSent ? (
          <form action={dispatchSend} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input type="hidden" name="quoteId" value={quote.id} />
            {selected.map(n => (<input key={n} type="hidden" name="formats" value={n} />))}
            <button type="submit" disabled={selected.length === 0}
              className="px-6 py-3 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors flex items-center gap-2 font-medium disabled:opacity-50">
              <FileText className="h-5 w-5" />
              <span>Enviar / Generar</span>
            </button>
            {selected.length > 0 && (
              <div className="text-sm text-[#174940]">Seleccionados: {selected.join(', ')}</div>
            )}
          </form>
        ) : (
          <PdfButtons
            quoteId={String(quote.id)}
            selectedFormats={selected}
            onReopen={
              <form action={dispatchReopen}>
                <input type="hidden" name="quoteId" value={quote.id} />
                <button type="submit"
                  className="px-6 py-3 bg-white border border-[#e5e7eB] text-[#0F332D] rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2"/></svg>
                  Reabrir cotización
                </button>
              </form>
            }
          />
        )}
      </div>
    </section>
  )
}