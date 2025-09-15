'use client'

import { useState, useEffect } from 'react'
import { getTemplates, deleteTemplate } from '@/actions/admin/templates/actions'
import AddTemplateModal from '@/components/modals/templates/addTemplateModal'
import UpdateTemplateModal from '@/components/modals/templates/updateTemplateModal'
import ViewTemplateModal from '@/components/modals/templates/viewTemplateModal'
import TemplateCard from '@/components/admin/templates/templateCard'
import { FileText } from 'lucide-react'

type Template = { id: number; nombre: string; descripcion: string | null }

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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTemplates() }, [])

  const handleDelete = async (template: Template) => {
    if (!confirm(`¿Eliminar template "${template.nombre}"?`)) return
    try {
      const res = await deleteTemplate(template.id)
      if (res.ok) fetchTemplates()
      else console.error('Error al eliminar template:', res.error)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <FileText size={28} className="text-[#63B23D]" />
            <div>
              <h1 className="text-3xl font-bold text-[#174940]">Gestionar Machotes</h1>
              <p className="text-gray-600 text-sm md:block mt-1">
                Administra tus plantillas PDF de cotización
              </p>
            </div>
          </div>

          {/* Botón agregar */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#63B23D] hover:bg-[#4D912C] text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Machote
          </button>
        </header>

        {/* Grid de Templates */}
        {loading ? (
          <p className="text-gray-500">Cargando machotes...</p>
        ) : templates.length === 0 ? (
          <p className="text-gray-500">No hay machotes disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {templates.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                onEdit={(tpl: Template) => { setSelectedTemplate(tpl); setShowUpdateModal(true) }}
                onDelete={handleDelete}
                onView={(tpl: Template) => setViewTemplateId(tpl.id)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && <AddTemplateModal onClose={() => setShowAddModal(false)} onSuccess={fetchTemplates} />}
        {showUpdateModal && selectedTemplate &&
          <UpdateTemplateModal template={selectedTemplate} onClose={() => setShowUpdateModal(false)} onSuccess={fetchTemplates} />}
        {viewTemplateId !== null &&
          <ViewTemplateModal templateId={viewTemplateId} onClose={() => setViewTemplateId(null)} />}
      </div>
    </div>
  )
}