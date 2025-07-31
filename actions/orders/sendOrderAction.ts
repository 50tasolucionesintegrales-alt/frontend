'use server'

import { cookies } from "next/headers"
import { successSchema } from "@/src/schemas"
import normalizeErrors from "@/src/helpers/normalizeError"

type Actiontyope = {
    errors: string[]
    success: string
}

export default async function sendOrderAction(prevState: Actiontyope, formData: FormData) {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const orderId = formData.get('orderId')

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/send`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const json = res.json()
    
    if(!res.ok) {
        return {
            ...normalizeErrors(json),
            success: ''
        }
    }

    return {
        errors: [],
        success: 'Orden enviada'
    }
}
