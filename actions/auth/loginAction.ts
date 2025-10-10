"use server"

import normalizeErrors from "@/src/helpers/normalizeError"
import { errorSchema, loginSchema, successSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type LoginType = {
    errors: string[]
    success: string
    rol: string
}

export async function login(pervState: LoginType, formData: FormData) {

    const cookie = await cookies()

    const loginData = {
        email: formData.get("email"),
        password: formData.get("password"),
    }

    const login = loginSchema.safeParse(loginData)
    if (!login.success) {
        const errors = login.error.errors.map(error => error.message)
        return {
            errors,
            success: '',
            rol: ''
        }
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: login.data.email,
            password: login.data.password,
        }),
    })

    const json = await res.json()

    if (!res.ok) {
        return {
            ...normalizeErrors(json),
            success: '',
            rol: ''
        }
    }

    cookie.set({
        name: "50TA_TOKEN",
        value: json.token,
        httpOnly: true,
        path: "/"
    })

    const { message } = successSchema.parse(json)

    return {
        errors: [],
        success: message,
        rol: json.usuario.rol as string
    }
}