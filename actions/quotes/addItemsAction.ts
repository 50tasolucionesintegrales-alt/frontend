// /actions/quotes/agregarItemsAction.ts
'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { cookies } from "next/headers"

type ActionType = {
  errors: string[],
  success: string
}

export async function addItemsAction(prevState:ActionType, formData: FormData) {
  const quoteId = formData.get('quoteId')
  const rawItems = formData.get('items')
  const token = (await cookies()).get('50TA_TOKEN')?.value

  console.log(quoteId,rawItems)
  if (!quoteId || !rawItems) {
    return { 
      errors: ['Faltan datos para agregar ítems'], 
      success: '' 
    }
  }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: JSON.parse(rawItems as string) }),
    })

    const json = await res.json()
    if (!res.ok) {
      return { 
        ...normalizeErrors(json),
        success: '' 
      }
    }

    return { 
      errors: [], 
      success: 'Ítems agregados correctamente' 
    }
}
