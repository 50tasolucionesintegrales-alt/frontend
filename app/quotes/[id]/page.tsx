import { getProductImageDataUrl } from "@/actions/add/products/ProductImageAction"
import AddItemsModal from "@/components/quotes/AddItemsModal"
import QuoteDetail from "@/components/quotes/QuoteDetail"
import { Item, Producto, Service } from "@/src/schemas"
import { cookies } from "next/headers"
import ButtonBack from "@/components/ui/ButtonBack"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const fetchOptions = {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store' as const,
    }

    // Cargar la cotización primero
    const quote = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${id}`, {
        ...fetchOptions,
        cache: 'no-store',
    }).then((res) => res.json())

    // Cargar imágenes de productos
    const itemsWithImages = await Promise.all(
        quote.items.map(async (item: Item) => {
            if (item.product?.id) {
                const imageUrl = await getProductImageDataUrl(String(item.product.id))
                return { ...item, imageUrl }
            }
            return item
        })
    )

    // Solo cargar productos/servicios si es borrador
    let disponibles: any[] = []

    if (quote.status === 'draft') {
        const [productos, servicios] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, fetchOptions).then(r => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, fetchOptions).then(r => r.json()),
        ])

        const usedProductIds = new Set(
            quote.items
                .filter((item: Item) => item.product)
                .map((item: Item) => item.product.id)
        )
        const usedServiceIds = new Set(
            quote.items
                .filter((item: Item) => item.service)
                .map((item: Item) => item.service?.id)
        )

        const productosFiltrados = productos.filter((p: Producto) => !usedProductIds.has(p.id))
        const serviciosFiltrados = servicios.filter((s: Service) => !usedServiceIds.has(s.id))

        disponibles = quote.tipo === 'productos' ? productosFiltrados : serviciosFiltrados
    }

    const quoteWithImages = {
        ...quote,
        items: itemsWithImages,
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6 gap-3">
                <h1 className="text-3xl font-bold text-[#0F332D]">{quote.titulo}</h1>
                <ButtonBack href="/quotes" />
            </div>

            {quote.status === 'draft' && (
                <AddItemsModal quoteId={id} quoteType={quote.tipo} availableItems={disponibles} />
            )}

            <QuoteDetail {...quoteWithImages} />
        </div>
    )
}