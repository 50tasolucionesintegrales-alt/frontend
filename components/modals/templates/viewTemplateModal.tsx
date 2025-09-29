'use client'

import { Template } from '@/actions/admin/templates/actions'

type Props = {
  template: Template
  onClose: () => void
}

export default function ViewTemplateModal({ template, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{template.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
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