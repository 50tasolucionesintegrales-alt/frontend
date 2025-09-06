import { cookies } from "next/headers";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

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
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-3">
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