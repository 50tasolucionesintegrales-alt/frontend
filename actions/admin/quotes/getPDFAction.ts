// /actions/quotes/getQuotePdfAction.ts
'use server'

import { cookies } from 'next/headers'

export async function getQuotePdfAction(quoteId: string, empresa: number) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const url = `${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/pdf?empresa=${empresa}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    return { error: `No se pudo obtener el PDF (HTTP ${res.status})` }
  }

  const ab   = await res.arrayBuffer()
  const b64  = Buffer.from(ab).toString('base64')
  const dataUrl = `data:application/pdf;base64,${b64}`
  return { filename: `quote_${quoteId}_m${empresa}.pdf`, dataUrl }
}
