// app/quotes/[id]/page.tsx

import { getProductImageDataUrl } from "@/actions/add/products/ProductImageAction"
import AddItemsModal from "@/components/quotes/AddItemsModal"
import QuoteDetail from "@/components/quotes/QuoteDetail"
import { ArrowLeft } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const resQuote = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
    })

    const productos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }).then((res) => res.json())

    const servicios = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }).then((res) => res.json())

    const quote = await resQuote.json()
    console.log(quote)

    // Sacar IDs de productos ya agregados
    const usedProductIds = new Set(
        quote.items
            .filter((item: any) => item.product) // asegurar que sea producto
            .map((item: any) => item.product.id)
    )

    const usedServiceIds = new Set(
        quote.items
            .filter((item: any) => item.service) // asegurar que sea servicio
            .map((item: any) => item.service.id)
    )

    // Filtrar productos y servicios disponibles
    const productosFiltrados = productos.filter((p: any) => !usedProductIds.has(p.id))
    const serviciosFiltrados = servicios.filter((s: any) => !usedServiceIds.has(s.id))

    const disponibles =
        quote.tipo === 'productos' ? productosFiltrados : serviciosFiltrados

    return (
        <div className="p-6">
            <div className="flex justify-between">
                <h1 className="text-2xl mb-4">{quote.titulo}</h1>

                <Link href='/quotes' className="inline-flex items-center text-[#174940] hover:text-[#0F332D] mb-4 transition">
                    <ArrowLeft size={18} className="mr-1" />
                    Volver al catálogo
                </Link>
            </div>
            {quote.status === 'draft' && (
                <AddItemsModal quoteId={id} quoteType={quote.tipo} availableItems={disponibles} />
            )}
            <QuoteDetail quote={quote} getProductImageDataUrl={getProductImageDataUrl} />
        </div>
    )
}