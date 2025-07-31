'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { Item, successSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type ActionType = {
    errors: string[]
    success: string
    item: Item | null
}

export async function approveItemAction(_prev: ActionType, formData: FormData) {
    const itemId = formData.get('itemId') as string
    const status = formData.get('status') as 'approved' | 'rejected'
    const reason = formData.get('reason') as string | null
    const token = (await cookies()).get("50TA_TOKEN")?.value;
    const body = { status, reason: status === 'rejected' ? reason : null }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/items/${itemId}/approve`,
        {
            method: 'PATCH',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
             },
            body: JSON.stringify(body)
        }
    )

    const json = await res.json()

    if (!res.ok) {
        return {
            ...normalizeErrors(json),
            success: '',
            item: null
        }
    }

    const { message } = successSchema.parse(json)

    return { success: message, errors: [], item: json.item }
}
