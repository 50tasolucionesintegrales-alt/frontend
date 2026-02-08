'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Quote, Item } from '@/src/schemas'
import sendQuoteAction from '@/actions/quotes/sendQuoteAction'
import reOpenQuoteAction from '@/actions/quotes/reOpenQuoteAction'
import { FileText } from 'lucide-react'

import { useSelectedFormats } from './hooks/useSelectedFormats'
import { useStableItems } from './hooks/useStableItems'
import { FormatsPicker } from './FormatsPicker'
import { QuoteTable } from './QuoteTableDetail'
import { PdfButtons } from './PDFButtons'

export default function QuoteDetail(quote : Quote) {
  const router = useRouter()
  const { items} = useStableItems(String(quote.id), quote.items as Item[])
  const { selected, toggle, selectAll, clearAll, hydrated } =
    useSelectedFormats(`quote:${quote.id}:formats`, [1,2,3]);

  const isSent = quote.status === 'sent'
  const isProductQuote = quote.tipo === 'productos'

  const [stateSend, dispatchSend, pendingSend]   = useActionState(sendQuoteAction, { errors: [], success: '' })
  const [stateReopen, dispatchReopen, pendingReopen] = useActionState(reOpenQuoteAction, { errors: [], success: '' })

  // toasts + refresh
  useEffect(() => {
    stateSend.errors?.forEach(e => toast.error(e))
    if (stateSend.success) { toast.success(stateSend.success); router.refresh() }
  }, [stateSend, router])

  useEffect(() => {
    stateReopen.errors?.forEach(e => toast.error(e))
    if (stateReopen.success) { toast.success(stateReopen.success); router.refresh() }
  }, [stateReopen, router])

  return (
    <section className="mb-12">
      {!isSent && (
        <FormatsPicker
          selected={selected}
          toggle={toggle}
          selectAll={selectAll}
          clearAll={clearAll}
          hydrated={hydrated}    
        />
      )}

      <QuoteTable
        quoteId={String(quote.id)}
        items={items}
        isProductQuote={isProductQuote}
        selectedFormats={selected}
        isSent={isSent}
      />

      <div className="mt-8">
        {!isSent ? (
          <form action={dispatchSend} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input type="hidden" name="quoteId" value={quote.id} />
            {selected.map(n => (<input key={n} type="hidden" name="formats" value={n} />))}
            <button type="submit" disabled={selected.length === 0}
              className="px-6 py-3 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors flex items-center gap-2 font-medium disabled:opacity-50">
              <FileText className="h-5 w-5" />
              <span>
                {pendingSend ? 'Enviando...' : 'Enviar cotización'}
              </span>
            </button>
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
                  {pendingReopen ? 'Reabriendo...' : 'Reabrir cotización'}
                </button>
              </form>
            }
          />
        )}
      </div>
    </section>
  )
}