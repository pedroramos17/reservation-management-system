'use client';

import dynamic from 'next/dynamic'

const BookingPage = dynamic(() => import("@/lib/features/bookings/Booking"), { ssr: false })

interface BookingPageProps {
    readonly searchParams?: {
      query?: string;
    };
  }
export default function Page({ searchParams }: BookingPageProps) {
       const query = searchParams?.query ?? '';
    return <BookingPage query={query} />;
}