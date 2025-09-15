'use server'

import { cookies } from 'next/headers'

export async function getQuotePdfAction(
  quoteId: string,
  empresa: number // 1..7
): Promise<{ dataUrl?: string; filename?: string; error?: string }> {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  if (!token) return { error: 'No autenticado' }

  // clamp 1..7
  const m = Math.max(1, Math.min(7, Number(empresa) || 1))

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/pdf?empresa=${m}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    return { error: `No se pudo obtener el PDF (${res.status}). ${msg}` }
  }

  // Leemos binario y convertimos a base64 -> Data URL
  const ab = await res.arrayBuffer()
  // Usamos Buffer (Node). Si algún día lo mueves a Edge, cambio menor.
  const base64 = Buffer.from(ab).toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64}`
  const filename = `quote_${quoteId}_m${m}.pdf`
  return { dataUrl, filename }
}
