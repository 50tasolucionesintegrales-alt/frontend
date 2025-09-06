'use client'
import { Download, Eye, Loader2 } from 'lucide-react'
import { usePdfActions } from './hooks/usePDFsActions'

export function PdfButtons({
  quoteId, selectedFormats, onReopen
}: {
  quoteId: string
  selectedFormats: number[]
  onReopen: React.ReactNode
}) {
  const { busy, openInline, downloadPdf } = usePdfActions(quoteId)

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {selectedFormats.length === 0 ? (
        <div className="text-sm text-[#174940]">No hay formatos seleccionados previamente.</div>
      ) : (
        selectedFormats.map(n => (
          <div key={n} className="flex gap-2">
            <button type="button" onClick={() => openInline(n)}
              className="px-4 py-2 bg-white border border-[#e5e7eb] text-[#0F332D] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={busy === n}>
              {busy === n ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              <span>Ver formato {n}</span>
            </button>
            <button type="button" onClick={() => downloadPdf(n)}
              className="px-4 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center gap-2"
              disabled={busy === n}>
              {busy === n ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span>Descargar {n}</span>
            </button>
          </div>
        ))
      )}
      {onReopen}
    </div>
  )
}
