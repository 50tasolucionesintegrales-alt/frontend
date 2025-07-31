'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { cookies } from "next/headers"

type ActionType = {
    errors: string[]
    success: string
}

export async function deleteOrderAction(_prev: ActionType, formData: FormData) {
    const orderId = formData.get('orderId') as string
    const token = (await cookies()).get("50TA_TOKEN")?.value;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, { 
            method: 'DELETE', 
            headers: {
                Authorization: `Bearer ${token}`
            }
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

    return { success: 'Orden eliminada', errors: [] }
}
