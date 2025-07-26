'use server';

// Archivo: app/admin/users/unassigned/actions.ts
// Server Action alineada con el formulario de page.tsx y con la firma (prevState, formData)

import { z } from "zod";
import { assignRoleSchema, errorSchema, successSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import normalizeErrors from "@/src/helpers/normalizeError";

export type ActionStateType = {
  errors: string[];
  success: string;
};


export async function modificarRolAction(
  _prevState: ActionStateType,
  formData: FormData
): Promise<ActionStateType> {
  // 1. Parsear/validar formData
  const parsed = assignRoleSchema.safeParse({
    userId: formData.get("userId"),
    rol: formData.get("rol"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.issues.map((i) => i.message),
      success: "",
    };
  }

  const { userId, rol } = parsed.data;
  const token = (await cookies()).get("50TA_TOKEN")?.value;

  // 2. Hacer PATCH al endpoint de tu API
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ rol }),
  });

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
  revalidatePath("/admin/users/unassigned");

  return { errors: [], success: message };
}
