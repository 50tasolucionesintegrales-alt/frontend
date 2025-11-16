import { cookies } from "next/headers";

export default async function getDraftOrders() {
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const draftOrders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/drafts`,{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        },
        next: { revalidate: 10 }
    }).then((res) => res.json())

    return draftOrders
}