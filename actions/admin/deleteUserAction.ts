'use server'

import normalizeErrors from "@/src/helpers/normalizeError";
import { successSchema } from "@/src/schemas";
import { cookies } from "next/headers";

type ActionType = {
    errors: string[],
    success: string
}

export default async function deleteUserAction(prev: ActionType, formData: FormData) {

    const userId = formData.get("userId")

    const token = (await cookies()).get("50TA_TOKEN")?.value;

    // 2. Hacer PATCH al endpoint de tu API
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`;

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    console.log(res)
    const json = await res.json();

    // 3. Manejar errores
    if (!res.ok) {
        return {
            ...normalizeErrors(json),
            success: ""
        };
    }

    // 4. Éxito
    const { message } = successSchema.parse(json);

    return {
        errors: [],
        success: message
    }
}