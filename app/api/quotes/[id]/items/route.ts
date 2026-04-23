import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get('50TA_TOKEN')?.value

  if (!token) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
  }

  const body = await request.json()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quotes/${id}/items`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  )

  const json = await res.json().catch(() => ({}))

  return NextResponse.json(json, { status: res.status })
}