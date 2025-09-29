// components/admin/QuotesSentTable.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Download, FileText, ArrowLeft, Box, Clock } from 'lucide-react'
import PdfDownloadModal from '../modals/quotes/PDFDownloadModal' // ← reutilizamos el mismo modal

type QuoteRow = {
  id: string;
  titulo: string;
  tipo: 'productos' | 'servicios';
  sentAt?: string | null;
  totalMargen1?: number;
  totalMargen2?: number;
  totalMargen3?: number;
  totalMargen4?: number;
  totalMargen5?: number;
  totalMargen6?: number;
  totalMargen7?: number;
};

function activeMargins(q: QuoteRow): number[] {
  const out: number[] = []
  for (let i = 1; i <= 7; i++) {
    const v = Number((q[`totalMargen${i}` as keyof QuoteRow] as number | undefined) ?? 0)
    if (v > 0) out.push(i)
  }
  return out
}

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

export default function QuotesSentTable({ quotes }: { quotes: QuoteRow[] }) {
  // --- estado del modal compartido ---
  const [modalOpen, setModalOpen] = useState(false)
  const [modalQuoteId, setModalQuoteId] = useState<string>('')
  const [modalEmpresa, setModalEmpresa] = useState<number>(1)

  const openModalFor = (quoteId: string, empresa: number) => {
    setModalQuoteId(quoteId)
    setModalEmpresa(empresa)
    setModalOpen(true)
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-[#e5e7eb] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#174940]">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">Título</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">Tipo</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                    <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />Enviada</div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Totales / Descargas
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e5e7eb]">
                {quotes.map((q) => {
                  const margins = activeMargins(q)
                  return (
                    <tr key={q.id} className="hover:bg-[#f0f7f5] transition-colors">
                      <td className="py-4 px-6 font-medium text-[#0F332D]">{q.titulo}</td>
                      <td className="py-4 px-6 capitalize text-[#174940]">
                        <span className="px-2 py-1 bg-[#174940]/10 rounded-full text-xs">{q.tipo}</span>
                      </td>
                      <td className="py-4 px-6 text-[#174940]">
                        {q.sentAt
                          ? new Date(q.sentAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
                          : '—'}
                      </td>
                      <td className="py-4 px-6">
                        {margins.length === 0 ? (
                          <span className="text-[#999999]">Sin totales</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {margins.map((n) => {
                              const total = Number((q[`totalMargen${n}` as keyof QuoteRow] as number | undefined) || 0)
                              return (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => openModalFor(q.id, n)}  // ← abre el modal
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e5e7eb] bg-[#63B23D]/10 hover:bg-[#63B23D]/20 transition-colors"
                                  title={`Descargar PDF Formato ${n}`}
                                >
                                  <span className="text-xs font-semibold text-[#174940]">M{n}</span>
                                  <span className="text-sm font-medium text-[#0F332D]">
                                    {fmtMoney(total)}
                                  </span>
                                  <Download className="h-4 w-4 text-[#63B23D]" />
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#999999]">
                        <Box className="h-12 w-12 mb-3 text-[#e5e7eb]" />
                        <p className="text-lg font-medium text-[#174940]">No hay cotizaciones enviadas</p>
                        <p className="mt-1 max-w-md">Todas las cotizaciones que envíes aparecerán aquí</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal único, reutilizando tu componente actual */}
      <PdfDownloadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        quoteId={modalQuoteId}
        empresa={modalEmpresa}
      />
    </div>
  )
}
