'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'

type ActionType = {
    errors: string[]
    success: string
}

export default async function AddCategoryAction(prevState: ActionType, formData: FormData) {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const data = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion')
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    console.log(res)

    const json = await res.json()
    if(!res.ok) {
        return {
            ...normalizeErrors(json),
            success: ''
        }
    }

    return {
        errors: [],
        success: 'Categoria creada correctamente'
    }
}
