'use server'

import { cookies } from 'next/headers'
import normalizeErrors from '@/src/helpers/normalizeError'

type ActionType = {
  errors: string[]
  success: string
}

export default async function AddProductAction(
  prevState: ActionType,
  formData: FormData
) {
  const token = (await cookies()).get('50TA_TOKEN')?.value

  const form = new FormData()

  // --- Campos obligatorios ---
  const nombre = String(formData.get('nombre') || '').trim()
  const descripcion = String(formData.get('descripcion') || '').trim()
  const precio = String(formData.get('precio') || '').trim()
  const categoryId = String(formData.get('categoryId') || '').trim()

  if (!nombre) {
    return { errors: ['El nombre es obligatorio'], success: '' }
  }

  if (!descripcion) {
    return { errors: ['La descripción es obligatoria'], success: '' }
  }

  if (descripcion.length > 128) {
    return {
      errors: ['La descripción debe tener máximo 128 caracteres'],
      success: '',
    }
  }

  if (!precio) {
    return { errors: ['El precio es obligatorio'], success: '' }
  }

  if (!categoryId) {
    return { errors: ['La categoría es obligatoria'], success: '' }
  }

  form.append('nombre', nombre)
  form.append('descripcion', descripcion)
  form.append('precio', precio)
  form.append('categoryId', categoryId)

  // --- Link de compra (opcional) ---
  const linkCompra = formData.get('link_compra')

  if (typeof linkCompra === 'string' && linkCompra.trim() !== '') {
    let normalizedLink = linkCompra.trim()

    if (!/^https?:\/\//i.test(normalizedLink)) {
      normalizedLink = `https://${normalizedLink}`
    }

    form.append('link_compra', normalizedLink)
  }

  // --- Imagen (opcional) ---
  const file = formData.get('file') as File

  if (file && file.size > 0) {
    form.append('file', file)
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  })

  const json = await res.json()

  if (!res.ok) {
    return {
      ...normalizeErrors(json),
      success: '',
    }
  }

  return {
    errors: [],
    success: 'Producto creado correctamente',
  }
}
