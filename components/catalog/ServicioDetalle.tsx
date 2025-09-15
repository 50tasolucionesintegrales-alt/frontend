'use client';

import { Quote, Service } from '@/src/schemas';
import { NotebookText } from 'lucide-react';
import { useMemo, useState } from 'react';
import AddServiceToQuoteModal from '../modals/catalog/AddServiceToQuote';

type Props = {
  service: Service;
  drafts: Quote[];
  createServiceQuoteHref?: string;
};

function isServiceDraft(q: Quote) {
  const v = (q.tipo || '').toString().toLowerCase();
  return v === 'servicio' || v === 'servicios' || v === 'service' || v === 'services';
}
function formatMXN(value: string | number) {
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (Number.isNaN(n)) return '--';
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });
}

export default function ServiceDetail({ service, drafts, createServiceQuoteHref = '/quotes/new?type=service' }: Props) {
  const [qty, setQty] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(() => {
    const n = Number.parseFloat(service.precioBase ?? '0');
    return Number.isNaN(n) ? 0 : n;
  });
  const [open, setOpen] = useState(false);

  const serviceDrafts = useMemo(() => {
    const only = drafts.filter(isServiceDraft);
    return (only.length > 0 ? only : drafts) as Quote[];
  }, [drafts]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border border-[#174940]/15 rounded-2xl p-5 bg-white">
            <div className="h-44 w-full flex items-center justify-center rounded-xl bg-[#174940]/5 mb-5">
              <NotebookText className="h-10 w-10 text-[#174940]" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.nombre}</h1>
            <div className="text-sm text-gray-500">
              Creado por: <span className="font-medium">{service.createdBy?.nombre ?? service.createdBy?.email ?? '—'}</span>
            </div>

            <div className="mt-4 prose prose-sm max-w-none text-gray-700">
              <p>{service.descripcion}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-[#174940]/15 rounded-2xl p-5 bg-white space-y-4">
            <div>
              <div className="text-sm text-gray-500">Precio base</div>
              <div className="text-2xl font-semibold text-[#174940]">{formatMXN(service.precioBase)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cantidad</label>
                <input
                  title='cantidad'
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#174940]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Precio unitario</label>
                <input
                  title='Precio'
                  type="number"
                  min={0}
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-[#174940]/50"
                />
              </div>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#174940] text-white rounded-lg px-4 py-2 font-medium hover:bg-[#174940]/90 disabled:opacity-60"
              disabled={serviceDrafts.length === 0}
              title={serviceDrafts.length === 0 ? 'No hay cotizaciones de servicios en borrador' : ''}
            >
              Agregar a cotización…
            </button>

            <p className="text-xs text-gray-400 pt-2">
              Los <span className="font-medium">servicios no se pueden agregar a órdenes</span>. Solo a cotizaciones de tipo servicios.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddServiceToQuoteModal
        open={open}
        onClose={() => setOpen(false)}
        serviceId={service.id}
        drafts={serviceDrafts}
        defaultCantidad={qty}
        defaultCosto={unitPrice}
        defaultUnidad="servicio"
        createServiceQuoteHref={createServiceQuoteHref}
      />
    </div>
  );
}
