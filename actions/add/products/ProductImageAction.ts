'use server';

const API = process.env.NEXT_PUBLIC_API_URL

export async function getProductImageDataUrl(id: string): Promise<string | null> {
  if (!id) return null;

  // ¡Asegúrate que NEXT_PUBLIC_API_URL esté definida!
  return `${process.env.NEXT_PUBLIC_API_URL}/products/${id}/image`;
}