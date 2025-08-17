'use server'

import { cookies } from 'next/headers'
import normalizeErrors from '@/src/helpers/normalizeError'
import { successSchema } from '@/src/schemas';

type ActionState = { errors: string[]; success: string; order?: any }

export async function reopenOrderAction (
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('orderId') as string
  const token = (await cookies()).get('50TA_TOKEN')?.value

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/reopen`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` }
    }
  )

  const json = await res.json()

  if (!res.ok) return { ...normalizeErrors(json), success: '' }

  const { message } = successSchema.parse(json)
  
  return { errors: [], success: message, order: json.order }
}
