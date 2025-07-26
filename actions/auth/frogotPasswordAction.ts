"use server"

import normalizeErrors from "@/src/helpers/normalizeError";
import { errorSchema, forgotPasswordSchema, successSchema } from "@/src/schemas";

type forgotPasswordType = {
    errors: string[];
    success: string;
}

export async function forgotPassword(orevState: forgotPasswordType, formData: FormData) {

    const forgotPass = forgotPasswordSchema.safeParse({
        email: formData.get('email')
    });

    if (!forgotPass.success) {
        return {
            errors: forgotPass.error.errors.map(error => error.message),
            success: ''
        };
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: forgotPass.data.email
        })
    })

    const json = await res.json();

    if (!res.ok) {
        return {
            ...normalizeErrors(json),
            success: ''
        };
    }

    const { message } = successSchema.parse(json);

    return {
        errors: [],
        success: message
    }
}