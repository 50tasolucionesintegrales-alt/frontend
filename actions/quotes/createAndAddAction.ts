'use server';

import normalizeErrors from '@/src/helpers/normalizeError';
import { cookies } from 'next/headers';

type ActionState = { errors: string[]; success: string; quoteId?: string };

export async function createDraftAndAddItemAction(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = (await cookies()).get('50TA_TOKEN')?.value;

  const title        = String(formData.get('title') || '').trim() || 'Cotización rápida';
  const description  = String(formData.get('description') || '').trim() || '';
  const productId    = Number(formData.get('productId'));
  const cantidad     = Number(formData.get('cantidad') || 1);
  const costoUnitario = Number(formData.get('costoUnitario') || 0);
  const unidad      = String(formData.get('unidad') || 'unidad').trim() || 'unidad';

  if (!productId || cantidad <= 0) {
    return { errors: ['Datos inválidos para crear la cotización'], success: '' };
  }

  // 1) Crear draft
  const resCreate = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tipo: 'productos',      // estamos en detalle de producto
      titulo: title,
      descripcion: description || null,
    }),
  });

  const jsonCreate = await resCreate.json();
  if (!resCreate.ok) {
    return { ...normalizeErrors(jsonCreate), success: '' };
  }

  const newQuoteId = jsonCreate?.quote?.id;
  if (!newQuoteId) {
    return { errors: ['No se pudo obtener el ID de la nueva cotización'], success: '' };
  }

  // 2) Agregar el producto a esa cotización
  const resItems = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${newQuoteId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [
        {
          tipo: 'producto',
          productId,
          cantidad,
          costoUnitario: +costoUnitario.toFixed(2),
            unidad,
        },
      ],
    }),
  });

  const jsonItems = await resItems.json();
  if (!resItems.ok) {
    return { ...normalizeErrors(jsonItems), success: '' };
  }

  return {
    errors: [],
    success: 'Cotización creada y producto agregado',
    quoteId: String(newQuoteId),
  };
}
