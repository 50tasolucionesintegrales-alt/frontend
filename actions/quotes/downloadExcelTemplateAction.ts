"use server";

import { cookies } from "next/headers";

export async function downloadExcelTemplateAction(
  empresaIds: number[],
  numProductos: number = 10,
): Promise<{
  buffer?: string;
  filename?: string;
  error?: string;
}> {
  const token = (await cookies()).get("50TA_TOKEN")?.value;
  if (!token) return { error: "No autenticado" };
  if (!empresaIds.length) return { error: "Selecciona al menos una organización" };

  const params = empresaIds.join(",");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quotes/excel/template?empresas=${params}&numProductos=${numProductos}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    try {
      const j = await res.json();
      return { error: j?.message ?? "Error al generar la plantilla" };
    } catch {
      return { error: "Error al generar la plantilla" };
    }
  }

  const buf = await res.arrayBuffer();
  const base64 = Buffer.from(buf).toString("base64");
  const filename = `cotizacion_plantilla_${empresaIds.join("-")}.xlsx`;

  return { buffer: base64, filename };
}