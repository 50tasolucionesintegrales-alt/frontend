import { cookies } from "next/headers";

export default async function getSentOrders() {
    const token = (await cookies()).get('50TA_TOKEN')?.value

    const sendOrders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/sent/mine`,{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.json())

    return sendOrders.orders
}