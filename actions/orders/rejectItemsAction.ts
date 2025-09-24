'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { successSchema } from "@/src/schemas"
import { cookies } from "next/headers" 
import { z } from "zod"

type ActionType = {
    errors: string[]
    success: string
    item: any
}

const rejectItem = z.object({
    cantidad: z.coerce.number(),
    costoUnitario: z.coerce.number()
})

export default async function rejectItemsAction(prevState: ActionType, formData: FormData) {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const id = formData.get('id')
    const data = {
        cantidad: formData.get('cantidad'),
        costoUnitario: formData.get('precio')
    }
    const parsed = rejectItem.safeParse(data)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/items/${id}` ,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            cantidad: parsed.data?.cantidad,
            costoUnitario: parsed.data?.costoUnitario
        })
    })

    const json = await res.json()

    if (!res.ok) {
        return {
            ...normalizeErrors(json),
            success: '',
            item: null
        }
    }

    const { message } = successSchema.parse(json)

    return {
        errors: [],
        success: message,
        item: json.item
    } 
}