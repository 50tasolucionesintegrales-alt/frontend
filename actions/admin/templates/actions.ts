'use server'

import { cookies } from 'next/headers';
import normalizeErrors from '@/src/helpers/normalizeError';

export type ActionType = {
  errors?: string[];
  success?: string;
  item?: any;
  ok?: boolean;
  error?: string;
}

/* ----------------- Crear Template ----------------- */
export async function addTemplate(_prev?: ActionType, formData?: FormData): Promise<ActionType> {
  if (!formData) return { errors: ['No se proporcionó FormData'], success: '' }

  const token = (await cookies()).get('50TA_TOKEN')?.value
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const json = await res.json()
  if (!res.ok) return { ...normalizeErrors(json), success: '' }
  return { errors: [], success: 'Template creado correctamente', item: json }
}

/* ----------------- Actualizar Template ----------------- */
export async function updateTemplate(_prev?: ActionType, formData?: FormData): Promise<ActionType> {
  if (!formData) return { errors: ['No se proporcionó FormData'], success: '', item: null }

  const token = (await cookies()).get('50TA_TOKEN')?.value
  const id = formData.get('templateId') as string
  if (!id) return { errors: ['ID del template es requerido'], success: '', item: null }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    cache: 'no-store',
  })

  const json = await res.json()
  if (!res.ok) return { ...normalizeErrors(json), success: '', item: null }

  return { errors: [], success: 'Template actualizado correctamente', item: json }
}

/* ----------------- Eliminar Template ----------------- */
export async function deleteTemplate(id: number): Promise<ActionType> {
  if (!id) return { error: 'ID del template es requerido' }

  try {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    if (!token) return { error: 'Token no encontrado' }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      let message = 'No se pudo eliminar'
      try {
        const j = await res.json()
        message = j?.message ?? message
      } catch {
        const text = await res.text()
        message = text || message
      }
      return { error: message }
    }

    return { ok: true }
  } catch (e) {
    return { error: 'Error de red' }
  }
}

/* ----------------- Obtener PDF como Data URL ----------------- */
export async function getTemplateFileDataUrl(id: number): Promise<string | null> {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  if (!token) return null

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}/pdf?disposition=inline`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`Upstream error ${res.status}`)
  }

  const contentType = res.headers.get('content-type') || 'application/pdf'
  const arrayBuffer = await res.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  return `data:${contentType};base64,${base64}`
}

import { Template } from '@/src/schemas'

export async function getTemplates(): Promise<Template[]> {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  if (!token) throw new Error('Token no encontrado')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text}`)
  }

  const data: any[] = await res.json()
  return data.map(t => ({
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion ?? undefined
  }))
}
