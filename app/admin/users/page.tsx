import { cookies } from "next/headers";
import { Users } from "lucide-react";

import ButtonBack from "@/components/ui/ButtonBack";
import UserRoleTable from "@/components/admin/UserTable";
import { User } from "@/src/schemas";

export default async function UsersPage() {
  const token = (await cookies()).get("50TA_TOKEN")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/with-role`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  const data: User[] = await res.json();

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          {/* Contenedor del título */}
          <div className="flex items-center gap-3 flex-1">
            <Users size={28} className="text-[#63B23D]" />
            <div>
              <h1 className="text-3xl font-bold text-[#174940]">
                Gestionar usuarios
              </h1>
              <p className="text-gray-600 text-sm md:block mt-1">
                Edita los roles y permisos de los usuarios
              </p>
            </div>
          </div>

          {/* Botón “Volver” */}
          <ButtonBack href="/admin" />
        </header>

        {/* Tabla de usuarios */}
        <UserRoleTable users={data} mode="edit" />
      </div>
    </div>
  );
}