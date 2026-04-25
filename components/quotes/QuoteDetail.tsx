'use client'

import { useState, useEffect  } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Quote, Item } from '@/src/schemas'
import { FileText } from 'lucide-react'

import AddItemsModal from './AddItemsModal'
import type { Producto } from '@/src/schemas'
import { useSelectedFormats } from './hooks/useSelectedFormats'
import { useStableItems } from './hooks/useStableItems'
import { FormatsPicker } from './FormatsPicker'
import { QuoteTable } from './QuoteTableDetail'
import { PdfButtons } from './PDFButtons'

export default function QuoteDetail(quote: Quote & { availableItems?: Producto[] }) {
  const router = useRouter()
  const { items } = useStableItems(String(quote.id), quote.items as Item[])
  const { selected, toggle, selectAll, clearAll, hydrated } =
    useSelectedFormats(`quote:${quote.id}:formats`, [1, 2, 3])

  const [status, setStatus] = useState(quote.status)
  const [pendingSend, setPendingSend] = useState(false)
  const [pendingReopen, setPendingReopen] = useState(false)
  const [localAvailableItems, setLocalAvailableItems] = useState(quote.availableItems ?? [])

  useEffect(() => {
    setLocalAvailableItems(quote.availableItems ?? [])
  }, [quote.availableItems])

  const isSent = status === 'sent'
  const isProductQuote = quote.tipo === 'productos'

  const handleSend = async () => {
    if (selected.length === 0) return
    setPendingSend(true)

    try {
      const res = await fetch(`/api/quotes/${quote.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
          toast.error(json.errors?.[0]?.message || json.message || 'Error al enviar la cotización')
        return
      }

      setStatus('sent')
      toast.success('Cotización enviada correctamente')
    } catch {
      toast.error('Error al enviar la cotización')
    } finally {
      setPendingSend(false)
    }
  }

  const handleReopen = async () => {
    setPendingReopen(true)
    try {
      const res = await fetch(`/api/quotes/${quote.id}/reopen`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(json.errors?.[0]?.message || json.message || 'Error al reabrir la cotización')
        return
      }
      setStatus('draft')
      toast.success('La cotización se reabrió correctamente')
      router.refresh() 
    } catch {
      toast.error('Error al reabrir la cotización')
    } finally {
      setPendingReopen(false)
    }
  }

  return (
    <section className="mb-12">
      {!isSent && (
        <AddItemsModal
          quoteId={String(quote.id)}
          quoteType={quote.tipo as 'productos' | 'servicios'}
          availableItems={localAvailableItems}
        />
      )}

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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={handleSend}
              disabled={pendingSend || selected.length === 0}
              className="px-6 py-3 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
            >
              <FileText className="h-5 w-5" />
              <span>{pendingSend ? 'Enviando...' : 'Enviar cotización'}</span>
            </button>
          </div>
        ) : (
          <PdfButtons
            quoteId={String(quote.id)}
            selectedFormats={selected}
            onReopen={
              <button
                onClick={handleReopen}
                disabled={pendingReopen}
                className="px-6 py-3 bg-white border border-[#e5e7eb] text-[#0F332D] rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2" />
                </svg>
                {pendingReopen ? 'Reabriendo...' : 'Reabrir cotización'}
              </button>
            }
          />
        )}
      </div>
    </section>
  )
}