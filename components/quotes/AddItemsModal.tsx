'use client'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { toast } from 'react-toastify'
import { Item, Producto, Service } from '@/src/schemas'
import { addItemsAction } from '@/actions/quotes/addItemsAction'
import ProductSelectionModal from './ProductSelectionModal'
import { useRouter } from 'next/navigation'

export default function AddItemsModal({
  quoteId,
  items,
  token,
  products,
  services
}: {
  quoteId: string
  items: Item[],
  token: string | undefined
  products: Producto[]
  services: Service[]
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<any[]>([])
  const [state, dispatch, pending] = useActionState(addItemsAction, {
    errors: [],
    success: ''
  })
  const router = useRouter()

  useEffect(() => {
    state.errors.forEach(e => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      setSelected([])
      router.refresh()
      setOpen(false)
    }
  }, [state])

  const handleSubmit = async () => {
    const itemsToSend = selected.map(item => ({
      tipo: item.precioBase ? 'servicio' : 'producto',
      productId: Number(item.id),
      cantidad: item.cantidad || 1,
      costoUnitario: parseFloat(item.precio || item.precioBase || '0'),
    }))

    const formData = new FormData()
    formData.append('quoteId', quoteId)
    formData.append('items', JSON.stringify(itemsToSend))
    startTransition(() => {
      dispatch(formData)
    })
  }

  return (
    <>
      <button className="mt-6 mb-5 px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f] font-semibold" onClick={() => setOpen(true)}>
        Agregar ítems
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Seleccionar productos o servicios
            </Dialog.Title>

            <ProductSelectionModal onSelect={(items) => setSelected(items)} token={token} products={products} services={services} />

            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={pending || selected.length === 0}
                className="btn-primary"
              >
                {pending ? 'Agregando...' : `Agregar ${selected.length} ítem(s)`}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
