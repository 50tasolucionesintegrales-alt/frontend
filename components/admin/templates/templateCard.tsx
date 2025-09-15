'use client'

import { Template } from '@/src/schemas'

type Props = { 
  template: Template
  onEdit: (t: Template) => void
  onView: (t: Template) => void
  onDelete: (t: Template) => void
}

export default function TemplateCard({ template, onEdit, onView, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="bg-[#E5E7EB] w-16 h-20 flex justify-center items-center text-[#9CA3AF] font-bold text-sm rounded">
          PDF
        </div>
        <div className="flex-1">
          <div className="font-semibold text-[#0F332D] text-lg">{template.nombre}</div>
          <div className="text-gray-500 text-sm mt-1">{template.descripcion}</div>
        </div>
      </div>
      <div className="flex gap-2 mt-2 justify-end">
        <button
          onClick={() => onEdit(template)}
          className="bg-[#0F332D] hover:bg-[#0A251F] text-white px-3 py-1 rounded-md font-medium text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(template)}
          className="border border-gray-400 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 font-medium text-sm"
        >
          Eliminar
        </button>
        <button
          onClick={() => onView(template)}
          className="bg-[#63B23D] hover:bg-[#4D912C] text-white px-3 py-1 rounded-md font-medium text-sm"
        >
          Ver PDF
        </button>
      </div>
    </div>
  )
}