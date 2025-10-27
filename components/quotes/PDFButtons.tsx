// components/quotes/PDFButtons.tsx
'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import PdfDownloadModal from '../modals/quotes/PDFDownloadModal'

// Mapea formato → nombre de la empresa (ajusta según tus datos reales)
const formatToEmpresaMap: Record<number, string> = {
    1: 'Goltech',
    2: 'Juan Ángel Bazán',
    3: 'Alejandra G. Hernández',
    4: 'Adrián Orihuela',
    5: 'Mariana Loeza',
    6: 'Michelle',
    7: 'Chalor',
    8: 'Leyses Soluciones',
    9: 'Eduardo Suárez (ES)',
    10: 'Jessica Rabadán',
}

export function PdfButtons({
  quoteId,
  selectedFormats,
  onReopen,
}: {
  quoteId: string
  selectedFormats: number[]
  onReopen: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [empresa, setEmpresa] = useState<number>(1)

  const openFor = (n: number) => {
    setEmpresa(n)
    setOpen(true)
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {selectedFormats.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => openFor(n)}
          className="px-4 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center gap-2"
          title={`Descargar ${formatToEmpresaMap[n] ?? `Formato ${n}`}`}
        >
          <Download className="h-4 w-4" />
          <span>{formatToEmpresaMap[n] ?? `Formato ${n}`}</span>
        </button>
      ))}
      {onReopen}

      <PdfDownloadModal
        open={open}
        onClose={() => setOpen(false)}
        quoteId={quoteId}
        empresa={empresa} 
      />
    </div>
  )
}