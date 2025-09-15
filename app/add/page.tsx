import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction'
import ProductAddAndManage from '@/components/add/ProductAddAndManage'
import { cookies } from 'next/headers'
import { LayoutGrid } from 'lucide-react'

export default async function page() {
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const categories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.json())

    const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.json())

    const servicios = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.json())

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <LayoutGrid size={28} className="text-[#63B23D]" />
                <div>
                    <h1 className="text-3xl font-bold text-[#0F332D]">
                        Administrar Productos y Servicios
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Crea, edita y gestiona todos tus productos y servicios fácilmente
                    </p>
                </div>
            </div>

            <ProductAddAndManage 
                categorias={categories} 
                products={products} 
                services={servicios} 
                getProductImageDataUrl={getProductImageDataUrl} 
            />
        </div>
    )
}