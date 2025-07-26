'use client';

import {
  FaBell,
  FaCog,
  FaUserCircle,
  FaSearch,
  FaBars,
} from 'react-icons/fa';
import { X } from 'lucide-react'
import Logo from '../ui/Logo';
import AdminNavigation from '../nav/AdminNav';
import { User } from '@/src/schemas';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header({ nombre, rol, avatar }: User) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');

  const router = useRouter();
  const pathname = usePathname();

  const isCursosPage = pathname.includes('/cursos');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = search.trim();

    if (!isCursosPage) return;

    if (term) {
      router.push(`${pathname}?search=${encodeURIComponent(term)}`);
    } else {
      router.push(pathname);
    }
  };

  const rutaBase =
    rol === 'admin'
      ? '/dashboard/admin'
      : rol === 'docente'
        ? '/dashboard/docente'
        : '/dashboard/estudiante';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Menú Hamburguesa */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
            >
              <FaBars className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Logo ruta={rutaBase} />
            </div>
          </div>

          {/* Buscador Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            {isCursosPage && (
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cursos…"
                  className="rounded-full bg-gray-50 text-gray-800
                  pl-10 pr-10 py-2 w-full shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-300
                  transition duration-200 border border-transparent
                  hover:border-gray-200 focus:border-indigo-300"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      router.push(pathname);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            )}
          </div>

          {/* Iconos de acción Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Nombre y avatar como un solo elemento clickeable */}
            <Link
              href={'/dashboard/perfil'}
              className="flex items-center gap-2 ml-2 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
              onClick={() => { /* Tu función para manejar el click */ }}
            >
              <p className="font-medium text-sm">{nombre}</p>
              {avatar ? (
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  alt="Avatar"
                  src={avatar}
                />
              ) : (
                <FaUserCircle size={24} className="text-gray-500 hover:text-indigo-600" />
              )
              }
            </Link>

            <AdminNavigation />
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-3">
            {isCursosPage && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
              >
                <FaSearch className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && isCursosPage && (
          <div className="lg:hidden pb-3 px-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cursos…"
                className="rounded-full bg-gray-50 text-gray-800
                pl-10 pr-10 py-2 w-full shadow-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-300
                transition duration-200 border border-gray-200"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    router.push(pathname);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 px-2 space-y-3">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <FaUserCircle size={20} className="text-gray-500" />
              <div>
                <p className="font-medium">{nombre}</p>
                <p className="text-xs text-gray-500 capitalize">{rol}</p>
              </div>
            </div>

            <AdminNavigation mobile />

            <div className="flex justify-around pt-2 border-t border-gray-100">
              <button className="p-2 text-gray-500 hover:text-indigo-600">
                <FaBell size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-indigo-600">
                <FaCog size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
