'use client'

import { startTransition, useActionState, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import AddProductAction from '@/actions/add/products/AddProductAction'
import { toast } from 'react-toastify'
import { Categoria } from '@/src/schemas'

type Props = {
  categorias: Categoria[]
}

export default function ProductForm({ categorias }: Props) {
  const [state, dispatch, pending] = useActionState(AddProductAction, {
    errors: [],
    success: ''
  })

  const [fileName, setFileName] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (files) => {
      const selected = files[0]
      setFileName(selected.name)
      setFile(selected)
      const url = URL.createObjectURL(selected)
      setPreviewUrl(url)
    }
  })

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((e: string) => toast.error(e))
    }
    if (state.success) {
      toast.success(state.success)
    }
  }, [state])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    if (file) formData.set('file', file)
    startTransition(() => dispatch(formData))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Nombre</label>
            <input
              name="nombre"
              type="text"
              className="w-full px-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Precio</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                name="precio"
                type="number"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Categoría</label>
            <select
              name="categoryId"
              className="w-full px-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all appearance-none bg-white"
              defaultValue=""
              required
            >
              <option value="" disabled className="text-gray-400">Selecciona una categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id} className="text-[#0F332D]">{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Descripción</label>
            <textarea
              name="descripcion"
              rows={4}
              className="w-full px-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#174940] mb-1">Link de compra</label>
            <input
              name="link_compra"
              type="url"
              className="w-full px-4 py-2 border border-[#999999] rounded-lg focus:ring-2 focus:ring-[#63B23D] focus:border-[#63B23D] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#174940] mb-1">Imagen</label>
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center w-full py-6 px-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'bg-[#e6f4ef] border-[#63B23D]' : 'border-[#999999] hover:bg-[#f0f7f5]'}`}
            >
              <input {...getInputProps()} />
              {!previewUrl && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#63B23D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-[#174940]">{isDragActive ? 'Suelta la imagen aquí…' : (fileName || 'Arrastra o haz clic para seleccionar')}</p>
                </>
              )}
              {previewUrl && (
                <img src={previewUrl} alt="Vista previa" className="mt-2 max-h-40 object-contain" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 bg-[#63B23D] text-white rounded-lg text-sm font-medium hover:bg-[#529e33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {pending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Guardar Producto
            </>
          )}
        </button>
      </div>
    </form>
  )
}
