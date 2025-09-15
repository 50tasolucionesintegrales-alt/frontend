'use client'

import { useState } from 'react'
import { Template } from '@/src/schemas'
import { updateTemplate } from '@/actions/admin/templates/actions'
import { Button } from '@/components/ui/Button'

type Props = {
  template: Template
  onClose: () => void
  onSuccess: () => void
}

export default function UpdateTemplateModal({ template, onClose, onSuccess }: Props) {
  const [nombre, setNombre] = useState(template.nombre)
  const [descripcion, setDescripcion] = useState(template.descripcion ?? '')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('templateId', template.id.toString())
    formData.append('nombre', nombre)
    formData.append('descripcion', descripcion)
    if (archivo) formData.append('archivo', archivo)

    const res = await updateTemplate(undefined, formData)
    setLoading(false)

    if (res.errors && res.errors.length > 0) {
      alert(res.errors.join('\n'))
      return
    }

    onSuccess()
    onClose()
  }

  return (
    <div className="modal fixed inset-0 flex flex-col bg-white p-4">
      <h2>Actualizar Template</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre"
          required
          className="border p-1"
        />
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="border p-1"
        />
        <input title='file' type="file" onChange={e => setArchivo(e.target.files?.[0] ?? null)} accept="application/pdf" />
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Actualizar'}</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}