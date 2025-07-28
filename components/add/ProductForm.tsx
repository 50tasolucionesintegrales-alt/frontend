'use client'

import { useActionState, useEffect, useState } from 'react'
import AddProductAction from '@/actions/add/AddProductAction'
import { toast } from 'react-toastify'
import { Categoria } from '@/src/schemas'

type Props = {
    categorias: Categoria[]
}

export default function ProductForm({categorias}: Props) {
  const [state, dispatch, pending] = useActionState(AddProductAction, {
    errors: [],
    success: ''
  })

  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((e: string) => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
    }
  }, [state])

  return (
    <form action={dispatch} className="space-y-4" encType="multipart/form-data">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          name="nombre"
          type="text"
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          name="descripcion"
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Precio</label>
        <input
          name="precio"
          type="number"
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Categoría</label>
        <select
          name="categoryId"
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
          defaultValue=""
        >
          <option value="" disabled>Selecciona una categoría</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Link de compra</label>
        <input
          name="link_compra"
          type="url"
          className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Imagen</label>
        <input
          name="file"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            setFileName(file ? file.name : '')
          }}
          className="mt-1 block w-full text-sm text-gray-500"
        />
        {fileName && <p className="text-xs text-gray-400 mt-1">Archivo: {fileName}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  )
}
