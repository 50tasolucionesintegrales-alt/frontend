// app/orders/page.tsx
import CreateOrderModal from "@/components/modals/orders/CreateOrderModal";
import { OrderTable } from "@/components/orders/OrderTable";
import getDraftOrders from "@/src/lib/orders/getDraftOrders";
import getSentOrders from "@/src/lib/orders/getSendOrders";

export default async function OrdersPage() {
  const [drafts, sent] = await Promise.all([
    getDraftOrders(),
    getSentOrders(),
  ]);

  return (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Órdenes en borrador</h2>
        <CreateOrderModal />
        </div>
        <OrderTable orders={drafts} type="draft" />
      </section>

      <section>
        <h2 className="text-xl font-semibold">Órdenes enviadas</h2>
        <OrderTable orders={sent} type="sent" />
      </section>
    </div>
  );
}
