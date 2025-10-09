'use client'

import { Template } from '@/actions/admin/templates/actions'
import { X } from 'lucide-react'

type Props = {
  template: Template
  onClose: () => void
}

export default function ViewTemplateModal({ template, onClose }: Props) {
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full flex flex-col relative"
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={28} />
          </button>
        </div>

        <img
          src={template.data}
          alt={template.name}
          className="w-full h-auto object-contain rounded"
        />
      </div>
    </div>
  )
}
