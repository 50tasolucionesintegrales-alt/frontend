'use client'

import { Dialog } from '@headlessui/react'
import { useEffect, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { approveItemAction } from '@/actions/admin/orders/approveItemAction'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

/* Botón con estado pending */
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        pending
          ? 'bg-red-400 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
      }`}
    >
      {pending ? 'Procesando…' : label}
    </button>
  )
}

export function RechazarModal({
  itemId,
  disabled
}: {
  itemId: string
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  /* server-action */
  const [state, dispatch] = useActionState(approveItemAction, {
    success: '',
    errors: [] as string[],
    item: null
  })

  /* feedback */
  useEffect(() => {
    if(state.errors) {
      state.errors.forEach(e => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
      router.refresh()
      setOpen(false)
    }
  }, [state, router])

  if (disabled) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 text-sm rounded-lg font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
      >
        Rechazar
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
                    Motivo de rechazo
                  </Dialog.Title>
                  <button
                    title='cerrar'
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  action={dispatch}
                  className="space-y-5"
                >
                  <input type="hidden" name="itemId" value={itemId} />
                  <input type="hidden" name="status" value="rejected" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reason"
                      required
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      placeholder="Describe el motivo del rechazo"
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
                    <SubmitButton label="Rechazar" />
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