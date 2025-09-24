// /actions/orders/createOrderAndAddItemAction.ts
'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { cookies } from 'next/headers'

type ActionState = { success: string; errors: string[]; order?: any }

export async function createOrderAndAddItemAction(
  _prev: ActionState,
  formData: FormData
) {
  const token = (await cookies()).get('50TA_TOKEN')?.value

  const titulo       = String(formData.get('title') ?? '').trim().slice(0, 80) || 'Orden rápida'
  const descripcion  = String(formData.get('description') ?? '').trim().slice(0, 120)
  const productId    = Number(formData.get('productId'))
  const cantidad     = Math.max(1, Number(formData.get('cantidad')) || 1)
  const costoUnitario= +Number(formData.get('costoUnitario') || 0)

  // 1) Crear orden
  const resCreate = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ titulo, descripcion })
  })
  const j1 = await resCreate.json()
  if (!resCreate.ok) {
    return { ...normalizeErrors(j1), success: '' }
  }

  // intenta obtener el id de la orden creada
  const orderId = j1?.order?.id ?? j1?.id
  if (!orderId) {
    return { errors: ['No se pudo obtener el ID de la orden creada.'], success: '' }
  }

  // 2) Agregar item a la nueva orden
  const resItems = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items: [{ productId, cantidad, costoUnitario }] })
  })
  const j2 = await resItems.json()
  if (!resItems.ok) {
    return { ...normalizeErrors(j2), success: '' }
  }

  return { success: 'Producto agregado a la nueva orden', errors: [], order: j2.order ?? { id: orderId } }
}