'use server'

import { cookies } from 'next/headers'

export default async function DeleteProductAction(id: string) {
  try {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      return { error: j?.message ?? 'No se pudo eliminar' }
    }
    return { ok: true }
  } catch {
    return { error: 'Error de red' }
  }
}
