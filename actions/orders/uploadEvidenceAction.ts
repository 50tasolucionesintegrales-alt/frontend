'use server';

import normalizeErrors from '@/src/helpers/normalizeError';
import { PurchaseOrderItem, successSchema } from '@/src/schemas';
import { cookies } from 'next/headers';

export type ActionState = {
  success: string;
  errors: string[];
  item: PurchaseOrderItem | null;
};

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadEvidenceAction(prevState: ActionState, formData: FormData) {
  const token = (await cookies()).get('50TA_TOKEN')?.value;
  const itemId = formData.get('itemId') as string | null;
  const file = formData.get('file') as File | null;

  if (!token) return { success: '', item: null, errors: ['No hay token de autenticación'] };
  if (!itemId || !file) return { success: '', item: null, errors: ['Falta archivo o itemId'] };

  // Validaciones previas (coinciden con tu controller)
  if (!ALLOWED.includes(file.type)) {
    return { success: '', item: null, errors: ['Formato no permitido. Usa JPG, PNG, WEBP, HEIC/HEIF'] };
  }
  if (file.size > MAX_BYTES) {
    return { success: '', item: null, errors: ['El archivo supera 5 MB'] };
  }

  // Construye un FormData limpio sólo con "file" (Multer ignora campos extra, pero así queda más claro)
  const fd = new FormData();
  fd.set('file', file, file.name);

  // POST multipart
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/items/${itemId}/evidence`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
    cache: 'no-store',
  });

  // Intenta leer JSON (puede fallar si backend lanza excepción sin body JSON)
  let json: any = {};
  try {
    json = await res.json();
  } catch {
    /* noop */
  }

  if (!res.ok) {
    return { success: '', item: null, ...normalizeErrors(json) };
  }

  // Tu endpoint devuelve { message, itemId, size }
  const { message } = successSchema.safeParse(json).success ? json : { message: 'Evidencia subida' };

  // Re-fetch del item para refrescar la UI
  try {
    const ref = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/items/${itemId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (ref.ok) {
      const item: PurchaseOrderItem = await ref.json();
      return { success: message, item, errors: [] };
    }
  } catch {
    // Si falla el re-fetch, al menos regresamos el éxito
  }

  return { success: message, item: null, errors: [] };
}