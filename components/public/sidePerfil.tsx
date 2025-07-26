// app/cursos/[id]/SidebarNavigation.tsx
'use client';

import { useAuthClient } from "@/src/context/authClientContext";
import { Key, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
    Icon: React.FC<{ size?: number; className?: string }>;
}

export function SidePerfil() {
    const { user } = useAuthClient();
    const pathname = usePathname();

    const rutaBack = user?.rol === 'admin'
        ? '/dashboard/admin'
        : user?.rol === 'docente'
            ? '/dashboard/docente'
            : '/dashboard/estudiante';

    // Menú de navegación con iconos más adecuados
    const items: NavItem[] = [
        { label: "Perfil", href: `/dashboard/perfil`, Icon: User },
        { label: "Actualizar Contraseña", href: `/dashboard/perfil/actualizar-password`, Icon: Key },
    ];

    return (
        <aside className="hidden lg:flex lg:flex-col w-72 border-r border-gray-200 bg-white h-screen sticky top-0">
            {/* Encabezado */}
            <div className="h-20 flex items-center px-6 border-b border-gray-200">
                <Link
                    href={rutaBack}
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="ml-3 font-bold text-lg">Tu Perfil</span>
                </Link>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-2 py-6 space-y-1">
                {items.map(({ label, href, Icon }) => {
                    const isActive = pathname === href || 
                                   (href !== `/dashboard/perfil` && pathname?.startsWith(href));

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`
                                group flex items-center px-4 py-3 rounded-lg transition-all mx-2
                                ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}
                            `}
                        >
                            <div className={`
                                p-2 rounded-lg mr-3
                                ${isActive 
                                    ? 'bg-indigo-100 text-indigo-600' 
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'}
                            `}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="flex-1">{label}</span>
                            {isActive && (
                                <div className="w-1.5 h-6 rounded-full bg-indigo-600 ml-2"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Pie de página con información del usuario */}
            <div className="px-4 py-4 border-t border-gray-200">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium shadow-sm">
                        {user?.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                            {user?.nombre}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                            {user?.rol}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}