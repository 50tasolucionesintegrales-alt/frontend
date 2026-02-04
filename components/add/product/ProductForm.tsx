'use client'

import { startTransition, useActionState, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import AddProductAction from '@/actions/add/products/AddProductAction'
import { toast } from 'react-toastify'
import { Categoria } from '@/src/schemas'
import Image from 'next/image'

type Props = {
  categorias: Categoria[]
}

export default function ProductForm({ categorias }: Props) {
  const [state, dispatch, pending] = useActionState(AddProductAction, {
    errors: [],
    success: ''
  })

  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const MAX_MB = 10
  const ACCEPT = {
    'image/jpeg': [],
    'image/png': [],
    'image/webp': [],
    'image/heic': [],
    'image/heif': [],
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    multiple: false,
    onDropRejected: () => toast.error('Formato no permitido'),
    onDrop: (files) => {
      const selected = files[0]
      if (!selected) return

      if (selected.size > MAX_MB * 1024 * 1024) {
        toast.error(`La imagen supera ${MAX_MB} MB`)
        return
      }

      setFileName(selected.name)
      setFile(selected)
      setPreviewUrl(URL.createObjectURL(selected))
    }
  })

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (state.errors.length) state.errors.forEach(e => toast.error(e))
    if (state.success) toast.success(state.success)
  }, [state])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (file) formData.set('file', file)
    startTransition(() => dispatch(formData))
  }

  /** ===============================
   *  CATEGORÍA (HÍBRIDO REAL)
   *  =============================== */
  const [categoryName, setCategoryName] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const handleCategoryChange = (value: string) => {
    setCategoryName(value)

    const match = categorias.find(
      c => c.nombre.toLowerCase() === value.toLowerCase()
    )

    setCategoryId(match ? match.id : '')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* IZQUIERDA */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Nombre</label>
            <input
              name="nombre"
              required
              placeholder="Nombre del producto"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Precio</label>
            <input
              name="precio"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="1000.00"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* 🔥 SELECT HÍBRIDO */}
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Categoría
            </label>

            <input
              list="categorias-list"
              value={categoryName}
              onChange={(e) => handleCategoryChange(e.target.value)}
              placeholder="Selecciona o escribe una categoría"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <datalist id="categorias-list">
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nombre} />
              ))}
            </datalist>

            {/* 👈 ESTE es el que viaja al backend */}
            <input type="hidden" name="categoryId" value={categoryId} />
          </div>
        </div>

        {/* DERECHA */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Descripción</label>
            <textarea
              name="descripcion"
              placeholder='Descripción del producto (Máximo 128 carácteres)'
              maxLength={128}
              rows={4}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-sm font-bold text-gray-500">Máximo 128 carácteres</p>
          </div>


          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Link de compra</label>
            <input
              name="link_compra"
              type="url"
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg cursor-pointer">
            <input {...getInputProps()} />
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={160}
                height={160}
                unoptimized
              />
            ) : (
              <p>{isDragActive ? 'Suelta la imagen…' : 'Arrastra o selecciona imagen'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 bg-[#63B23D] text-white rounded-lg"
        >
          {pending ? 'Guardando…' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  )
}
