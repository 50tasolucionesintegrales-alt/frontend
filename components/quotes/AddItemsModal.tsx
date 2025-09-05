'use client'
import { useState, useEffect, startTransition, useActionState } from 'react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { addItemsAction } from '@/actions/quotes/addItemsAction'
import ProductSelectionModal from './ProductSelectionModal'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Producto } from '@/src/schemas'

type SelectedItem = {
  id: string | number;
  cantidad?: number | string;
  precio?: number | string;
  precioBase?: number | string;
  unidad?: string;
};

export default function AddItemsModal({
  quoteId,
  quoteType,
  availableItems,
}: {
  quoteId: string
  quoteType: 'productos' | 'servicios'
  availableItems: Producto[]
}) {
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState<SelectedItem[]>([])
  const router = useRouter()

  // Server Action
  const [state, dispatch, pending] = useActionState(addItemsAction, {
    errors: [],
    success: '',
  })

  useEffect(() => {
    state.errors.forEach(e => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      router.refresh()
      setSelected([])
      setOpen(false)
    }
  }, [state, router])

  /* ——— Enviar al back ——— */
  const handleSubmit = () => {
    const sanitizeUnidad = (v: unknown) =>
      (typeof v === 'string' ? v : String(v ?? ''))
        .trim()
        .slice(0, 120) || 'pieza';

    const parsePrecio = (v: unknown): number => {
      if (typeof v === 'number') return v;
      if (typeof v !== 'string') return 0;
      // limpia $ y separadores, soporta coma/punto
      const clean = v
        .replace(/[^\d,.\-]/g, '')
        .replace(/\.(?=\d{3}(?:\D|$))/g, '')
        .replace(/,(?=\d{3}(?:\D|$))/g, '')
        .replace(',', '.');
      const n = Number(clean);
      return Number.isFinite(n) ? n : 0;
    };

    const itemsToSend = selected.map((item) => ({
      tipo: quoteType === 'productos' ? 'producto' : 'servicio',
      ...(quoteType === 'productos'
        ? { productId: Number(item.id) }
        : { serviceId: Number(item.id) }),
      cantidad: Number.isFinite(Number(item.cantidad)) && Number(item.cantidad) > 0
        ? Number(item.cantidad)
        : 1,
      costoUnitario: +parsePrecio(item.precio ?? item.precioBase ?? 0).toFixed(2),
      unidad: sanitizeUnidad(item.unidad ?? 'pieza'),
    }));

    const fd = new FormData();
    fd.append('quoteId', quoteId);
    fd.append('items', JSON.stringify(itemsToSend));
    startTransition(() => dispatch(fd));
  };

  return (
    <>
      <button
        className="mt-6 mb-5 px-4 py-2 bg-[#174940] text-white rounded-lg hover:bg-[#14533f] font-medium transition-colors shadow-sm"
        onClick={() => setOpen(true)}
      >
        Agregar ítems
      </button>

      <AnimatePresence>
        {open && (
          <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            {/* Fondo oscuro con animación */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Contenedor del modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl mx-2"
              >
                {/* Encabezado */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-900">
                    Agregar {quoteType === 'productos' ? 'productos' : 'servicios'}
                  </Dialog.Title>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Contenido del modal */}
                <div className="max-h-[60vh] overflow-y-auto">
                  <ProductSelectionModal
                    items={availableItems}
                    onSelect={setSelected}
                  />
                </div>

                {/* Pie del modal con botones */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => setOpen(false)}
                    disabled={pending}
                    className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={pending || selected.length === 0}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      pending || selected.length === 0
                        ? 'bg-green-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    }`}
                  >
                    {pending
                      ? 'Agregando…'
                      : `Agregar ${selected.length} ítem(s)`}
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}