import QuotesTable from "@/components/quotes/QuotesTable"
import { cookies } from "next/headers"
import { FileText } from "lucide-react"

export default async function QuotesPage() {
  const token = (await cookies()).get("50TA_TOKEN")?.value

  const resDraft = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/drafts`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  const resSend = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/sent`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  const quotesDraft = await resDraft.json()
  const quotesSend = await resSend.json()

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
      {/* Título principal con icono y descripción */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-[#63B23D]" size={28} />
        <div>
          <h1 className="text-3xl font-bold text-[#0F332D]">Mis Cotizaciones</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gestiona tus cotizaciones, tanto borradores como enviadas
          </p>
        </div>
      </div>

      {/* Sección borradores */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#0F332D]">Borradores</h2>
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <QuotesTable quotes={quotesDraft} type="drafts" />
        </div>
      </section>

      {/* Sección enviadas */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#0F332D]">Enviadas</h2>
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <QuotesTable quotes={quotesSend} type="sent" />
        </div>
      </section>
    </div>
  )
}