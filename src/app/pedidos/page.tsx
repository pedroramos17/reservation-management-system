'use client';

import dynamic from 'next/dynamic'

const OrderList = dynamic(() => import("@/lib/features/orders/OrderList"), { ssr: false })

export default function Page() {
    return <OrderList />;
}