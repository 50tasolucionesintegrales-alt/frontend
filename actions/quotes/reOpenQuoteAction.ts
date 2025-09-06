'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { successSchema } from "@/src/schemas"
import { method } from "lodash"
import { cookies } from "next/headers"

type ActionType = {
    errors: string[]
    success: string
}

export default async function reOpenQuoteAction(prevState: ActionType, formData: FormData) {
    const quoteId = formData.get('quoteId')
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/reopen`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })

    const json = await res.json()
    console.log(res)
    console.log(json)
    if(!res.ok) {
        return {
            ...normalizeErrors(json),
            success: ''
        }
    }

    return {
        errors: [],
        success: 'La cotización se reabrio correctamente'
    }
}
