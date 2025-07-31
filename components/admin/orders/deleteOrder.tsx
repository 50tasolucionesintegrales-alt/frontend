'use client'

import { useActionState, useEffect } from 'react'
import { deleteOrderAction } from '@/actions/admin/orders/deleteOrderAction'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [state, dispatch] = useActionState(deleteOrderAction, {
    success: '', errors: []
  })

  useEffect(() => {
    if (state.errors) state.errors.forEach(e => toast.error(e))
    if (state.success) {
      toast.success(state.success)
      router.push('/admin/orders')
    }
  })

  return (
    <form action={dispatch}>
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        className="px-4 py-2 text-sm rounded border text-red-600 hover:bg-red-50"
      >
        Eliminar orden
      </button>
    </form>
  )
}
