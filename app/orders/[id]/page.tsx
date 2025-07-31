import { cookies } from "next/headers"
import OrderDetailTable from "@/components/orders/OrderDetailTable"

export default async function OrdersDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const  order = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    const productos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }).then((res) => res.json())

    // Sacar IDs de productos ya agregados
    const usedProductIds = new Set(
        order.items
            .filter((item: any) => item.product)
            .map((item: any) => item.product.id)
    )

    const productosFiltrados = productos.filter((p: any) => !usedProductIds.has(p.id))
  return (
    <OrderDetailTable order={order} productos={productosFiltrados} />
  )
}
