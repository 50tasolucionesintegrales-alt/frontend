import { cookies } from "next/headers";
import { Users } from "lucide-react";

import ButtonBack from "@/components/ui/ButtonBack";
import UserRoleTable from "@/components/admin/UserTable";
import { User } from "@/src/schemas";

export default async function UnassignedUsersPage() {
  const token = (await cookies()).get("50TA_TOKEN")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/unassigned`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data: User[] = await res.json();

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center gap-3">
          {/* Contenedor del título */}
          <div className="flex items-center gap-3 flex-1">
            <Users size={30} className="text-[#63B23D]" />
            <div>
              <h1 className="text-3xl font-bold text-[#174940]">
                Gestionar nuevos usuarios
              </h1>
              <p className="text-gray-600 text-sm mt-1 md:mt-0">
                Asigna roles a usuarios pendientes
              </p>
            </div>
          </div>

          {/* Botón Back siempre a la derecha */}
          <ButtonBack href="/admin" />
        </header>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#174940] mb-4">
            Usuarios sin rol asignado
          </h2>
          <UserRoleTable users={data} mode="assign" />
        </div>
      </div>
    </div>
  );
}