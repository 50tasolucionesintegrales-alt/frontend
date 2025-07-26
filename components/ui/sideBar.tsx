'use client';

import {
  Home,
  ClipboardList,
  Menu,
  X,
  SquarePlus,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LOGOSINCUENTAB from '../../public/LOGOSINCUENTAB.png';
import Image from 'next/image';

const menuItems = [
  {
    label: 'Inicio',
    icon: <Home size={20} />,
    href: '/admin',
  },
  {
    label: 'Agregar Producto',
    icon: <SquarePlus size={20} />,
    href: '/admin/agregar-producto',
  },
  {
    label: 'Cotizaciones',
    icon: <FileText size={20} />,
    href: '/admin/cotizaciones',
  },
  {
    label: 'Machotes',
    icon: <ClipboardList size={20} />,
    href: '/admin/machotes',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#174940] text-white p-2 rounded-lg shadow-lg hover:bg-[#0F332D] transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transform transition-transform duration-300 ease-in-out
        w-64 min-h-screen fixed md:relative z-40 border-r border-[#0F332D] bg-[#174940] shadow-xl`}
      >
        <div className="p-6 text-center text-2xl font-bold text-white border-b border-[#63B23D]/30">
          <Image src={LOGOSINCUENTAB} alt="Logo" width={250} height={250} className="mx-auto mb-2" />
        </div>

        <nav className="px-4 py-6 space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive  
                    ? 'bg-[#63B23D] text-white shadow-md hover:bg-[#63B23D]/90'
                    : 'text-white/90 hover:bg-[#0F332D] hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-[#63B23D]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-[#999999] border-t border-[#63B23D]/20">
          v1.0.0 • 50TA
        </div>
      </aside>
    </>
  );
}