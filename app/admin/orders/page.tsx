import AdminOrderTable from "@/components/admin/orders/AdminOrderstable";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function OrdersAdminPage() {
  const token = (await cookies()).get("50TA_TOKEN")?.value;

  const OrdersPend = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/pending`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

  const OrdersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/resolved`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3">
            <div className="flex items-center gap-2">
              <ShoppingCart size={30} className="text-[#63B23D]" />
              <h1 className="text-3xl font-bold text-[#174940]">
                Órdenes de compra (Admin)
              </h1>
            </div>

            <Link
              href="/admin"
              className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-2
                         text-sm bg-white border border-gray-200 rounded-lg shadow-sm
                         text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Volver</span>
            </Link>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#174940] mb-3">Pendientes</h2>
          <AdminOrderTable orders={OrdersPend} type="pending" />
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#174940] mb-3">Resueltas</h2>
          <AdminOrderTable orders={OrdersRes} type="resolved" />
        </section>
      </div>
    </div>
  );
}