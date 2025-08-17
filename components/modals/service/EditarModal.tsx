// components/admin/modals/services/EditServiceModal.tsx
'use client'

import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Fragment, useActionState, useEffect } from 'react'
import UpdateServiceAction from '@/actions/add/services/UpdateServiceAction'
import { toast } from 'react-toastify'
import { Service } from '@/src/schemas'

export default function EditServiceModal({
  open, onClose, servicio, onEdited,
}: {
  open: boolean
  onClose: () => void
  servicio: Service
  onEdited: (s: Service) => void
}) {
  const [state, formAction, pending] = useActionState(UpdateServiceAction, {
    errors: [], success: '', item: undefined as any
  })

  useEffect(() => {
    if (state.errors?.length) state.errors.forEach((e: string) => toast.error(e))
  }, [state.errors])

  useEffect(() => {
    if (state.success) toast.success(state.success)
    if (state.item) { onEdited(state.item); onClose() }
  }, [state.success, state.item, onEdited, onClose])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            >
              <Dialog.Title className="text-lg font-medium mb-4">Editar servicio</Dialog.Title>

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="serviceId" value={servicio.id} />
                <div>
                  <label className="block text-sm font-medium">Nombre</label>
                  <input name="nombre" defaultValue={servicio.nombre} className="w-full mt-1 border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Descripción</label>
                  <textarea name="descripcion" defaultValue={servicio.descripcion ?? ''} className="w-full mt-1 border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Precio base</label>
                  <input name="precioBase" type="number" step="0.01" defaultValue={String(servicio.precioBase ?? '')} className="w-full mt-1 border rounded px-3 py-2 text-sm" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-sm">Cancelar</button>
                  <button type="submit" disabled={pending} className="px-4 py-2 bg-[#174940] text-white rounded text-sm disabled:opacity-50">
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
