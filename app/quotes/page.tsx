// app/quotes/page.tsx
import CreateQuoteModal from "@/components/quotes/CreateQuoteModal"
import QuotesTable from "@/components/quotes/QuotesTable"
import { cookies } from "next/headers"
import { useState } from "react"

export default async function QuotesPage() {
    const token = (await cookies()).get('50TA_TOKEN')?.value
    const resDraft = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/drafts`, { 
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: 'no-store' 
    })

    const resSend = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/sent`, { 
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: 'no-store' 
    })

    const quotesDraft = await resDraft.json()
    const quotesSend = await  resSend.json()


    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">Mis Cotizaciones</h1>
                <QuotesTable quotes={quotesDraft} type='drafts' />
            

            <section>
                <h2 className="text-2xl mb-4">Enviadas</h2>
                <QuotesTable quotes={quotesSend} type='sent' />
            </section>
        </div>
    )
}
