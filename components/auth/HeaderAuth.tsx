'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        </div>

        {/* Menú móvil */}
        {mobileOpen && (
          <nav className="lg:hidden pb-6 space-y-4">
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