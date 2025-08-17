// components/admin/products/EditProductModal.tsx
'use client'

import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Fragment, useActionState, useEffect } from 'react'
import UpdateProductAction from '@/actions/add/products/UpdateProductAction'
import { toast } from 'react-toastify'
import { Producto } from '@/src/schemas'

export default function EditProductModal({
  open, onClose, producto, categorias, onEdited
}: {
  open: boolean
  onClose: () => void
  producto: Producto
  categorias: { id: string; nombre: string }[]
  onEdited: (p: any) => void
}) {
  const [state, formAction, pending] = useActionState(UpdateProductAction, {
    errors: [],
    success: '',
    item: undefined as any
  })

  // Muestra errores una sola vez por cambio de estado
  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      state.errors.forEach((error: string) => toast.error(error))
    }
  }, [state.errors])

  // Muestra success y, si hay item actualizado, notifica al padre y cierra
  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
    }
    if (state.item) {
      onEdited(state.item)  // <- reemplaza el ítem en la tabla
      onClose()
    }
  }, [state.success, state.item, onEdited, onClose])

  const defaultCategoryId =
    // tolera objetos que vienen con category o con categoryId plano
    (producto as any).categoryId ?? producto.category?.id ?? ''

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl"
            >
              <Dialog.Title className="text-lg font-medium mb-4">Editar producto</Dialog.Title>

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="productId" value={producto.id} />

                <div>
                  <label className="block text-sm font-medium">Nombre</label>
                  <input
                    name="nombre"
                    defaultValue={producto.nombre}
                    className="w-full mt-1 border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Descripción</label>
                  <textarea
                    name="descripcion"
                    defaultValue={producto.descripcion ?? ''}
                    className="w-full mt-1 border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Precio</label>
                    <input
                      name="precio"
                      type="number"
                      step="0.01"
                      defaultValue={String(producto.precio ?? '')}
                      className="w-full mt-1 border rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Categoría</label>
                    <select
                      name="categoryId"
                      defaultValue={defaultCategoryId}
                      className="w-full mt-1 border rounded px-3 py-2 text-sm"
                    >
                      {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Link de compra</label>
                  <input
                    name="link_compra"
                    type="url"
                    defaultValue={producto.link_compra ?? ''}
                    className="w-full mt-1 border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Imagen (opcional)</label>
                  <input name="file" type="file" accept="image/*" className="mt-1 block w-full text-sm" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-sm">
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="px-4 py-2 bg-[#174940] text-white rounded text-sm disabled:opacity-50"
                  >
                    {pending ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
