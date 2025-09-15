'use client'

import { Template } from '@/src/schemas'

type Props = {
  template: Template
  onEdit: (t: Template) => void
  onView: (t: Template) => void
}

export default function TemplateCard({ template, onEdit, onView }: Props) {
  return (
    <div className="border rounded p-4 flex flex-col items-start gap-2">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="bg-gray-200 w-12 h-16 flex justify-center items-center text-gray-600 font-bold text-sm">PDF</div>
          <div>
            <div className="font-semibold">{template.nombre}</div>
            <div className="text-sm text-gray-500">{template.descripcion}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-2 py-1 bg-blue-600 text-white rounded text-sm" onClick={() => onEdit(template)}>Editar</button>
          <button className="px-2 py-1 bg-green-600 text-white rounded text-sm" onClick={() => onView(template)}>Ver PDF</button>
        </div>
      </div>
    </div>
  )
}