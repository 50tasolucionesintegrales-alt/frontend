"use server"

import normalizeErrors from "@/src/helpers/normalizeError"
import { errorSchema, registerSchema, successSchema } from "@/src/schemas"

type errorsType = {
    errors: string[],
    success: string,
}

export async function register(prevState: errorsType, formData: FormData) {

    const registerData = {
        nombre: formData.get("nombre"),
        email: formData.get("email"),
        password: formData.get("password"),
        password2: formData.get("password2"),
    }

    const register = registerSchema.safeParse(registerData)

    if (!register.success) {
        const errors = register.error.errors.map(error => error.message)
        return {
            errors,
            success: '',
        }
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/register`

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nombre: register.data.nombre,
            email: register.data.email,
            password: register.data.password,
        }),
    })

    const json = await res.json()

    if (res.status === 409) {
        return {
            ...normalizeErrors(json),
            success: '',
        }
    }

    const { message } = successSchema.parse(json)

    return {
        errors: [],
        success: message,
    }
}