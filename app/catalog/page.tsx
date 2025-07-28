import Catalogo from "@/components/catalog/Catalogo"
import { cookies } from "next/headers"

export default async function CatalogPage() {
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const resCat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    const resProd = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    return (
        <Catalogo categorias={resCat} productos={resProd} />
    )
}
