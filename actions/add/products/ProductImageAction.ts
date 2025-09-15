'use server';

import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL

export async function getProductImageDataUrl(id: string): Promise<string | null> {
  if (!API) throw new Error('API URL not configured');
  const token = (await cookies()).get('50TA_TOKEN')?.value;
  if (!token) return null;

  const res = await fetch(`${API}/products/${id}/image?disposition=inline`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    // 404 = sin imagen, otras respuestas = error
    if (res.status === 404) return null;
    throw new Error(`Upstream error ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || 'image/*';
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  // data URL serializable para el cliente
  return `data:${contentType};base64,${base64}`;
}