'use client'

import { useEffect, useState } from 'react'

type Props = { templateId: number; onClose: () => void }

export default function ViewTemplateModal({ templateId, onClose }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPdf = async () => {
      const token = document.cookie.split('; ').find(c => c.startsWith('50TA_TOKEN='))?.split('=')[1]
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${templateId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const arrayBuffer = await res.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      setDataUrl(`data:application/pdf;base64,${base64}`)
      setLoading(false)
    }
    fetchPdf()
  }, [templateId])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 flex flex-col gap-3 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-[#0F332D]">Vista previa PDF</h2>

        {loading && <p className="text-gray-500">Cargando...</p>}

        {dataUrl && (
          <iframe
            src={dataUrl}
            title="PDF Preview"
            className="flex-1 w-full border rounded-md h-[500px] md:h-[700px]"
          />
        )}

        <button
          onClick={onClose}
          className="mt-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 self-end"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}