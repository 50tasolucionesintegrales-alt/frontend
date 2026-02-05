'use server'

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

export async function deleteItemAction(itemId: string) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  if (!token) return { success: false, error: 'No autorizado' }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al eliminar el ítem')
    }

    // Revalidar la cotización
    revalidateTag('quote-*', 'layout')
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting item:', error)
    return { success: false, error: (error as Error).message }
  }
}