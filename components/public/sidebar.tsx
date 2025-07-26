// app/cursos/[id]/SidebarNavigation.tsx
'use client';

import { Home, BookOpen, MessageCircle, ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  Icon: React.FC<{ size?: number; className?: string }>;
}

export function SidebarNavigation({
  cursoId,
  user,
}: {
  cursoId: number;
  user: { rol: string; nombre: string };
}) {
  const pathname = usePathname();
  const base = `/cursos/${cursoId}`;

  // Construimos dinámicamente el menú según rol
  const items: NavItem[] = user.rol === "admin"
    ? [
        { label: "Administrar", href: base, Icon: Home },
        { label: "Contenido", href: `${base}/temas`, Icon: BookOpen },
        { label: "Comentarios", href: `${base}/comentarios`, Icon: MessageCircle },
      ]
    : user.rol === "docente"
    ? [
        { label: "Información", href: base, Icon: Home },
        { label: "Temas", href: `${base}/temas`, Icon: BookOpen },
        { label: "Progreso", href: `${base}/progreso`, Icon: ClipboardList },
        { label: "Comentarios", href: `${base}/comentarios`, Icon: MessageCircle },
      ]
    : [
        { label: "Información", href: base, Icon: Home },
        { label: "Temario", href: `${base}/temas`, Icon: BookOpen },
        { label: "Exámenes", href: `${base}/examenes`, Icon: ClipboardList },
        { label: "Comentarios", href: `${base}/comentarios`, Icon: MessageCircle },
      ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-72 border-r border-gray-200 bg-white">
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <Link
          href="/cursos"
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="ml-3 font-bold text-lg">Curso #{cursoId}</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-6 space-y-2">
        {items.map(({ label, href, Icon }) => {
          const isActive = pathname === href || 
                         (href !== base && pathname?.startsWith(href));
          
          return (
            <Link
              key={href}
              href={href}
              className={`
                group flex items-center px-4 py-3 rounded-lg transition-all
                ${isActive
                  ? 'bg-indigo-50 text-indigo-600 font-medium border-l-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600 border-l-4 border-transparent'}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'}`} />
              <span className="ml-3">{label}</span>
              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            {user.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
            <p className="text-xs text-gray-500">{user.rol}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}