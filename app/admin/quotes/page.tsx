import { cookies } from 'next/headers'
import QuotesSentTable from '@/components/admin/QuoteSentTable'
import { FileText } from 'lucide-react'
import ButtonBack from '@/components/ui/ButtonBack'

export default async function OrdersQuotesPage() {
  const token = (await cookies()).get('50TA_TOKEN')?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/sent`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const quotes = await res.json()

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header con título, icono, descripción y botón */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
            <FileText className="h-8 w-8 text-[#63B23D]" />
            <div>
              <h1 className="text-3xl font-bold text-[#0F332D]">Cotizaciones Enviadas</h1>
              <p className="text-gray-600 text-sm mt-1">
                Gestiona todas las cotizaciones que has enviado
              </p>
            </div>

            {/* Botón en móviles */}
            <div className="md:hidden ml-auto">
              <ButtonBack href="/admin" />
            </div>
          </div>

          {/* Botón en pantallas grandes */}
          <div className="hidden md:block">
            <ButtonBack href="/admin" />
          </div>
        </header>

        {/* Tabla de cotizaciones */}
        <QuotesSentTable quotes={quotes} />
      </div>
    </div>
  )
}