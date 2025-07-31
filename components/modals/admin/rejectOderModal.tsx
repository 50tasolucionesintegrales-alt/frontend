'use client'

import { Dialog } from '@headlessui/react'
import { Fragment, useEffect, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'react-toastify'
import { approveItemAction } from '@/actions/admin/orders/approveItemAction'
import { useRouter } from 'next/navigation'

/* Botón con estado pending */
function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-2 py-1 text-xs rounded bg-[#174940] text-white disabled:opacity-50"
    >
      {pending ? '...' : label}
    </button>
  )
}

export function RechazarModal({
  itemId,
  disabled
}: {
  itemId: string
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  /* server-action */
  const [state, dispatch] = useActionState(approveItemAction, {
    success: '',
    errors: [] as string[],
    item: null
  })

  /* feedback */
  useEffect(() => {
    if(state.errors) {
      state.errors.forEach(e => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
      router.refresh()
    }
  }, [state])

  if (disabled) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2 py-1 text-xs rounded border"
      >
        Rechazar
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        {/* Panel centrado */}
        <Dialog.Panel className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4">
            <Dialog.Title className="font-semibold">
              Motivo de rechazo
            </Dialog.Title>

            <form
              action={dispatch}
              onSubmit={() => setOpen(false)}
              className="space-y-3"
            >
              <input type="hidden" name="itemId" value={itemId} />
              <input type="hidden" name="status" value="rejected" />

              <textarea
                name="reason"
                required
                className="w-full border rounded p-2 text-sm"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 text-sm rounded border"
                >
                  Cancelar
                </button>
                <SubmitBtn label="Rechazar" />
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  )
}
