"use server";

import { cookies } from "next/headers";

export type ImportExcelResult =
  | {
      ok: true;
      quoteId: string;
      empresas: number[];
      productosCreados: number;
      productosReutilizados: number;
      advertencias: string[];
    }
  | {
      ok: false;
      error?: string;
      errors?: { fila: number; campo: string; mensaje: string }[];
    };

export async function importExcelAction(
  formData: FormData,
): Promise<ImportExcelResult> {
  const token = (await cookies()).get("50TA_TOKEN")?.value;
  if (!token) return { ok: false, error: "No autenticado" };

  const file = formData.get("file");
  const empresasRaw = formData.get("empresas")?.toString();
  const tipoRaw = formData.get("tipo")?.toString() ?? "productos";

  if (!file || !(file instanceof Blob)) {
    return { ok: false, error: "El archivo es obligatorio" };
  }

  if (!empresasRaw) {
    return { ok: false, error: "Las organizaciones son obligatorias" };
  }

  // Validar extensión en el front-action
  const fileName = (file as File).name ?? "";
  if (!fileName.endsWith(".xlsx")) {
    return { ok: false, error: "El archivo debe ser un .xlsx" };
  }

  // Reenviar el FormData tal cual al backend
  const fd = new FormData();
  fd.append("file", file);
  fd.append("empresas", empresasRaw);
  fd.append("tipo", tipoRaw);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quotes/import-excel`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
      cache: "no-store",
    },
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // El backend devuelve { message, errors[] } cuando hay errores de validación
    if (json?.errors?.length) {
      return { ok: false, errors: json.errors };
    }
    return {
      ok: false,
      error: json?.message ?? "Error al procesar el archivo",
    };
  }

  return {
    ok: true,
    quoteId: json.quoteId,
    empresas: json.empresas,
    productosCreados: json.productosCreados ?? 0,
    productosReutilizados: json.productosReutilizados ?? 0,
    advertencias: json.advertencias ?? [],
  };
}
