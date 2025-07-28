'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { successSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type ActionType = {
    errors: string[]
    success: string
}

export default async function sendQuoteAction(prevState: ActionType, formData: FormData) {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const id = formData.get('quoteId')

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${id}/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })

    const json = await res.json()
    if(!res) {
        return {
            ...normalizeErrors(json),
            success: ''
        }
    }

    console.log(json)
    // const { message } = successSchema.parse(json)

    return {
        errors: [],
        success: 'Cotización enviada correctamente'
    }
}
