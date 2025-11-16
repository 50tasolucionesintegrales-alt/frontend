import { getProductImageDataUrl } from "@/actions/add/products/ProductImageAction"
import AddItemsModal from "@/components/quotes/AddItemsModal"
import QuoteDetail from "@/components/quotes/QuoteDetail"
import { Item, Producto, Service } from "@/src/schemas"
import { cookies } from "next/headers"
import ButtonBack from "@/components/ui/ButtonBack"

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const fetchOptions = {
        headers: { Authorization: `Bearer ${token}` },
    }

    const quotePromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${id}`, {
        ...fetchOptions,
        next: { revalidate: 60, tags: [`quote-${id}`] },
    }).then((res) => res.json())

    const productsPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        ...fetchOptions,
        next: { revalidate: 60 },
    }).then((res) => res.json())

    const servicesPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        ...fetchOptions,
        next: { revalidate: 60 },
    }).then((res) => res.json())

    const [quote, productos, servicios] = await Promise.all([
        quotePromise,
        productsPromise,
        servicesPromise,
    ])

    const itemsWithImages = await Promise.all(
        quote.items.map(async (item: Item) => {
            if (item.product?.id) {
                const imageUrl = await getProductImageDataUrl(String(item.product.id))
                return { ...item, imageUrl }
            }
            return item
        })
    ) 

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

    const disponibles =
        quote.tipo === 'productos' ? productosFiltrados : serviciosFiltrados

    const quoteWithImages = {
    ...quote,
    items: itemsWithImages, // <-- USAMOS LOS ITEMS MODIFICADOS
    }       

    return (
        <div className="p-6">
            {/* Header con título y botón de volver */}
            <div className="flex items-center justify-between mb-6 gap-3">
                <h1 className="text-3xl font-bold text-[#0F332D]">{quote.titulo}</h1>

                {/* Botón de volver */}
                <ButtonBack href="/quotes" />
            </div>

            {quote.status === 'draft' && (
                <AddItemsModal quoteId={id} quoteType={quote.tipo} availableItems={disponibles} />
            )}

            <QuoteDetail {...quoteWithImages} />
        </div>
    )
}