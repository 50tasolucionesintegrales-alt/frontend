"use server"

import { errorSchema, successSchema, updatePassSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function updatePassAction(prevState: ActionStateType, formData: FormData) {
    const token = (await cookies()).get('CURSIFY_TOKEN')?.value
    const resetPassInput = {
        current_password: formData.get('current_password'),
        password: formData.get('new_password'),
        confirmPassword: formData.get('confirmPassword')
    }
    const updatePass = updatePassSchema.safeParse(resetPassInput)

    if (!updatePass.success) {
        const errors = updatePass.error.issues.map(issue => issue.message)
        return {
            errors,
            success: '',
        }
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/update-passsword`

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            current_password: updatePass.data.current_password,
            password: updatePass.data.password
        })
    })

    const json = await res.json()

    if (!res.ok) {
        const { error } = errorSchema.parse(json)
        return {
            errors: [error],
            success: '',
        }
    }

    const success = successSchema.parse(json)

    return {
        errors: [],
        success
    }
}