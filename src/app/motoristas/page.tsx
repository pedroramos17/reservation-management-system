'use client';

import dynamic from 'next/dynamic'

const CustomerList = dynamic(() => import("@/lib/features/customers/CustomerList"), { ssr: false })

interface DriverPageProps {
  readonly searchParams?: {
    query?: string;
  };
}

export default function Page({ searchParams }: DriverPageProps) {
  const query = searchParams?.query ?? '';
  return <CustomerList query={query} />
}