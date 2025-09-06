'use server'

import normalizeErrors from "@/src/helpers/normalizeError"
import { cookies } from "next/headers"

type ActionType = {
    errors: string[]
    success: string
}

export default async function DeleteCategoryAction(_prev: ActionType, id: string) {
    const token = (await cookies()).get('50TA_TOKEN')?.value

    if(!id) {
        return {
            errors: ['ID de categoría no proporcionado'],
            success: '',
        }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    const json = await res.json()

    if(res.ok) {
        return {
            ...normalizeErrors(json),
            success: '',
        }
    }

  return {
    errors: [],
    success: 'Categoría eliminada correctamente',
  }
}
