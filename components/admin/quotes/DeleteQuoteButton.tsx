// components/admin/quotes/DeleteQuoteButton.tsx
'use client'

import { useActionState, useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { deleteQuoteAction } from '@/actions/admin/quotes/deleteQuoteAction'

function ConfirmDeleteBtn() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
        pending ? 'bg-red-400 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
      }`}
    >
      {pending ? 'Eliminando…' : 'Sí, eliminar'}
    </button>
  )
}

export default function DeleteQuoteButton({ quoteId }: { quoteId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [state, dispatch] = useActionState(deleteQuoteAction, { success: '', errors: [] })

  useEffect(() => {
    if (state.errors?.length) state.errors.forEach((e) => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      setOpen(false)
      // Si tu tabla se renderiza con datos del servidor, esto refresca la lista:
      router.refresh()
    }
  }, [state, router])

  return (
    <>
      {/* Botón ícono en la fila */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition"
        title="Eliminar cotización"
      >
        <Trash2 className="h-4 w-4" />
        <span className="text-xs font-medium">Eliminar</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-900">Confirmar eliminación</Dialog.Title>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                    aria-label="Cerrar"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-700">Estás a punto de eliminar esta cotización.</p>
                  <p className="text-sm text-gray-500">
                    Esta acción <span className="font-semibold">no se puede deshacer</span>. Se eliminarán permanentemente los datos asociados.
                  </p>
                </div>

                <form action={dispatch} className="space-y-5 mt-6">
                  <input type="hidden" name="quoteId" value={quoteId} />
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <ConfirmDeleteBtn />
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
