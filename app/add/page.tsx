import { getProductImageDataUrl } from '@/actions/add/products/ProductImageAction'
import ProductAddAndManage from '@/components/add/ProductAddAndManage'
import { cookies } from 'next/headers'

export default async function page() {
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const categories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    const servicios = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    return <ProductAddAndManage categorias={categories} products={products} services={servicios} getProductImageDataUrl={getProductImageDataUrl} />
}
