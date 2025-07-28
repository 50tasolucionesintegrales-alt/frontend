'use client'

import { useActionState, useEffect, useState } from 'react'
import AddServiceAction from '@/actions/add/AddServiceAction'
import { toast } from 'react-toastify'

export default function ServiceForm() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState('')
  const [state, dispatch, isPending] = useActionState(AddServiceAction, {
    errors: [],
    success: '',
  })

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((e: string) => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
      setNombre('')
      setDescripcion('')
      setPrecioBase('')
    }
  }, [state])

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          name="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Precio base</label>
        <input
          name="precioBase"
          type="number"
          value={precioBase}
          onChange={(e) => setPrecioBase(e.target.value)}
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar Servicio'}
        </button>
      </div>
    </form>
  )
}
