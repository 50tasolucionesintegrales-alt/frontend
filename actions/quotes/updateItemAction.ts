'use server'
import normalizeErrors from "@/src/helpers/normalizeError"
import { updateItemSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type ActionType ={
  errors: string[],
  success: string
}

export async function updateItemAction(prevState: ActionType, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = updateItemSchema.safeParse(data)
  const token = (await cookies()).get('50TA_TOKEN')?.value

  if (!parsed.success) {
    return { error: 'Datos inválidos.' }
  }

  const { itemId, ...payload } = parsed.data

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/items/${itemId}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(payload),
  })

  console.log(res)
  const json = await res.json()
  if (!res.ok) {
    return {
      ...normalizeErrors(json),
      success: ''
    }
  }

  return { success: 'Ítem actualizado correctamente.', item: json  }
}