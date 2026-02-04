'use client';

import {
  Home, BookOpen, PlusSquare, FileText, ShoppingCart, FileCog, Menu, X, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useTransition } from 'react';
import LOGOSINCUENTAB from '../../public/LOGOSINCUENTAB.png';
import Image from 'next/image';
import { logout } from '@/actions/auth/logoutAction';

type Rol = 'admin' | 'cotizador' | 'comprador' | 'unassigned';

type User = {
  id: number;
  sub: number;
  nombre: string;
  email: string;
  rol: Rol;
};

// menú base con íconos más específicos
const BASE_ITEMS = [
  { label: 'Inicio',            icon: <Home size={20} />,        href: '/admin' },
  { label: 'Catálogo',          icon: <BookOpen size={20} />,    href: '/catalog' },
  { label: 'Agregar',           icon: <PlusSquare size={20} />,  href: '/add' },
  { label: 'Cotizaciones',      icon: <FileText size={20} />,    href: '/quotes' },
  { label: 'Ordenes de compra', icon: <ShoppingCart size={20} />,href: '/orders' },
  { label: 'Machotes',          icon: <FileCog size={20} />,     href: '/admin/templates' },
] as const;

const MENU_BY_ROL: Record<Rol, string[]> = {
  admin:     ['/admin', '/catalog', '/add', '/quotes', '/orders', '/admin/templates'],
  cotizador: ['/catalog', '/add', '/quotes'],
  comprador: ['/catalog', '/add', '/orders'],
  unassigned:['/catalog'],
};

// ✅ Helper para determinar si una ruta está activa correctamente
function isPathActive(pathname: string, href: string) {
  if (pathname === href) return true;
  // Evita que /admin quede activo en subrutas como /admin/templates
  if (href === '/admin') return pathname === '/admin';
  return pathname.startsWith(href + '/');
}

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPending, startTransition] = useTransition();

  const menuItems = useMemo(() => {
    const allowed = MENU_BY_ROL[user.rol] ?? ['/catalog'];
    return BASE_ITEMS.filter(it => allowed.some(p => it.href.startsWith(p)));
  }, [user.rol]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(o => !o);

  return (
    <>
      {/* Botón menú móvil */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#174940] text-white p-2 rounded-lg shadow-lg hover:bg-[#0F332D] transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay móvil */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar - Altura fija */}
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transform transition-transform duration-300 ease-in-out
        w-64 h-screen fixed md:sticky top-0 z-40 border-r border-[#0F332D] bg-[#174940] shadow-xl
        flex flex-col`}
      >
        {/* Logo */}
        <div className="shrink-0 p-6 text-center text-2xl font-bold text-white border-b border-[#63B23D]/30">
          <Image 
            src={LOGOSINCUENTAB} 
            alt="Logo" 
            width={250} 
            height={250} 
            className="mx-auto mb-2" 
          />
        </div>

        {/* Menú - Scrollable si es necesario */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          {menuItems.map((item) => {
            const active = isPathActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#63B23D] text-white shadow-md hover:bg-[#63B23D]/90'
                    : 'text-white/90 hover:bg-[#0F332D] hover:text-white'
                }`}
              >
                <span className={`${active ? 'text-white' : 'text-[#63B23D]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer - Siempre al fondo */}
        <div className="shrink-0 p-4 border-t border-[#63B23D]/20 bg-[#174940]">
          <form
            action={() => {
              startTransition(() => logout());
            }}
            className="flex items-center justify-between"
          >
            <span className="text-xs text-[#cfe9c6]">v1.0.14 • 50TA</span>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                 text-white bg-[#0F332D] hover:bg-[#0c2a25] transition-colors disabled:opacity-70"
              aria-label="Cerrar sesión"
            >
              <LogOut size={16} />
              {isPending ? 'Cerrando…' : 'Cerrar sesión'}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}