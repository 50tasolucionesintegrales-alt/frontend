'use client'

import { useState } from 'react'
import { Box, Clock } from 'lucide-react'
import DeleteQuoteButton from './quotes/DeleteQuoteButton';

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
  totalMargen8?: number;
  totalMargen9?: number;
  totalMargen10?: number;
};

// Evita hydration mismatch fijando timeZone
const fmtDate = (iso?: string | null) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

export default function QuotesSentTable({ quotes }: { quotes: QuoteRow[] }) {
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
                  <th className="py-4 px-6 text-right text-sm font-medium text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e5e7eb]">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#f0f7f5] transition-colors">
                    <td className="py-4 px-6 font-medium text-[#0F332D]">{q.titulo}</td>
                    <td className="py-4 px-6 capitalize text-[#174940]">
                      <span className="px-2 py-1 bg-[#174940]/10 rounded-full text-xs">{q.tipo}</span>
                    </td>
                    <td className="py-4 px-6 text-[#174940]">
                      {fmtDate(q.sentAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <DeleteQuoteButton quoteId={q.id} />
                    </td>
                  </tr>
                ))}

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
    </div>
  )
}