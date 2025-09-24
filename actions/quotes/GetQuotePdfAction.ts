'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'

type State = { dataUrl?: string; filename?: string; error?: string }

export async function downloadQuotePdfAction(_prev: State, formData: FormData): Promise<State> {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const quoteId = String(formData.get('quoteId') ?? '')
  const empresa = Number(formData.get('empresa') ?? 1)
  const destinatario = String(formData.get('destinatario') ?? '').trim()
  const descripcion = String(formData.get('descripcion') ?? '').trim()
  const fecha = String(formData.get('fecha') ?? '').trim() // YYYY-MM-DD

  if (!token) return { error: 'No autenticado' }
  if (!quoteId) return { error: 'Falta quoteId' }
  if (!empresa) return { error: 'Selecciona empresa (1–7)' }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/pdf`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/pdf',
    },
    body: JSON.stringify({ empresa, destinatario, descripcion, fecha }),
  })

  if (!res.ok) {
    try {
      const j = await res.json()
      return { error: normalizeErrors(j).errors?.[0] ?? 'No se pudo generar el PDF' }
    } catch {
      return { error: 'No se pudo generar el PDF' }
    }
  }

  const buf = await res.arrayBuffer()
  // @ts-ignore Buffer está en runtime de Node
  const base64 = Buffer.from(buf).toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64}`
  const filename = `quote_${quoteId}_m${empresa}.pdf`

  return { dataUrl, filename }
}
