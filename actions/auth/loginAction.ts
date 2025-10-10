"use server"

import normalizeErrors from "@/src/helpers/normalizeError"
import { errorSchema, loginSchema, successSchema } from "@/src/schemas"
import { cookies } from "next/headers"

type LoginType = {
  errors: string[]
  success: string
  rol: string
}

export async function login(prevState: LoginType, formData: FormData) {
  const cookie = await cookies()

  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  // Validar esquema del login
  const parsed = loginSchema.safeParse(loginData)
  if (!parsed.success) {
    const errors = parsed.error.errors.map(e => e.message)
    return { errors, success: "", rol: "" }
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    })

    // Verificar que la respuesta es válida
    const contentType = res.headers.get("content-type")

    if (!res.ok) {
      // Si el servidor devuelve error, tratamos de obtener texto legible
      const errorText = await res.text()
      console.error(`❌ Error ${res.status}:`, errorText)

      // Intentar normalizar si es JSON válido, si no, mandar mensaje genérico
      try {
        const json = JSON.parse(errorText)
        return { ...normalizeErrors(json), success: "", rol: "" }
      } catch {
        return {
          errors: ["El servidor devolvió una respuesta inválida o en mantenimiento."],
          success: "",
          rol: "",
        }
      }
    }

    // Si el servidor respondió correctamente pero no es JSON
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text()
      console.error("⚠️ Respuesta no JSON:", text)
      throw new Error("La respuesta del servidor no es JSON.")
    }

    // Ahora sí, parsear el JSON seguro
    const json = await res.json()

    cookie.set({
      name: "50TA_TOKEN",
      value: json.token,
      httpOnly: true,
      path: "/",
    })

    const { message } = successSchema.parse(json)

    return {
      errors: [],
      success: message,
      rol: json.usuario.rol as string,
    }
  } catch (err: any) {
    console.error("🚨 Error general en loginAction:", err.message)
    return {
      errors: ["Error de conexión con el servidor. Intenta más tarde."],
      success: "",
      rol: "",
    }
  }
}
