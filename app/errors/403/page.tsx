// app/errors/403/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { verifySession } from "@/src/auth/dal";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "403 | Acceso denegado",
};

export default async function ForbiddenPage() {
  const { user } = await verifySession();

  const dashboardByRole: Record<typeof user.rol, string> = {
    cotizador: "/catalog",
    comprador: "/catalog",
    admin: "/admin",
    unassigned: "/auth/login",
  };

  const home = dashboardByRole[user.rol] ?? "/dashboard";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f0f7f5] p-6">
      <div className="max-w-md bg-white shadow-xl rounded-2xl p-10 text-center border border-[#e5e7eb]">
        {/* Icono */}
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Títulos */}
        <h1 className="text-6xl font-bold text-[#0F332D] mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-[#174940] mb-3">
          ¡Acceso denegado!
        </h2>
        
        {/* Mensaje */}
        <p className="text-[#999999] mb-8 leading-relaxed">
          No tienes los permisos necesarios para acceder a esta página.
          Por favor, contacta al administrador si necesitas acceso.
        </p>

        {/* Botón de regreso */}
        <Link
          href={home}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al dashboard
        </Link>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-[#f8fafc] rounded-lg border border-[#e5e7eb]">
          <p className="text-sm text-[#174940]">
            Rol actual: <span className="font-medium capitalize">{user.rol}</span>
          </p>
        </div>
      </div>
    </main>
  );
}