import AdminOrderTable from "@/components/admin/orders/AdminOrderstable";
import { ShoppingCart } from "lucide-react";
import { cookies } from "next/headers";
import ButtonBack from "@/components/ui/ButtonBack";

export default async function OrdersAdminPage() {
  const token = (await cookies()).get("50TA_TOKEN")?.value;

  const resOrdersPend = fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/pending`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 10 },
  }).then((res) => res.json());

  const resOrdersRes = fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/resolved`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 10 },
  }).then((res) => res.json());

  const [OrdersPend, OrdersRes] = await Promise.all([resOrdersPend, resOrdersRes]);

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
            <ShoppingCart size={30} className="text-[#63B23D]" />
            <div>
              <h1 className="text-3xl font-bold text-[#174940]">
                Órdenes de compra (Admin)
              </h1>
              <p className="text-gray-600 text-sm md:hidden mt-1">
                Gestiona órdenes pendientes y resueltas
              </p>
            </div>

            {/* Botón en móviles */}
            <div className="md:hidden">
              <ButtonBack href="/admin" />
            </div>
          </div>

          {/* Botón en pantallas grandes */}
          <div className="hidden md:block">
            <ButtonBack href="/admin" />
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