'use client';

import { Service } from '@/src/schemas';
import { NotebookText } from 'lucide-react';
import Link from 'next/link';

type Props = {
  service: Service;
  onClick?: (service: Service) => void; 
};

function formatMXN(value: string) {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) return '--';
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });
}

export default function ServiceCard({ service, onClick }: Props) {
  return (
    <Link
      href={`/catalog/${service.id}`}
      className="group relative border border-[#174940]/15 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
      role="button"
      onClick={() => onClick?.(service)}
    >
      {/* Icono/placeholder (los servicios normalmente no tienen imagen) */}
      <div className="h-28 w-full flex items-center justify-center rounded-lg bg-[#174940]/5 mb-3">
        <NotebookText className="h-8 w-8 text-[#174940]" />
      </div>

      {/* Info principal */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{service.nombre}</h3>
        <p className="text-xs text-gray-500 line-clamp-3">{service.descripcion}</p>
      </div>

      {/* Precio */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-semibold text-[#174940]">{formatMXN(service.precioBase)}</span>
      </div>

      {/* CTA sutil al hover (opcional) */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-[#174940]/20 pointer-events-none" />
    </Link>
  );
}
