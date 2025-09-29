'use client'

import { Dialog, Tab } from '@headlessui/react'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { addOrderItemsAction } from '@/actions/orders/addOrderItemsAction'
import { createOrderAndAddItemAction } from '@/actions/orders/createOrderAndAddAction'
import { Order } from '@/src/schemas'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function AddToOrderModal({
  open,
  onOpenChange,
  productId,
  productPrice,
  orders,
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  productId: string
  productPrice: string | number
  orders: Order[]
}) {
  const router = useRouter()

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

  const productInOrder = (o: { items?: { product?: { id?: string } }[] }) => 
    (o.items || []).some((it) => String(it.product?.id) === String(productId))

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

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {_open && (
        <Dialog open={_open} onClose={handleClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2"
            >
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Agregar a una orden
                </Dialog.Title>
                <button onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <Tab.Group selectedIndex={tab === 'existente' ? 0 : 1} onChange={(i)=>setTab(i===0?'existente':'nueva')}>
                <Tab.List className="flex gap-2 mb-6">
                  <Tab className={({selected})=>`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected?'bg-[#174940] text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Usar existente
                  </Tab>
                  <Tab className={({selected})=>`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected?'bg-[#174940] text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Crear nueva
                  </Tab>
                </Tab.List>

                <Tab.Panels>
                  {/* EXISTENTE */}
                  <Tab.Panel className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                      <select 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        title='orden'
                        value={selectedOrderId}
                        onChange={e=>setSelectedOrderId(e.target.value)}
                      >
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <input 
                          title='cantidad' 
                          type="number" 
                          min={1} 
                          value={qty} 
                          onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Costo unitario</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={unitPrice} 
                          readOnly 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                      <button 
                        onClick={handleClose} 
                        className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleAddToExisting} 
                        disabled={!selectedOrderId || addPending}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                          !selectedOrderId || addPending 
                            ? 'bg-[#63B23D]/70 cursor-not-allowed text-white' 
                            : 'bg-[#174940] hover:bg-[#0F332D] text-white shadow-sm'
                        }`}
                      >
                        {addPending ? 'Agregando…' : 'Agregar a orden'}
                      </button>
                    </div>
                  </Tab.Panel>

                  {/* NUEVA */}
                  <Tab.Panel className="space-y-5">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
                          value={title} 
                          onChange={e=>setTitle(e.target.value)} 
                          placeholder="Orden rápida" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                        <textarea 
                          title='descripcion' 
                          rows={3} 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
                          value={desc} 
                          onChange={e=>setDesc(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <input 
                          title='cantidad' 
                          type="number" 
                          min={1} 
                          value={qty} 
                          onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Costo unitario</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={unitPrice} 
                          readOnly 
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t mt-6">
                      <button 
                        onClick={handleClose} 
                        className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleCreateAndAdd} 
                        disabled={newPending}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                          newPending 
                            ? 'bg-green-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                        }`}
                      >
                        {newPending ? 'Creando…' : 'Crear y agregar'}
                      </button>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}