'use client'

import { Fragment, useActionState, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { createOrderAction } from '@/actions/orders/createOrderAction'

/* ---------- Botón interno con estado pending ---------- */
function SubmitBtn () {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f] disabled:opacity-50"
    >
      {pending ? 'Creando…' : 'Guardar borrador'}
    </button>
  )
}

/* ------------------- Modal --------------------------- */
export default function CreateOrderModal () {
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
      setOpen(false)
    }
  }, [state])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-6 px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f]"
      >
        + Nueva orden
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              {/* Motion = animación extra */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4"
              >
                <Dialog.Title className="text-lg font-semibold">
                  Nuevo borrador de orden
                </Dialog.Title>

                {/* ------------- Formulario ------------- */}
                <form action={dispatch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      required
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      rows={3}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded border"
                    >
                      Cancelar
                    </button>
                    <SubmitBtn />
                  </div>
                </form>
              </motion.div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
