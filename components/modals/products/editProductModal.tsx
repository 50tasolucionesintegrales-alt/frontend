// components/admin/products/EditProductModal.tsx
'use client'

import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import UpdateProductAction from '@/actions/add/products/UpdateProductAction'
import { toast } from 'react-toastify'
import { Producto } from '@/src/schemas'
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

export default function EditProductModal({
  open, onClose, producto, categorias, onEdited
}: {
  open: boolean
  onClose: () => void
  producto: Producto
  categorias: { id: string; nombre: string }[]
  onEdited: (p: Producto) => void
}) {
  const [state, formAction, pending] = useActionState(UpdateProductAction, {
    errors: [],
    success: '',
    item: undefined
  })
  const router = useRouter()

  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      state.errors.forEach((error: string) => toast.error(error))
    }
  }, [state.errors])

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
      router.refresh()
    }
    if (state.item) {
      onEdited(state.item)
      onClose()
    }
  }, [state.success, state.item, onEdited, onClose, router])

  const defaultCategoryId = producto.category?.id ?? ''

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
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl mx-2 max-h-[90vh] overflow-y-auto"
            >
              {/* Encabezado */}
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Editar producto
                </Dialog.Title>
                <button
                  title='cerrar'
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form action={formAction} className="space-y-5">
                <input type="hidden" name="productId" value={producto.id} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nombre"
                    defaultValue={producto.nombre}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Nombre del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    defaultValue={producto.descripcion ?? ''}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Descripción del producto"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="precio"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={String(producto.precio ?? '')}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      title='categoria'
                      name="categoryId"
                      defaultValue={defaultCategoryId}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link de compra
                  </label>
                  <input
                    name="link_compra"
                    type="url"
                    defaultValue={producto.link_compra ?? ''}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen (opcional)
                  </label>
                  <input 
                    title='imagen'
                    name="file" 
                    type="file" 
                    accept="image/*" 
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
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