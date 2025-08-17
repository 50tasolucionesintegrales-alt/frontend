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
  form.append('nombre', formData.get('nombre') || '')
  form.append('descripcion', formData.get('descripcion') || '')
  form.append('precio', formData.get('precio') || '')
  form.append('categoryId', formData.get('categoryId') || '')
  form.append('link_compra', formData.get('link_compra') || '')

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
