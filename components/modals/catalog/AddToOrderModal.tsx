// /components/orders/AddToOrderModal.tsx
'use client'

import { Dialog, Tab } from '@headlessui/react'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { addOrderItemsAction } from '@/actions/orders/addOrderItemsAction'
import { createOrderAndAddItemAction } from '@/actions/orders/createOrderAndAddAction'

export default function AddToOrderModal({
  /** ← CONTROLADO DESDE EL PADRE */
  open,
  onOpenChange,
  /** datos */
  productId,
  productPrice,
  orders,
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  productId: string
  productPrice: string | number
  orders: any[]
}) {
  const router = useRouter()

  // soporte controlado / no controlado
  const [uOpen, setUOpen] = useState(false)
  const isControlled = typeof open === 'boolean' && typeof onOpenChange === 'function'
  const _open = isControlled ? (open as boolean) : uOpen
  const setOpen = isControlled ? (onOpenChange as (v: boolean) => void) : setUOpen

  const [tab, setTab] = useState<'existente'|'nueva'>('existente')
  const [qty, setQty] = useState(1)
  const unitPrice = Number(productPrice) || 0
  const [selectedOrderId, setSelectedOrderId] = useState('')

  const [title, setTitle] = useState('')
  const [desc,  setDesc]  = useState('')

  const [addState, addDispatch, addPending] = useActionState(addOrderItemsAction, { success: '', errors: [], order: undefined })
  const [newState, newDispatch, newPending] = useActionState(createOrderAndAddItemAction, { success: '', errors: [], order: undefined })

  const productInOrder = (o: any) => (o.items || []).some((it: any) => String(it.product?.id) === String(productId))

  const handleAddToExisting = () => {
    if (!selectedOrderId) return toast.error('Selecciona una orden')
    const fd = new FormData()
    fd.append('orderId', selectedOrderId)
    fd.append('items', JSON.stringify([{ productId, cantidad: Math.max(1, qty), costoUnitario: unitPrice }]))
    startTransition(() => addDispatch(fd))
  }

  const handleCreateAndAdd = () => {
    const fd = new FormData()
    fd.append('title', (title || 'Orden rápida').trim().slice(0,80))
    fd.append('description', (desc || '').trim().slice(0,120))
    fd.append('productId', productId)
    fd.append('cantidad', String(Math.max(1, qty)))
    fd.append('costoUnitario', String(unitPrice))
    startTransition(() => newDispatch(fd))
  }

  useEffect(() => {
    addState.errors.forEach(e => toast.error(e))
    if (addState.success) {
      toast.success(addState.success)
      setOpen(false)
      router.refresh()
    }
  }, [addState, router, setOpen])

  useEffect(() => {
    newState.errors.forEach(e => toast.error(e))
    if (newState.success) {
      toast.success(newState.success)
      setOpen(false)
      router.refresh()
    }
  }, [newState, router, setOpen])

  return (
    <Dialog open={_open} onClose={setOpen} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Agregar a una orden
          </Dialog.Title>

          <Tab.Group selectedIndex={tab === 'existente' ? 0 : 1} onChange={(i)=>setTab(i===0?'existente':'nueva')}>
            <Tab.List className="flex gap-2 mb-4">
              <Tab className={({selected})=>`px-3 py-1.5 rounded-lg text-sm ${selected?'bg-[#174940] text-white':'bg-gray-100 text-[#174940]'}`}>Usar existente</Tab>
              <Tab className={({selected})=>`px-3 py-1.5 rounded-lg text-sm ${selected?'bg-[#174940] text-white':'bg-gray-100 text-[#174940]'}`}>Crear nueva</Tab>
            </Tab.List>

            <Tab.Panels>
              {/* EXISTENTE */}
              <Tab.Panel className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-[#0F332D]">Orden</label>
                  <select className="w-full border rounded-lg px-3 py-2"
                    value={selectedOrderId}
                    onChange={e=>setSelectedOrderId(e.target.value)}>
                    <option value="">Selecciona una orden…</option>
                    {orders.map(o=>{
                      const already = productInOrder(o)
                      return (
                        <option key={o.id} value={o.id} disabled={already}>
                          {o.titulo}{already?' (ya contiene este producto)':''}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1 text-[#0F332D]">Cantidad</label>
                    <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))}
                      className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1 text-[#0F332D]">Costo unitario</label>
                    <input type="number" step="0.01" value={unitPrice} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded-lg border">Cancelar</button>
                  <button onClick={handleAddToExisting} disabled={!selectedOrderId || addPending}
                    className="px-4 py-2 rounded-lg bg-[#174940] text-white disabled:opacity-50">
                    {addPending ? 'Agregando…' : 'Agregar a orden'}
                  </button>
                </div>
              </Tab.Panel>

              {/* NUEVA */}
              <Tab.Panel className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-[#0F332D]">Título</label>
                    <input className="w-full border rounded-lg px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Orden rápida" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-[#0F332D]">Descripción (opcional)</label>
                    <textarea rows={3} className="w-full border rounded-lg px-3 py-2" value={desc} onChange={e=>setDesc(e.target.value)} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1 text-[#0F332D]">Cantidad</label>
                    <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))}
                      className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1 text-[#0F332D]">Costo unitario</label>
                    <input type="number" step="0.01" value={unitPrice} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded-lg border">Cancelar</button>
                  <button onClick={handleCreateAndAdd} disabled={newPending}
                    className="px-4 py-2 rounded-lg bg-[#174940] text-white disabled:opacity-50">
                    {newPending ? 'Creando…' : 'Crear y agregar'}
                  </button>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Dialog>
  )
}
