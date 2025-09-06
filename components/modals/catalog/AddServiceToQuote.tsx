'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { addItemsAction } from '@/actions/quotes/addItemsAction';
import Link from 'next/link';
import { toast } from 'react-toastify';

type Draft = {
  id: string | number;
  titulo?: string;
  number?: string;
  tipo?: string;      // 'servicios' | 'productos'
  status?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  serviceId: string | number;
  drafts: Draft[];              // drafts recibidos del server
  defaultCantidad?: number;
  defaultCosto?: number;
  defaultUnidad?: string;       // 'pieza' por defecto
  createServiceQuoteHref?: string;
};

const initialState = { errors: [] as string[], success: '' };

function getIdString(x: unknown) {
  return x != null ? String(x) : '';
}
function isServiceDraft(d: Draft) {
  const v = (d.tipo || '').toString().toLowerCase();
  return v === 'servicio' || v === 'servicios' || v === 'service' || v === 'services';
}

export default function AddServiceToQuoteModal({
  open,
  onClose,
  serviceId,
  drafts,
  defaultCantidad = 1,
  defaultCosto = 0,
  defaultUnidad = 'pieza',
  createServiceQuoteHref = '/quotes/new?type=service',
}: Props) {
  const [state, formAction] = useActionState(addItemsAction, initialState);

  // filtro a solo servicios; si tu endpoint a veces no manda tipo, caemos al total
  const serviceDrafts = useMemo(() => {
    const only = drafts.filter(isServiceDraft);
    const list = (only.length > 0 ? only : drafts)
      .map(d => ({ ...d, __id: getIdString(d.id) }))
      .filter(d => d.__id);
    return list;
  }, [drafts]);

  const [quoteId, setQuoteId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(defaultCantidad);
  const [costo, setCosto] = useState<number>(defaultCosto);
  const [unidad, setUnidad] = useState<string>(defaultUnidad);
  const [submitting, setSubmitting] = useState(false);

  // autoselecciona primera draft válida al abrir
  useEffect(() => {
    if (open) {
      setCantidad(defaultCantidad);
      setCosto(defaultCosto);
      setUnidad(defaultUnidad);
      if (serviceDrafts.length > 0) setQuoteId(serviceDrafts[0].__id);
    }
  }, [open, serviceDrafts, defaultCantidad, defaultCosto, defaultUnidad]);

  // cierra cuando hay éxito
  useEffect(() => {
    if (state.success && open) {
      toast.success(state.success);
      onClose();
    }
  }, [state.success, open, onClose]);

  if (!open) return null;

  const canSubmit = Boolean(quoteId) && cantidad > 0 && costo > 0;

  // payload para items
  const itemsJson = JSON.stringify([
    {
      tipo: 'servicio',
      serviceId,
      cantidad,
      costoUnitario: costo,
      unidad,
    },
  ]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Agregar servicio a cotización</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          action={async (fd: FormData) => {
            try {
              setSubmitting(true);
              await formAction(fd);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="px-5 py-4 space-y-4">
            {/* Cotización */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cotización (servicios)</label>
              {serviceDrafts.length > 0 ? (
                <select
                  title='c servicio'
                  value={quoteId}
                  onChange={(e) => setQuoteId(e.currentTarget.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#174940]/50"
                >
                  {serviceDrafts.map((q) => (
                    <option key={q.__id} value={q.__id}>
                      {q.titulo || q.number || q.__id}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-600">
                  No hay borradores de servicios.{' '}
                  <Link className="text-[#174940] underline" href={createServiceQuoteHref}>
                    Crear nueva
                  </Link>
                </div>
              )}
            </div>

            {/* Cantidad y costo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cantidad</label>
                <input
                  title='cantidad'
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.currentTarget.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#174940]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Precio unitario</label>
                <input
                  title='precio'
                  type="number"
                  min={0}
                  step="0.01"
                  value={costo}
                  onChange={(e) => setCosto(Number(e.currentTarget.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#174940]/50"
                />
              </div>
            </div>

            {/* Unidad */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Unidad</label>
              <select
                title='unidad'
                value={unidad}
                onChange={(e) => setUnidad(e.currentTarget.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#174940]/50"
              >
                <option value="pieza">pieza</option>
                <option value="hora">hora</option>
                <option value="servicio">servicio</option>
              </select>
            </div>

            {/* Hidden inputs para la server action */}
            <input type="hidden" name="quoteId" value={quoteId} />
            <input type="hidden" name="items" value={itemsJson} />
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting || serviceDrafts.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#174940] text-white hover:bg-[#174940]/90 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Agregar
            </button>
          </div>

          {/* Mensajería simple (de la action) */}
          {(state.success || state.errors.length > 0) && (
            <div className="px-5 pb-4">
              {state.success ? (
                <p className="text-green-700 text-sm">{state.success}</p>
              ) : (
                <ul className="text-red-700 text-sm list-disc pl-5">
                  {state.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
