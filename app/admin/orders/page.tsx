import AdminOrderTable from "@/components/admin/orders/AdminOrderstable"
import { ArrowLeft } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function OrdersAdminPage() {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const OrdersPend = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/pending`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json())

  const OrdersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/resolved`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json())

  console.log(OrdersPend)
  console.log(OrdersRes)
  return (
    <div className="space-y-10 p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Órdenes de compra (Admin)</h1>
        <Link href='/admin' className="inline-flex items-center ml-4 pt-2 text-[#174940] hover:text-[#0F332D] mb-4 transition">
          <ArrowLeft size={18} className="mr-1" />
          Volver
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Pendientes</h2>
        <AdminOrderTable orders={OrdersPend} type="pending" />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Resueltas</h2>
        <AdminOrderTable orders={OrdersRes} type="resolved" />
      </section>
    </div>
  )
}
