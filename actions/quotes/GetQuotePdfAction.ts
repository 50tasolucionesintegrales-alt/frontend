// actions/quotes/GetQuotePdfAction.ts
'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'

type State = { dataUrl?: string; filename?: string; error?: string }

export async function downloadQuotePdfAction(_prev: State, formData: FormData): Promise<State> {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const quoteId = String(formData.get('quoteId') ?? '')
  const empresa = Number(formData.get('empresa') ?? 1)

  if (!token)    return { error: 'No autenticado' }
  if (!quoteId)  return { error: 'Falta quoteId' }
  if (!empresa)  return { error: 'Selecciona empresa (1–10)' }

  const payload = {
    empresa,
    destinatario:   String(formData.get('destinatario') ?? '').trim(),
    presente:       String(formData.get('presente') ?? '').trim(),
    descripcion:    String(formData.get('descripcion') ?? '').trim(),
    condiciones:    String(formData.get('condiciones') ?? '').trim(),
    folio:          String(formData.get('folio') ?? '').trim(),
    lugar:          String(formData.get('lugar') ?? '').trim(),
    fecha:          String(formData.get('fecha') ?? '').trim(), // YYYY-MM-DD
    incluirFirma:   String(formData.get('incluirFirma') ?? 'false') === 'true',
    // 👇 nuevo: siempre llega (vacío o con "Nombre<br>Cargo")
    firmanteNombre: String(formData.get('firmanteNombre') ?? '').trim(),
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/pdf`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/pdf',
    },
    body: JSON.stringify(payload),
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
  // @ts-ignore Buffer existe en runtime Node
  const base64 = Buffer.from(buf).toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64}`
  const filename = `quote_${quoteId}_m${empresa}.pdf`

  return { dataUrl, filename }
}
