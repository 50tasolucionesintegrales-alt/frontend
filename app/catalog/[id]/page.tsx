import ProductDetail from '@/components/catalog/productoDetalle'
import { cookies } from 'next/headers'
import React from 'react'

export default async function CatalogIdPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const resProd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    return (
        <ProductDetail producto={resProd} />
    )
}
