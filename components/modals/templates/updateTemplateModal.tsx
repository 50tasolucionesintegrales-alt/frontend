'use client'

import { useState } from 'react'
import { Template } from '@/src/schemas'
import { updateTemplate } from '@/actions/admin/templates/actions'

type Props = { template: Template; onClose: () => void; onSuccess: () => void }

export default function UpdateTemplateModal({ template, onClose, onSuccess }: Props) {
  const [nombre, setNombre] = useState(template.nombre)
  const [descripcion, setDescripcion] = useState(template.descripcion ?? '')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    const formData = new FormData()
    formData.append('templateId', template.id.toString())
    formData.append('nombre', nombre)
    formData.append('descripcion', descripcion)
    if (archivo) formData.append('archivo', archivo)

    const res = await updateTemplate(undefined, formData)
    setLoading(false)

    if (res.errors && res.errors.length > 0) {
      setErrors(res.errors)
      return
    }

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(240,240,240,0.6)] z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-[#0F332D]">Actualizar Machote</h2>

        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md">
            {errors.map((e, i) => (
              <p key={i} className="text-sm">{e}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción"
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
              type="submit"
              disabled={loading}
              className={`bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 disabled:bg-gray-300`}
            >
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}