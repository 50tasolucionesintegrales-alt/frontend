'use client'

import { Quotes } from '@/src/schemas'
import { Eye, PlusCircle, Send } from 'lucide-react'
import React, { useState } from 'react'
import CreateQuoteModal from './CreateQuoteModal'
import Link from 'next/link'

type props = {
    quotes: Quotes
    type: 'sent' | 'drafts'
}

export default function QuotesTable({ quotes, type }: props) {
    const [open, setOpen] = useState(false)
    return (
        <section className="mb-12">
            {type === 'drafts' && (
                <div className="mb-6">
                    <button className="btn-primary" onClick={() => setOpen(true)}>
                        Nueva Cotización
                    </button>
                </div>
            )}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#174940] text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Título</th>
                            <th className="py-3 px-4 text-left">Descripción</th>
                            <th className="py-3 px-4 text-left">Creado</th>
                            <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {quotes.map(q => (
                            <tr key={q.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">{q.id}</td>
                                <td className="py-3 px-4 font-medium">{q.titulo}</td>
                                <td className="py-3 px-4">{q.descripcion ?? '—'}</td>
                                <td className="py-3 px-4">{new Date(q.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-right space-x-2">
                                    <Link href={`/quotes/${q.id}`}>
                                        <button className="text-[#174940] hover:underline flex items-center gap-1">
                                            <Eye size={16} /> Ver
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {quotes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No hay cotizaciones en borrador.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {open && (
                <CreateQuoteModal open={open} onClose={() => setOpen(false)} />
            )}
        </section>
    )
}