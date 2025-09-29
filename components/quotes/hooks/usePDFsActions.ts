'use client'
import { useTransition, useState } from 'react'
import { toast } from 'react-toastify'
import { getQuotePdfAction } from '@/actions/admin/quotes/getPDFAction'

export function usePdfActions(quoteId: string) {
  const [busy, setBusy] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const openInline = (n: number) => {
    setBusy(n)
    startTransition(() => {
      (async () => {
        const { dataUrl, error } = await getQuotePdfAction(quoteId, n)
        setBusy(null)
        if (error || !dataUrl) return toast.error(error ?? `No se pudo abrir el PDF ${n}`)
        const w = window.open()
        if (w) w.document.write(`<iframe src="${dataUrl}" style="border:0;width:100%;height:100vh"></iframe>`)
        else window.location.href = dataUrl
      })()
    })
  }

  const downloadPdf = (n: number) => {
    setBusy(n)
    startTransition(() => {
      (async () => {
        const { dataUrl, filename, error } = await getQuotePdfAction(quoteId, n)
        setBusy(null)
        if (error || !dataUrl) return toast.error(error ?? `No se pudo descargar el PDF ${n}`)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = filename || `quote_${quoteId}_m${n}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })()
    })
  }

  return { busy, isPending, openInline, downloadPdf }
}
