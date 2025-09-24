// app/admin/cotizaciones/page.tsx  (o donde tengas esta ruta)
import { cookies } from 'next/headers'
import QuotesSentTable from '@/components/admin/QuoteSentTable'

export default async function OrdersQuotesPage() {
  const token = (await cookies()).get('50TA_TOKEN')?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/sent`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const quotes = await res.json()
  return <QuotesSentTable quotes={quotes} />
}