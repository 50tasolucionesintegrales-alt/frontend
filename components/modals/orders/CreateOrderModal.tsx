'use client'

import { useActionState, useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createOrderAction } from '@/actions/orders/createOrderAction'
import { X } from 'lucide-react'

/* ---------- Botón interno con estado pending ---------- */
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
        pending
          ? 'bg-green-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
      }`}
    >
      {pending ? 'Creando…' : 'Guardar borrador'}
    </button>
  )
}

/* ------------------- Modal --------------------------- */
export default function CreateOrderModal() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  /* estado del server-action */
  const [state, dispatch] = useActionState(createOrderAction, {
    success: '',
    errors: []
  })

  /* Side-effects de la acción */
  useEffect(() => {
    if (state.errors) {
      state.errors.forEach(e => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
      router.refresh()
      setOpen(false)
    }
  }, [state, router])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-6 px-6 py-2.5 bg-[#174940] text-white rounded-lg hover:bg-[#14533f] font-medium transition-colors shadow-sm"
      >
        + Nueva orden
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
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2"
              >
                {/* Encabezado */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-900">
                    Nuevo borrador de orden
                  </Dialog.Title>
                  <button
                    title='cerrar'
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* ------------- Formulario ------------- */}
                <form action={dispatch} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Título de la orden"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Descripción (opcional)"
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <SubmitButton />
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