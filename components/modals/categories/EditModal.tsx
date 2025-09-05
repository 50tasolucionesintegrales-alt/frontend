// components/admin/modals/categories/EditCategoryModal.tsx
'use client'

import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import UpdateCategoryAction from '@/actions/add/categories/UpdateCategoryAction'
import { toast } from 'react-toastify'
import { Categoria } from '@/src/schemas'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

/* Botón con estado pending */
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
      {pending ? 'Guardando…' : 'Guardar cambios'}
    </button>
  )
}

export default function EditCategoryModal({
  open, onClose, categoria, onEdited,
}: {
  open: boolean
  onClose: () => void
  categoria: Categoria
  onEdited: (c: Categoria) => void
}) {
  const [state, formAction, pending] = useActionState(UpdateCategoryAction, {
    errors: [], success: '', item: undefined
  })
  const router = useRouter()

  useEffect(() => {
    if (state.errors?.length) state.errors.forEach(e => toast.error(e))
  }, [state.errors])

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      router.refresh()
    }
    if (state.item) { 
      onEdited(state.item as Categoria); 
      onClose() 
    }
  }, [state.success, state.item, onClose, onEdited, router])

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-50">
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
                  Editar categoría
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form action={formAction} className="space-y-5">
                <input type="hidden" name="categoryId" value={categoria.id} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="nombre" 
                    defaultValue={categoria.nombre} 
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Nombre de la categoría"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea 
                    name="descripcion" 
                    defaultValue={categoria.descripcion ?? ''} 
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Descripción de la categoría"
                  />
                </div>

                {/* Botones */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                  <button 
                    type="button" 
                    onClick={onClose}
                    disabled={pending}
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
  )
}