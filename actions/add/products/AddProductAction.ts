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

  form.append('nombre', String(formData.get('nombre') || '').trim())
  form.append('descripcion', String(formData.get('descripcion') || '').trim())
  form.append('precio', String(formData.get('precio') || '').trim())
  form.append('categoryId', String(formData.get('categoryId') || '').trim())

  const linkCompra = formData.get('link_compra')

  if (typeof linkCompra === 'string' && linkCompra.trim() !== '') {
    let normalizedLink = linkCompra.trim()

    if (!/^https?:\/\//i.test(normalizedLink)) {
      normalizedLink = `https://${normalizedLink}`
    }

    form.append('link_compra', normalizedLink)
  }

  const file = formData.get('file') as File
  if (file && file.size > 0) {
    form.append('file', file)
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  })

  const json = await res.json()

  if (!res.ok) {
    return {
      ...normalizeErrors(json),
      success: ''
    }
  }

  return {
    errors: [],
    success: 'Producto creado correctamente'
  }
}