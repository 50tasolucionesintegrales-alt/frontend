'use server'

import normalizeErrors from '@/src/helpers/normalizeError'
import { successSchema } from '@/src/schemas'
import { cookies } from 'next/headers'

type ActionType = {
    errors: string[]
    success: string
}

export async function createDraft(prevState: ActionType, formData: FormData) {
  const token = (await cookies()).get('50TA_TOKEN')?.value
  const body = {
    tipo: formData.get('tipo'),
    titulo: formData.get('titulo'),
    descripcion: formData.get('descripcion'),
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const json = await res.json()

  if(!res) {
    return {
        ...normalizeErrors(json),
        success: ''
    }
  }

  return {
    errors: [],
    success: 'Borrador creado'
  }
}
