// actions/orders/uploadEvidenceAction.ts
'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { PurchaseOrderItem, successSchema } from "@/src/schemas"
import { cookies } from "next/headers"

export type ActionState = {
  success: string
  errors: string[]
  item: PurchaseOrderItem | null
}

export async function uploadEvidenceAction(prevState: ActionState, formData: FormData) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const itemId = formData.get('itemId') as string
  const file = formData.get('file') as File | null

  if (!itemId || !file) {
    return { success: '', item: null, errors: ['Falta archivo o itemId'] }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/items/${itemId}/evidence`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  }
  )

  console.log(res)
  const json = await res.json()

  if (!res.ok) {
    return {
      success: '',
      item: null,
      ...normalizeErrors(json)
    }
  }

  const { message } = successSchema.parse(json)
  const { item } = json

  return { success: message, item, errors: [] }
}
