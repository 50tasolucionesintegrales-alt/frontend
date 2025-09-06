// actions/update/products/UpdateProductAction.ts
'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'

type ActionType = {
    errors: string[]
    success: string
    item?: any
}

export default async function UpdateProductAction(_prev: ActionType, formData: FormData) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const form = new FormData()

  // mismos nombres que tu API espera
  const id = formData.get('productId') as string
  if (!id) return { errors: ['ID del producto es requerido'], success: '' }

  form.append('nombre', (formData.get('nombre') as string) || '')
  form.append('descripcion', (formData.get('descripcion') as string) || '')
  form.append('precio', (formData.get('precio') as string) || '')
  form.append('categoryId', (formData.get('categoryId') as string) || '')
  form.append('link_compra', (formData.get('link_compra') as string) || '')

  const file = formData.get('file') as File | null
  if (file && file.size > 0) form.append('file', file)

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
        item: null
     }
  }

  return {
    errors: [],
    success: 'Producto actualizado correctamente',
    item: json
  }
}
