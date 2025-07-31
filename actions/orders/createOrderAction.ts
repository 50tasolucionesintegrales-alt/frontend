'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { successSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type ActionType = {
    success: string
    errors: string[]
}

export async function createOrderAction(_prev: ActionType, formData: FormData) {
    const titulo = String(formData.get('titulo') ?? '').trim()
    const descripcion = String(formData.get('descripcion') ?? '').trim()
    const token = (await cookies()).get('50TA_TOKEN')?.value

    if (!titulo) {
        return { 
            errors: ['El título es obligatorio'], 
            success: ''
        }
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, descripcion })
        }
    )

    const json = await res.json()

    if (!res.ok) {
        return {
            ...normalizeErrors(json),
            success: ''
        }
    }

    const { message } = successSchema.parse(json)

    return {
        errors: [],
        success: message
    }
}
