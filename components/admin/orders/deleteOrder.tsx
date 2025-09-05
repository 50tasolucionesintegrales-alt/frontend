'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { deleteOrderAction } from '@/actions/admin/orders/deleteOrderAction'

/* ---------- Botón submit interno con estado pending ---------- */
function ConfirmDeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
        pending
          ? 'bg-red-400 cursor-not-allowed text-white'
          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
      }`}
    >
      {pending ? 'Eliminando…' : 'Sí, eliminar'}
    </button>
  )
}

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [state, dispatch] = useActionState(deleteOrderAction, {
    success: '',
    errors: []
  })

  /* Efectos secundarios de la acción */
  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      state.errors.forEach(e => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
      setOpen(false)
      router.push('/admin/orders')
    }
  }, [state, router])

  return (
    <>
      {/* Botón que abre el modal */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 text-sm rounded-lg border text-red-600 hover:bg-red-50 transition-colors"
      >
        Eliminar orden
      </button>

      {/* Modal de confirmación */}
      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            className="relative z-50"
          >
            {/* Backdrop animado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Contenedor centrado */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-900">
                    Confirmar eliminación
                  </Dialog.Title>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                    aria-label="Cerrar"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Contenido */}
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Estás a punto de eliminar esta orden
                  </p>
                  <p className="text-sm text-gray-500">
                    Esta acción <span className="font-semibold">no se puede deshacer</span>.
                    Se eliminarán de forma permanente los datos asociados.
                  </p>
                </div>

                {/* Formulario (server action) */}
                <form action={dispatch} className="space-y-5 mt-6">
                  <input type="hidden" name="orderId" value={orderId} />

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>

                    <ConfirmDeleteButton />
                  </div>
                </form>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
