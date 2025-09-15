'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { updateItemSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

type ActionType = { errors: string[]; success: string }

export async function updateItemAction(prev: ActionType, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = updateItemSchema.safeParse(data)
  const token = (await cookies()).get('50TA_TOKEN')?.value

  if (!parsed.success) return { error: 'Datos inválidos.' }

  const { itemId, quoteId, ...rest } = parsed.data

  // quita undefined/NaN para no sobreescribir con "nada"
  const payload = Object.fromEntries(
    Object.entries(rest).filter(([, v]) =>
      v !== undefined && v !== null && !(typeof v === 'number' && Number.isNaN(v))
    )
  )

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  const json = await res.json()
  if (!res.ok) return { ...normalizeErrors(json), success: '' }

  // revalida la página de la COTIZACIÓN, no la del ítem
  revalidatePath(`/quotes/${quoteId}`, 'page')

  // el service devuelve { message, item }
  return { success: 'Ítem actualizado correctamente.', item: json.item ?? json }
}
