'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, LogIn, UserPlus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../ui/Logo';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');

  const router = useRouter();
  const pathname = usePathname();
  const isCursosPage = pathname.includes('/cursos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = search.trim();
    if (!isCursosPage) return;
    router.push(term ? `${pathname}?search=${encodeURIComponent(term)}` : pathname);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F332D]/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---- Barra principal ---- */}
        <div className="flex items-center justify-between h-16">
          {/* Menú + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="lg:hidden text-white hover:text-[#63B23D] p-2"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo />
          </div>

          {/* Buscador desktop */}
          {isCursosPage && (
            <form
              onSubmit={handleSubmit}
              className="hidden lg:flex max-w-md flex-1 mx-6 relative"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cursos…"
                className="w-full rounded-full pl-10 pr-12 py-2 bg-white/80 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#63B23D]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {search && (
                <button
                  title='cerrar'
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          )}

          {/* Acciones desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#63B23D] text-white hover:bg-[#4b8f2f] transition"
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#63B23D] text-[#63B23D] hover:bg-[#63B23D]/10 transition"
            >
              <UserPlus className="w-4 h-4" />
              Registrarse
            </Link>
          </div>

          {/* Botones móviles */}
          <div className="lg:hidden flex items-center gap-3">
            {isCursosPage && (
              <button
                title='buscar'
                onClick={() => setSearchOpen((p) => !p)}
                className="text-white hover:text-[#63B23D] p-2"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Buscador móvil */}
        {searchOpen && isCursosPage && (
          <form onSubmit={handleSubmit} className="lg:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cursos…"
                className="w-full rounded-full pl-10 pr-12 py-2 bg-white/80 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#63B23D]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {search && (
                <button
                  title='cerrar'
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        )}

        {/* Menú móvil */}
        {mobileOpen && (
          <nav className="lg:hidden pb-6 space-y-4">
            {/* Aquí tus enlaces de navegación */}
            <Link href="/" className="block text-white hover:text-[#63B23D]">
              Inicio
            </Link>
            <Link href="/cursos" className="block text-white hover:text-[#63B23D]">
              Cursos
            </Link>
            {/* Acciones */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
              <Link
                href="/auth/login"
                className="text-center py-2 rounded-lg bg-[#63B23D] text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                className="text-center py-2 rounded-lg border border-[#63B23D] text-[#63B23D]"
              >
                Registrarse
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
