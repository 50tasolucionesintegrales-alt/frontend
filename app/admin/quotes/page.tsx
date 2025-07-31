import { Download, FileText, ArrowLeft, Box, Clock, CheckCircle } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function OrdersQuotesPage() {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const quotes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/sent`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json())

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0F332D] flex items-center">
            <FileText className="h-8 w-8 mr-2 text-[#63B23D]" />
            Cotizaciones Enviadas
          </h1>
          <Link 
            href="/admin" 
            className="flex items-center text-[#174940] hover:text-[#0F332D] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Volver al dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-[#e5e7eb] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#174940]">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Título
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white uppercase tracking-wider">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Enviada
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right text-sm font-medium text-white uppercase tracking-wider">
                    Total M1
                  </th>
                  <th className="py-4 px-6 text-right text-sm font-medium text-white uppercase tracking-wider">
                    Total M2
                  </th>
                  <th className="py-4 px-6 text-right text-sm font-medium text-white uppercase tracking-wider">
                    Total M3
                  </th>
                  <th className="py-4 px-6 text-right text-sm font-medium text-white uppercase tracking-wider">
                    Descargas
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e5e7eb]">
                {quotes.map((q: any) => (
                  <tr key={q.id} className="hover:bg-[#f0f7f5] transition-colors">
                    <td className="py-4 px-6 font-medium text-[#0F332D]">
                      {q.titulo}
                    </td>
                    <td className="py-4 px-6 capitalize text-[#174940]">
                      <span className="px-2 py-1 bg-[#174940]/10 rounded-full text-xs">
                        {q.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#174940]">
                      {new Date(q.sentAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-[#0F332D]">
                      {q.totalMargen1?.toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }) ?? '—'}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-[#0F332D]">
                      {q.totalMargen2?.toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }) ?? '—'}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-[#0F332D]">
                      {q.totalMargen3?.toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }) ?? '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-3">
                        {q.pdf1 && (
                          <Link
                            href={q.pdf1}
                            target="_blank"
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#63B23D]/10 hover:bg-[#63B23D]/20 transition-colors min-w-[60px]"
                          >
                            <Download className="h-5 w-5 text-[#63B23D]" />
                            <span className="text-xs mt-1 text-[#0F332D]">M1</span>
                          </Link>
                        )}
                        {q.pdf2 && (
                          <Link
                            href={q.pdf2}
                            target="_blank"
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#63B23D]/10 hover:bg-[#63B23D]/20 transition-colors min-w-[60px]"
                          >
                            <Download className="h-5 w-5 text-[#63B23D]" />
                            <span className="text-xs mt-1 text-[#0F332D]">M2</span>
                          </Link>
                        )}
                        {q.pdf3 && (
                          <Link
                            href={q.pdf3}
                            target="_blank"
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#63B23D]/10 hover:bg-[#63B23D]/20 transition-colors min-w-[60px]"
                          >
                            <Download className="h-5 w-5 text-[#63B23D]" />
                            <span className="text-xs mt-1 text-[#0F332D]">M3</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#999999]">
                        <Box className="h-12 w-12 mb-3 text-[#e5e7eb]" />
                        <p className="text-lg font-medium text-[#174940]">
                          No hay cotizaciones enviadas
                        </p>
                        <p className="mt-1 max-w-md">
                          Todas las cotizaciones que envíes aparecerán aquí
                        </p>
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