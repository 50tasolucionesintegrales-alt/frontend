// app/errors/403/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { verifySession } from "@/src/auth/dal";

export const metadata: Metadata = {
  title: "403 | Acceso denegado",
};


export default async function ForbiddenPage() {

  const { user } = await verifySession();   // user.rol = "estudiante" | "docente" | "admin"

  // 2) Mapeamos rol → ruta
  const dashboardByRole: Record<typeof user.rol, string> = {
    estudiante: "/dashboard/estudiante",
    docente: "/dashboard/docente",
    admin: "/dashboard/admin",
  };

  const home = dashboardByRole[user.rol] ?? "/dashboard";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9f1f8] p-6">
      <div className="max-w-md bg-white shadow-lg rounded-xl p-10 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          ¡Acceso denegado!
        </h2>
        <p className="text-gray-600 mb-6">
          No tienes permiso para ver esta página.
        </p>

        <Link
          href={home}
          className="inline-block px-6 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          Volver al dashboard
        </Link>
      </div>
    </main>
  );
}
