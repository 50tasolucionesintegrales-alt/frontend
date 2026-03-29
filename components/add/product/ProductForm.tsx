'use client'

import { startTransition, useActionState, useEffect, useState, useRef } from 'react'
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
  const [categoryName, setCategoryName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  const formRef = useRef<HTMLFormElement>(null)

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
    if (state.success) {
      setFileName('')
      setFile(null)
      setCategoryName('')
      setCategoryId('')
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl('')
      }

      if (formRef.current) {
        formRef.current.reset()
      }

      toast.success(state.success)
    }
    
    if (state.errors.length) {
      state.errors.forEach(e => toast.error(e))
    }
  }, [state, previewUrl])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (file) formData.set('file', file)
    startTransition(() => dispatch(formData))
  }

  const handleCategoryChange = (value: string) => {
    setCategoryName(value)

    const match = categorias.find(
      c => c.nombre.toLowerCase() === value.toLowerCase()
    )

    setCategoryId(match ? match.id : '')
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              name="nombre"
              required
              placeholder="Nombre del producto"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              name="precio"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="$1000.00"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
          </div>

          {/* SELECT HÍBRIDO DE CATEGORÍA */}
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <input
              list="categorias-list"
              value={categoryName}
              onChange={(e) => handleCategoryChange(e.target.value)}
              placeholder="Selecciona o escribe una categoría"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
              required
            />
            <datalist id="categorias-list">
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nombre} />
              ))}
            </datalist>
            <input type="hidden" name="categoryId" value={categoryId} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Tienda física
            </label>
            <input
              name="tienda_fisica"
              placeholder="Ej: Walmart, Trupper, Office Depot"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Dirección
            </label>
            <textarea
              name="direccion"
              placeholder="Dirección de la tienda física"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              placeholder="Descripción del producto (Máximo 128 caracteres)"
              maxLength={128}
              rows={4}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              {`Máximo 128 caracteres`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Link de compra (principal)
            </label>
            <input
              name="link_compra"
              type="url"
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Link de compra 2
            </label>
            <input
              name="link_compra2"
              type="url"
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Link de compra 3
            </label>
            <input
              name="link_compra3"
              type="url"
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition"
            />
          </div>

          {/* ÁREA DE IMAGEN */}
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">
              Imagen del producto
            </label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                isDragActive ? 'border-[#63B23D] bg-[#63B23D]/5' : 'border-gray-300 hover:border-[#63B23D]'
              }`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={160}
                    height={160}
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                  <p className="text-sm text-gray-500">Haz clic o arrastra para cambiar la imagen</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500">
                    {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra o selecciona una imagen'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Formatos: JPG, PNG, WEBP, HEIC/HEIF (Máx. {MAX_MB} MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="reset"
          onClick={() => {
            if (formRef.current) formRef.current.reset()
            setCategoryName('')
            setCategoryId('')
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl)
              setPreviewUrl('')
            }
            setFile(null)
            setFileName('')
          }}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 bg-[#63B23D] text-white rounded-lg hover:bg-[#4F8E30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'Guardando…' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  )
}