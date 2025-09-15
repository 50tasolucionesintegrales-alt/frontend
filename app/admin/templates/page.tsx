'use client'

import { useState, useEffect } from 'react'
import { getTemplates, deleteTemplate } from '@/actions/admin/templates/actions'
import AddTemplateModal from '@/components/modals/templates/addTemplateModal'
import UpdateTemplateModal from '@/components/modals/templates/updateTemplateModal'
import ViewTemplateModal from '@/components/modals/templates/viewTemplateModal'
import { Button } from '@/components/ui/Button'

type Template = { id: number, nombre: string, descripcion: string | null }

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [viewTemplateId, setViewTemplateId] = useState<number | null>(null)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const data: Template[] = await getTemplates()
      setTemplates(
        data.map(t => ({
          id: t.id,
          nombre: t.nombre,
          descripcion: t.descripcion ?? null
        }))
      )
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('fetchTemplates error:', err.message)
      } else {
        console.error('fetchTemplates error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTemplates() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar template?')) return

    try {
      const res = await deleteTemplate(id)
      if (res.ok) {
        alert('Template eliminado correctamente')
        fetchTemplates()
      } else {
        alert('Error al eliminar template: ' + (res.error ?? 'Desconocido'))
      }
    } catch (err: unknown) {
      if (err instanceof Error) alert('Error al eliminar template: ' + err.message)
      else alert('Error al eliminar template')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Templates</h1>
      <Button onClick={() => setShowAddModal(true)}>Agregar Template</Button>

      {loading ? <p>Cargando templates...</p> : (
        templates.length === 0 ? <p>No hay templates</p> :
        <div className="grid grid-cols-3 gap-4 mt-4">
          {templates.map(t => (
            <div key={t.id} className="border p-2 rounded">
              <div className="font-semibold">{t.nombre}</div>
              <div className="text-sm">{t.descripcion}</div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => { setSelectedTemplate(t); setShowUpdateModal(true) }}>Editar</Button>
                <Button onClick={() => handleDelete(t.id)} variant="outline">Eliminar</Button>
                <Button onClick={() => setViewTemplateId(t.id)}>Ver PDF</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && <AddTemplateModal onClose={() => setShowAddModal(false)} onSuccess={fetchTemplates} />}
      {showUpdateModal && selectedTemplate && <UpdateTemplateModal template={selectedTemplate} onClose={() => setShowUpdateModal(false)} onSuccess={fetchTemplates} />}
      {viewTemplateId !== null && <ViewTemplateModal templateId={viewTemplateId} onClose={() => setViewTemplateId(null)} />}
    </div>
  )
}