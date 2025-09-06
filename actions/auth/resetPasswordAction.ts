"use server"

import normalizeErrors from "@/src/helpers/normalizeError"
import { errorSchema, resetPassSchema, successSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function resetPasswordAction(token: string, prevState: ActionStateType, formData: FormData) {
    const resetPassInput = {
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    }
    const resetPass = resetPassSchema.safeParse(resetPassInput)

    if (!resetPass.success) {
        const errors = resetPass.error.issues.map(issue => issue.message)
        return {
            errors,
            success: '',
        }
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password/${token}`

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: resetPass.data.password
        })
    })

    const json = await res.json()

    if (!res.ok) {
        return {
            ...normalizeErrors(json),
            success: '',
        }
    }

    const { message } = successSchema.parse(json)

    return {
        errors: [],
        success: message
    }
}