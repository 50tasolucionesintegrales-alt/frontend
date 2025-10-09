'use server'

import { cookies } from 'next/headers'

export type ActionType = {
  errors?: string[]
  success?: string
  items?: TemplateImage[]
  error?: string
  ok?: boolean
}

export type Template = {
  name: string
  data: string // base64
}

export type TemplateImage = {
  name: string
  data: string // base64 listo para <img src="..."/>
}

/* ----------------- Obtener todas las plantillas ----------------- */
export async function getTemplates(): Promise<ActionType> {
  try {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    if (!token) return { error: 'Token no encontrado' }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text()
      return { error: `Error ${res.status}: ${text}` }
    }

    const json = await res.json()
    return {
      ok: true,
      items: json.templates as TemplateImage[],
    }
  } catch (e) {
    return { error: 'Error de red al obtener plantillas' }
  }
}