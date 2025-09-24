'use client'

import { useState } from 'react'

type Props = { onClose: () => void; onSuccess: () => void }

export default function AddTemplateModal({ onClose, onSuccess }: Props) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!archivo) return setErrors(['Debe subir un archivo PDF'])
    setLoading(true)
    setErrors([])

    const formData = new FormData()
    formData.append('nombre', nombre)
    formData.append('descripcion', descripcion)
    formData.append('archivo', archivo)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) {
        const text = await res.text()
        try {
          const json = JSON.parse(text)
          setErrors(json.errors || [json.message || 'Error al crear template'])
        } catch {
          setErrors([text || 'Error desconocido'])
        }
      } else {
        onSuccess()
        onClose()
      }
    } catch (err: unknown) {
      if (err instanceof Error) setErrors([err.message])
      else setErrors(['Error de red desconocido'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(240,240,240,0.6)] z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-[#0F332D]">Agregar Machote</h2>
        <p className="text-gray-500 text-sm">Sube un PDF que servirá como plantilla para tus cotizaciones.</p>

        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md">
            {errors.map((e, i) => (
              <p key={i} className="text-sm">{e}</p>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="border border-gray-300 rounded-md p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          title='file'
          type="file"
          accept="application/pdf"
          onChange={e => setArchivo(e.target.files?.[0] ?? null)}
          className="border border-gray-300 rounded-md p-2 cursor-pointer"
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 disabled:bg-gray-300`}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={onClose}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}