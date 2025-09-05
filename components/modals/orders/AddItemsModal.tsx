'use client'

import { Fragment, useState, useEffect, startTransition, useActionState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'
import { addOrderItemsAction } from '@/actions/orders/addOrderItemsAction'
import { Order, Producto } from '@/src/schemas'
import { Loader2, Plus } from 'lucide-react'

export default function AddItemsModal({
  orderId,
  products,
  onSuccess
}: {
  orderId: string
  products: Producto[]
  onSuccess: (updatedOrder: Order) => void
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Producto[]>([])

  const [state, dispatch, pending] = useActionState(addOrderItemsAction, {
    success: '',
    errors: [],
    order: undefined
  })

  useEffect(() => {
    state.errors.forEach(e => toast.error(e));
    if (state.success) {
      toast.success(state.success);
      if (state.order) {
        onSuccess(state.order);
      }
      setSelected([]);
      setOpen(false);
    }
  }, [state, onSuccess]);


  const toggle = (p: Producto) =>
    setSelected(prev =>
      prev.some(s => s.id === p.id)
        ? prev.filter(s => s.id !== p.id)
        : [...prev, p]
    )

  const handleSubmit = () => {
    if (!selected.length) return toast.error('Selecciona al menos un producto')

    const itemsToSend = selected.map(p => ({
      productId: Number(p.id),
      cantidad: 1,
      costoUnitario: parseFloat(p.precio) || 0
    }))

    const fd = new FormData()
    fd.append('orderId', orderId)
    fd.append('items', JSON.stringify(itemsToSend))

    startTransition(() => dispatch(fd))
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 px-4 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] transition-colors flex items-center"
      >
        <Plus className="h-4 w-4 mr-1" />
        Agregar productos
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => !pending && setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl transform transition-all">
                <Dialog.Title className="text-xl font-bold text-[#0F332D] mb-4">
                  Seleccionar productos
                </Dialog.Title>

                <div className="max-h-[60vh] overflow-auto border border-[#e5e7eb] rounded-lg">
                  <table className="min-w-full divide-y divide-[#e5e7eb]">
                    <thead className="bg-[#174940] sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          Producto
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">
                          Precio
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb]">
                      {products.map(p => {
                        const checked = selected.some(s => s.id === p.id)
                        return (
                          <tr
                            key={p.id}
                            onClick={() => toggle(p)}
                            className={`cursor-pointer transition-colors ${
                              checked ? 'bg-[#f0f7f5]' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  readOnly
                                  checked={checked}
                                  className="h-4 w-4 text-[#63B23D] border-[#e5e7eb] rounded focus:ring-[#63B23D]"
                                />
                                <span className="ml-3 text-[#0F332D]">
                                  {p.nombre}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#174940] font-medium">
                              ${parseFloat(p.precio).toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-[#174940]">
                    {selected.length} {selected.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setOpen(false)}
                      disabled={pending}
                      className="px-4 py-2 rounded-lg border border-[#e5e7eb] text-[#0F332D] hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={pending || selected.length === 0}
                      className="px-4 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#529e33] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {pending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Agregando...
                        </>
                      ) : (
                        `Agregar ${selected.length} producto${selected.length !== 1 ? 's' : ''}`
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}