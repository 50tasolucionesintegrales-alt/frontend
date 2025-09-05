// /actions/quotes/agregarItemsAction.ts
'use server';

import normalizeErrors from '@/src/helpers/normalizeError';
import { cookies } from 'next/headers';

type ActionType = { errors: string[]; success: string };

type ServiceItemIn = {
  tipo: 'servicio';
  serviceId: string | number;
  cantidad: string | number;
  costoUnitario: string | number;
  unidad?: string;
};

type ProductItemIn = {
  tipo: 'producto';
  productId: string | number;
  cantidad: string | number;
  costoUnitario: string | number;
  unidad?: string;
};

type AnyItemIn = ServiceItemIn | ProductItemIn;

type ServiceItemOut = {
  tipo: 'servicio';
  serviceId: number;
  cantidad: number;
  costoUnitario: number;
  unidad: string; // siempre se envía
};

type ProductItemOut = {
  tipo: 'producto';
  productId: number;
  cantidad: number;
  costoUnitario: number;
  unidad: string; // siempre se envía
};

type AddItemsDto = { items: Array<ServiceItemOut | ProductItemOut> };

function coerceNumber(n: unknown): number | null {
  const v = typeof n === 'string' ? n.trim() : n;
  const num = Number(v);
  return Number.isFinite(num) ? num : null;
}

function normalizeUnidad(u?: string): string {
  const base = (u ?? 'pieza').trim();
  return base.length > 120 ? base.slice(0, 120) : base;
}

function normalizeItems(raw: unknown): AddItemsDto | { error: string } {
  if (!Array.isArray(raw)) return { error: 'Formato de items inválido' };

  const out: Array<ServiceItemOut | ProductItemOut> = [];

  for (const x of raw as AnyItemIn[]) {
    if (!x || typeof x !== 'object' || !('tipo' in x)) {
      return { error: 'Algún item no cumple el esquema requerido' };
    }

    const unidad = normalizeUnidad((x as any).unidad);

    if (x.tipo === 'servicio') {
      const serviceId = coerceNumber(x.serviceId);
      const cantidad = coerceNumber(x.cantidad);
      const costoUnitario = coerceNumber(x.costoUnitario);
      if (serviceId === null || serviceId < 1) return { error: 'serviceId inválido' };
      if (cantidad === null || cantidad < 1 || !Number.isInteger(cantidad)) return { error: 'cantidad inválida' };
      if (costoUnitario === null || costoUnitario <= 0) return { error: 'costoUnitario inválido' };

      out.push({
        tipo: 'servicio',
        serviceId,
        cantidad,
        costoUnitario: Math.round(costoUnitario * 100) / 100,
        unidad,
      });
      continue;
    }

    if (x.tipo === 'producto') {
      const productId = coerceNumber((x as any).productId);
      const cantidad = coerceNumber(x.cantidad);
      const costoUnitario = coerceNumber(x.costoUnitario);
      if (productId === null || productId < 1) return { error: 'productId inválido' };
      if (cantidad === null || cantidad < 1 || !Number.isInteger(cantidad)) return { error: 'cantidad inválida' };
      if (costoUnitario === null || costoUnitario <= 0) return { error: 'costoUnitario inválido' };

      out.push({
        tipo: 'producto',
        productId,
        cantidad,
        costoUnitario: Math.round(costoUnitario * 100) / 100,
        unidad,
      });
      continue;
    }

    return { error: 'tipo debe ser "producto" o "servicio"' };
  }

  return { items: out };
}

export async function addItemsAction(prevState: ActionType, formData: FormData) {
  const quoteId = formData.get('quoteId');
  const rawItems = formData.get('items');
  const token = (await cookies()).get('50TA_TOKEN')?.value;

  if (!quoteId || !rawItems) {
    return { errors: ['Faltan datos para agregar ítems'], success: '' };
  }
  if (!token) {
    return { errors: ['No hay token de autenticación'], success: '' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(rawItems));
  } catch {
    return { errors: ['Items debe ser un JSON válido'], success: '' };
  }

  const normalized = normalizeItems(parsed);
  if ('error' in normalized) {
    return { errors: [normalized.error], success: '' };
  }

  console.log('Agregar items a cotización', quoteId, normalized);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    body: JSON.stringify(normalized),
  });

  const json = await res.json();

  if (!res.ok) {
    return { ...normalizeErrors(json), success: '' };
  }

  return { errors: [], success: 'Ítems agregados correctamente' };
}
