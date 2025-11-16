import { cookies } from "next/headers"
import OrderDetailTable from "@/components/orders/OrderDetailTable"
import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction';
import { getEvidenceImageDataUrl } from "@/actions/orders/EvidenceImageAction";
import { Item, Producto } from "@/src/schemas";

export default async function OrdersDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const resOrder = fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        },
        next: { revalidate: 10 },
    }).then((res) => res.json())

    const resProductos = fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        next: { revalidate: 10 },
    }).then((res) => res.json())

    const [order, productos] = await Promise.all([resOrder, resProductos])

    // Sacar IDs de productos ya agregados
    const usedProductIds = new Set(
        order.items
            .filter((item: Item) => item.product)
            .map((item: Item) => item.product.id)
    )

    const productosFiltrados = productos.filter((p: Producto) => !usedProductIds.has(p.id))
  return (
    <OrderDetailTable 
        order={order} 
        productos={productosFiltrados}
        getProductImageDataUrl={getProductImageDataUrl} 
        getEvidenceImageDataUrl={getEvidenceImageDataUrl} 
    />
  )
}
