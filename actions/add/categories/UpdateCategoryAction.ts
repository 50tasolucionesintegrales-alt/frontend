'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { cookies } from "next/headers"

type ActionType = {
    errors: string[],
    success: string,
    item?: any
}

export default async function UpdateCategoryAction(_prev: ActionType, formData: FormData) {

    const token = (await cookies()).get('50TA_TOKEN')?.value

    const data = {
        id: formData.get('categoryId') as string,
        nombre: formData.get('nombre') as string,
        descripcion: formData.get('descripcion') as string,
    }

    if(!data.id) {
        return {
            errors: ['ID de categoría no proporcionado'],
            success: '',
            item: undefined
        }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${data.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    console.log(res)
    const json = await res.json()
    console.log(json)

    if(!res.ok) {
        return {
            ...normalizeErrors(json),
            success: '',
            item: undefined
        }
    }

    return {
        errors: [],
        success: "Categoria modifcada correctamente",
        item: json
    }
}