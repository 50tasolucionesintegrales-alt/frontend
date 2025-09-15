import CreateOrderModal from "@/components/modals/orders/CreateOrderModal";
import { OrderTable } from "@/components/orders/OrderTable";
import getDraftOrders from "@/src/lib/orders/getDraftOrders";
import getSentOrders from "@/src/lib/orders/getSendOrders";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const [drafts, sent] = await Promise.all([
    getDraftOrders(),
    getSentOrders(),
  ]);

  return (
    <div className="space-y-6 p-6">
      {/* Título principal */}
      <div className="flex items-center gap-2 mb-6">
        <Package size={30} className="text-[#63B23D]" />
        <h1 className="text-3xl font-bold text-[#0F332D]">Gestión de Órdenes</h1>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#174940]">Órdenes en borrador</h2>
          <CreateOrderModal />
        </div>
        <OrderTable orders={drafts} type="draft" />
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#174940] mb-4 mt-8">Órdenes enviadas</h2>
        <OrderTable orders={sent} type="sent" />
      </section>
    </div>
  );
}