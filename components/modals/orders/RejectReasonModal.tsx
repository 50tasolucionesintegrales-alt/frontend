import { AlertTriangle, Box, XCircle } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import { useState, useEffect, useActionState } from 'react'

/* ──────────────────────────────── */
/*      Modal motivo de rechazo     */
/* ──────────────────────────────── */
export function RejectReasonModal({ reason }: { reason: string }) {
  const [open, setOpen] = useState(false)

  if (!reason) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="ml-2 inline-flex items-center text-xs font-medium text-red-600 hover:text-red-800 transition-colors group"
      >
        <AlertTriangle className="h-4 w-4 mr-1 text-red-500 group-hover:scale-110 transition-transform" />
        Ver motivo
      </button>

      <Transition.Root show={open}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setOpen(false)}
        >
          {/* Fondo con difuminado y animación */}
          <Transition.Child
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          {/* Contenedor del modal con animación */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-80"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                {/* Header con icono de advertencia */}
                <div className="bg-red-50 p-6 flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <Dialog.Title className="text-lg font-bold text-red-700">
                      Motivo de Rechazo
                    </Dialog.Title>
                    <p className="text-sm text-red-600 mt-1">
                      Detalles proporcionados por el administrador
                    </p>
                  </div>
                </div>

                {/* Contenido del motivo */}
                <div className="px-6 py-4">
                  <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {reason.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Footer con botón de acción */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 bg-[#174940] text-white rounded-lg hover:bg-[#0F332D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#174940] focus:ring-offset-2"
                  >
                    Entendido
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}