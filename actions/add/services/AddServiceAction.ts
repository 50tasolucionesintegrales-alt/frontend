'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { AddServiceSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type ActionType = {
    errors: string[]
    success: string
}

export default async function AddServiceAction(prevState: ActionType, formData: FormData) {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const data = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precioBase: formData.get('precioBase'),
    }

    const parsed = AddServiceSchema.safeParse(data)

    if (!parsed.success) {
        return {
            errors: parsed.error.errors.map(e => e.message),
            success: '',
        }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(parsed.data),
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
        success: 'Servicio creado exitosamente',
    }
}
