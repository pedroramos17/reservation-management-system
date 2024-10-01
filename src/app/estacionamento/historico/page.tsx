'use client';

import dynamic from 'next/dynamic'

const BookingList = dynamic(() => import("@/lib/features/bookings/BookingList"), { ssr: false })

export default function Page() {
    return <BookingList />;
}