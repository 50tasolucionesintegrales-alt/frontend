// /actions/quotes/sendQuoteAction.ts
'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

type ActionType = { errors: string[]; success: string }

export default async function sendQuoteAction(
  prevState: ActionType,
  formData: FormData
) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const id = formData.get('quoteId')?.toString()

  if (!token) return { errors: ['No autenticado'], success: '' }
  if (!id)    return { errors: ['Falta quoteId'], success: '' }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${id}/send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  let json: any = null
  try { json = await res.json() } catch {}

  if (!res.ok) {
    return { ...normalizeErrors(json || { message: res.statusText }), success: '' }
  }

  // Para que cambie a "sent" en el UI al refrescar
  revalidatePath(`/quotes/${id}`)
  return { errors: [], success: 'Cotización enviada correctamente' }
}
