'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

type Props = {
  onClose: () => void
  onSuccess: () => void
}

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
        console.error("❌ Error backend:", text)
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
      if (err instanceof Error) {
        setErrors([err.message])
      } else {
        setErrors(['Error de red desconocido'])
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <h2>Agregar Template</h2>

        {errors.map((e, i) => (
          <p key={i} className="text-red-500">
            {e}
          </p>
        ))}

        <input
          title="Nombre"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />

        <textarea
          title="Descripción"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />

        <input
          title="Archivo PDF"
          type="file"
          accept="application/pdf"
          onChange={e => setArchivo(e.target.files?.[0] ?? null)}
        />

        <div className="flex justify-end gap-2 mt-2">
          <Button onClick={handleSubmit} disabled={loading}>
            Guardar
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}