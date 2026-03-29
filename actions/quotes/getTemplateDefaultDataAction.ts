'use server'

import { cookies } from 'next/headers'

type TemplateDefaultData = {
  destinatario: string
  presente: string
  descripcion: string
  folio: string
  lugar: string
  incluirFirma: boolean
  firmanteNombre: string
  firmanteCargo: string
  condicionesItems: string[]
  condicionesText: string
  condicionesMode: 'list' | 'text'
}

export async function getTemplateDefaultDataAction(empresa: number): Promise<{
  success: boolean
  data?: TemplateDefaultData
  error?: string
}> {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  if (!token) {
    return { success: false, error: 'No autorizado' }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/templates/default-data?empresa=${empresa}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Error al obtener datos de la plantilla')
    }

    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}