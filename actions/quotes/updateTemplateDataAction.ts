'use server'

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

type UpdateTemplateData = {
  empresa: number
  destinatario?: string
  presente?: string
  descripcion?: string
  folioPrefix?: string
  lugar?: string
  incluirFirma?: boolean
  firmanteNombre?: string
  firmanteCargo?: string
  condicionesItems?: string[]
  condicionesText?: string
  condicionesMode?: 'list' | 'text'
}

export async function updateTemplateDataAction(data: UpdateTemplateData) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  if (!token) {
    return { success: false, error: 'No autorizado' }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al actualizar la plantilla')
    }

    const result = await res.json()
    
    // Revalidar los datos de la plantilla
    revalidateTag(`template-data-${data.empresa}`, 'max')
    
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}