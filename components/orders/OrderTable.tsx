"use client";

import { Order } from "@/src/schemas";
import Link from "next/link";

type Props = {
  orders: Order[];
  type: "draft" | "sent";
};

/* Traducción + color */
const statusMap: Record<
  string,
  { label: string; classes: string }
> = {
  draft: {
    label: "Borrador",
    classes: "bg-gray-100 text-gray-600",
  },
  sent: {
    label: "Enviada",
    classes: "bg-blue-100 text-blue-800",
  },
  partially_approved: {
    label: "Parcialmente aprobada",
    classes: "bg-yellow-100 text-yellow-800",
  },
  approved: {
    label: "Aprobada",
    classes: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Rechazada",
    classes: "bg-red-100 text-red-700",
  },
};

export function OrderTable({ orders, type }: Props) {
  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#999999]">
          No hay órdenes {type === "draft" ? "en borrador" : "enviadas"}.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#e5e7eb] rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-[#e5e7eb]">
        <thead className="bg-[#174940]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              # Ítems
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Progreso
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-[#e5e7eb]">
          {orders.map((order) => {
            const { label, classes } =
              statusMap[order.status as keyof typeof statusMap] ??
              statusMap.draft;

            return (
              <tr
                key={order.id}
                className="hover:bg-[#f0f7f5] transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-[#0F332D]">
                  {order.titulo}
                </td>

                <td className="px-6 py-4 text-sm text-[#174940]">
                  {order.items.length}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${classes}`}
                  >
                    {label}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="w-full bg-[#e5e7eb] rounded-full h-2.5">
                    <div
                      className="bg-[#63B23D] h-2.5 rounded-full"
                      style={{ width: `${order.progressPct ?? 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#999999] mt-1 block">
                    {order.progressPct ?? 0}% completado
                  </span>
                </td>

                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-[#174940] hover:text-[#0F332D] flex items-center hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Ver detalle
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
