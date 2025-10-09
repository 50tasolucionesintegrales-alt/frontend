// actions/admin/quotes/deleteQuoteAction.ts
'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'

type ActionState = { errors: string[]; success: string }

export async function deleteQuoteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const quoteId = String(formData.get('quoteId') ?? '')
  const token = (await cookies()).get('50TA_TOKEN')?.value

  if (!token) return { errors: ['No autenticado'], success: '' }
  if (!quoteId) return { errors: ['Falta quoteId'], success: '' }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  let json: any = null
  try { json = await res.json() } catch {}

  if (!res.ok) {
    const norm = normalizeErrors(json ?? {})
    return { errors: norm.errors?.length ? norm.errors : ['No se pudo eliminar la cotización'], success: '' }
  }

  return { success: 'Cotización eliminada', errors: [] }
}
