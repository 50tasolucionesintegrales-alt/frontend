'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

type State = { dataUrl?: string; filename?: string; error?: string }

export async function downloadQuotePdfAction(_prev: State, formData: FormData): Promise<State> {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const quoteId = String(formData.get('quoteId') ?? '')
  const empresa = Number(formData.get('empresa') ?? 1)

  if (!token)    return { error: 'No autenticado' }
  if (!quoteId)  return { error: 'Falta quoteId' }
  if (!empresa)  return { error: 'Selecciona empresa (1–12)' }

  // Extraer datos del formulario
  const destinatario = String(formData.get('destinatario') ?? '').trim()
  const presente = String(formData.get('presente') ?? '').trim()
  const descripcion = String(formData.get('descripcion') ?? '').trim()
  const condiciones = String(formData.get('condiciones') ?? '').trim()
  const folio = String(formData.get('folio') ?? '').trim()
  const lugar = String(formData.get('lugar') ?? '').trim()
  const fecha = String(formData.get('fecha') ?? '').trim()
  const incluirFirma = String(formData.get('incluirFirma') ?? 'false') === 'true'
  const firmanteNombre = String(formData.get('firmanteNombre') ?? '').trim()

  // Extraer datos para guardar en la plantilla (sin HTML)
  let condicionesItems: string[] = []
  if (condiciones.includes('<ul>')) {
    const liRegex = /<li>(.*?)<\/li>/g
    let match
    while ((match = liRegex.exec(condiciones)) !== null) {
      condicionesItems.push(match[1])
    }
  }

  // Separar firmanteNombre y firmanteCargo (vienen con <br>)
  const firmanteParts = firmanteNombre.split('<br>')
  const firmanteNombreOnly = firmanteParts[0] || ''
  const firmanteCargoOnly = firmanteParts[1] || ''

  // 1. Primero actualizar la plantilla en la base de datos
  try {
    const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/templates/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        empresa,
        destinatario,
        presente,
        descripcion,
        folio, // Guardar el folio completo tal como viene
        lugar,
        incluirFirma,
        firmanteNombre: firmanteNombreOnly,
        firmanteCargo: firmanteCargoOnly,
        condicionesItems: condicionesItems.length > 0 ? condicionesItems : null,
        condicionesMode: 'list',
      }),
    })

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error('Error al actualizar plantilla:', errorText);
    } else {
      const result = await updateRes.json();
      // Revalidar los datos de la plantilla
      revalidateTag(`template-data-${empresa}`, 'max')
    }
  } catch (error) {
    console.error('Error al actualizar plantilla:', error);
    // Continuamos con la generación del PDF aunque falle el guardado
  }

  // 2. Generar el PDF
  const payload = {
    empresa,
    destinatario,
    presente,
    descripcion,
    condiciones,
    folio,
    lugar,
    fecha,
    incluirFirma,
    firmanteNombre,
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
  const base64 = Buffer.from(buf).toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64}`
  const filename = `quote_${quoteId}_m${empresa}.pdf`

  return { dataUrl, filename }
}