'use client'

import { Template } from '@/actions/admin/templates/actions'
import Image from 'next/image'

type Props = { 
  template: Template
  onView: (t: Template) => void
}

export default function TemplateCard({ template, onView }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col gap-3">
      <div className="flex flex-col items-center">
        {/* Miniatura */}
        <Image
          src={template.data}
          alt={template.name}
          width={96}   // equivalente a w-24
          height={128} // equivalente a h-32
          className="object-contain rounded border"
        />
        <div className="mt-2 text-sm text-gray-700">{template.name}</div>
      </div>

      <div className="flex gap-2 mt-2 justify-center">
        <button
          onClick={() => onView(template)}
          className="bg-[#63B23D] hover:bg-[#4D912C] text-white px-3 py-1 rounded-md font-medium text-sm"
        >
          Ver
        </button>
      </div>
    </div>
  )
}