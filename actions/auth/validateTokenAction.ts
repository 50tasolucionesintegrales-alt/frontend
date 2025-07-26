"use server"

import normalizeErrors from "@/src/helpers/normalizeError";
import { errorSchema, successSchema, TokenSchema } from "@/src/schemas";

type ValidateTokenType = {
    errors: string[];
    success: string;
}

export async function validateTokenAction(token: string, prevState: ValidateTokenType) {

    const resetPassword = TokenSchema.safeParse(token)
    if (!resetPassword.success) {
        return {
            errors: resetPassword.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/validate-reset-token`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: resetPassword.data
        })
    })

    const json = await response.json()

    if (!response.ok) {
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