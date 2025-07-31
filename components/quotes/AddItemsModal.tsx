'use client'
import { useState, useEffect, startTransition, useActionState } from 'react'
import { Dialog } from '@headlessui/react'
import { toast } from 'react-toastify'
import { addItemsAction } from '@/actions/quotes/addItemsAction'
import ProductSelectionModal from './ProductSelectionModal'
import { useRouter } from 'next/navigation'

export default function AddItemsModal({
  quoteId,
  quoteType,          // ← 'productos' | 'servicios'
  availableItems,     // ← lista ya depurada según tipo
}: {
  quoteId: string
  quoteType: 'productos' | 'servicios'
  availableItems: any[]
}) {
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState<any[]>([])
  const router = useRouter()

  // Server Action
  const [state, dispatch, pending] = useActionState(addItemsAction, {
    errors: [],
    success: '',
  })

  useEffect(() => {
    state.errors.forEach(e => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      router.refresh()
      setSelected([])
      setOpen(false)
    }
  }, [state])

  /* ——— Enviar al back ——— */
  const handleSubmit = () => {
    const itemsToSend = selected.map(item => ({
      tipo: quoteType === 'productos' ? 'producto' : 'servicio',
      ...(quoteType === 'productos'
        ? { productId: Number(item.id) }
        : { serviceId: Number(item.id) }),
      cantidad: item.cantidad ?? 1,
      costoUnitario: parseFloat(
        item.precio ?? item.precioBase ?? '0'
      ),
    }))

    const fd = new FormData()
    fd.append('quoteId', quoteId)
    fd.append('items', JSON.stringify(itemsToSend))
    startTransition(() => dispatch(fd))
  }

  return (
    <>
      <button
        className="mt-6 mb-5 px-4 py-2 bg-[#174940] text-white rounded hover:bg-[#14533f] font-semibold"
        onClick={() => setOpen(true)}
      >
        Agregar ítems
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Seleccionar {quoteType === 'productos' ? 'productos' : 'servicios'}
            </Dialog.Title>

            <ProductSelectionModal
              items={availableItems}
              onSelect={setSelected}
            />

            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setOpen(false)} className="btn-secondary">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={pending || selected.length === 0}
                className="btn-primary"
              >
                {pending
                  ? 'Agregando…'
                  : `Agregar ${selected.length} ítem(s)`}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
