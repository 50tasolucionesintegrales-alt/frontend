'use server'

import normalizeErrors from "@/src/helpers/normalizeError";
import { successSchema } from "@/src/schemas";
import { cookies } from "next/headers";

type ItemInput = { productId: string; cantidad: number; costoUnitario: number }
type AddState  = { success: string; errors: string[]; order?: any }

export async function addOrderItemsAction (_prev: AddState, formData: FormData) {
  const token = (await cookies()).get('50TA_TOKEN')?.value

  const orderId = formData.get('orderId') as string
  const entries = JSON.parse(formData.get('items') as string) as ItemInput[]

  if (!entries.length) {
    return { success: '', errors: ['Selecciona al menos un producto'] }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/items`,
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
       },
      body: JSON.stringify({ items: entries })
    }
  )

  const json = await res.json()

  if(!res.ok) {
          return {
              ...normalizeErrors(json),
              success: ''
          }
      }

  const { message } = successSchema.parse(json)

  return { success: message, errors: [], order: json.order }
}
