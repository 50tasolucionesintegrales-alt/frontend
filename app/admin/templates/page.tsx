'use client'

import { useState, useEffect } from 'react'
import { getTemplates, Template } from '@/actions/admin/templates/actions'
import TemplateCard from '@/components/admin/templates/templateCard'
import ViewTemplateModal from '@/components/modals/templates/viewTemplateModal'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await getTemplates()
      if (res.ok && res.items) {
        setTemplates(res.items)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTemplates() }, [])

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#174940]">Plantillas PNG</h1>
          <p className="text-gray-600 text-sm md:block mt-1">
            Visualiza y selecciona una plantilla de cotización
          </p>
        </header>

        {/* Grid */}
        {loading ? (
          <p className="text-gray-500">Cargando plantillas...</p>
        ) : templates.length === 0 ? (
          <p className="text-gray-500">No hay plantillas disponibles</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {templates.map(t => (
              <TemplateCard
                key={t.name}
                template={t}
                onView={setSelectedTemplate}
              />
            ))}
          </div>
        )}

        {/* Modal para ver en grande */}
        {selectedTemplate && (
          <ViewTemplateModal
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        )}
      </div>
    </div>
  )
}
