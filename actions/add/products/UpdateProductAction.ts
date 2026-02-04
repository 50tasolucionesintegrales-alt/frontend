// actions/update/products/UpdateProductAction.ts
'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'

type ActionType = {
  errors: string[]
  success: string
  item?: any
}

export default async function UpdateProductAction(
  _prev: ActionType,
  formData: FormData
) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const form = new FormData()

  const id = String(formData.get('productId') || '').trim()
  if (!id) {
    return { errors: ['ID del producto es requerido'], success: '' }
  }

  // ---- Campos (solo si vienen) ----
  const nombre = String(formData.get('nombre') || '').trim()
  const descripcion = String(formData.get('descripcion') || '').trim()
  const precio = String(formData.get('precio') || '').trim()
  const categoryId = String(formData.get('categoryId') || '').trim()

  if (nombre) form.append('nombre', nombre)

  if (descripcion) {
    if (descripcion.length > 128) {
      return {
        errors: ['La descripción debe tener máximo 128 caracteres'],
        success: '',
      }
    }
    form.append('descripcion', descripcion)
  }

  if (precio) form.append('precio', precio)
  if (categoryId) form.append('categoryId', categoryId)

  // ---- Link de compra (opcional) ----
  const linkCompra = formData.get('link_compra')

  if (typeof linkCompra === 'string' && linkCompra.trim() !== '') {
    let normalizedLink = linkCompra.trim()
    if (!/^https?:\/\//i.test(normalizedLink)) {
      normalizedLink = `https://${normalizedLink}`
    }
    form.append('link_compra', normalizedLink)
  }

  // ---- Imagen (opcional) ----
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    form.append('file', file)
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    cache: 'no-store',
  })

  const json = await res.json()

  if (!res.ok) {
    return {
      ...normalizeErrors(json),
      success: '',
      item: null,
    }
  }

  return {
    errors: [],
    success: 'Producto actualizado correctamente',
    item: json,
  }
}
