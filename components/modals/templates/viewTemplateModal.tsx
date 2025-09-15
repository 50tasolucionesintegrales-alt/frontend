'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

type Props = { templateId: number, onClose: () => void }

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
    <div className="modal fixed inset-0 flex flex-col bg-white p-4">
      <h2>Vista previa PDF</h2>
      {loading && <p>Cargando...</p>}
      {dataUrl && <iframe title='data' src={dataUrl} className="flex-1 w-full border" />}
      <Button onClick={onClose} variant="outline">Cerrar</Button>
    </div>
  )
}