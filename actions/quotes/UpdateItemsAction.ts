'use server'

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

// DTO (igual que en front)
type BatchUpdateItemDto = {
  id: string;
  cantidad?: number;
  costo_unitario?: number;
  margenPct1?: number | null;
  margenPct2?: number | null;
  margenPct3?: number | null;
  margenPct4?: number | null;
  margenPct5?: number | null;
  margenPct6?: number | null;
  margenPct7?: number | null;
  margenPct8?: number | null;
  margenPct9?: number | null;
  margenPct10?: number | null;
}

export async function updateQuoteItemsAction(quoteId: string, dtos: BatchUpdateItemDto[]) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  if (!token) return { success: false, error: 'No autorizado' }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/items`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dtos),
    })

    // Intentamos parsear la respuesta JSON (si el backend devuelve los items actualizados)
    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error((json && json.message) || 'Error del servidor al guardar')
    }

    // Revalidamos la cotización localmente
    revalidateTag(`quote-${quoteId}`, 'page')

    // Devolver items si el backend las incluye en la respuesta
    if (Array.isArray(json.items)) {
      return { success: true, error: null, items: json.items }
    }

    // Algunos backends devuelven { itemsUpdated: [...] } o similar: intentar detectar
    if (Array.isArray((json as any).itemsUpdated)) {
      return { success: true, error: null, items: (json as any).itemsUpdated }
    }

    // Si no hay items en la respuesta, indicar success pero sin items
    return { success: true, error: null, items: null }

  } catch (error) {
    return { success: false, error: (error as Error).message, items: null }
  }
}
