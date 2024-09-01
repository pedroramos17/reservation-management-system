'use client';

import CustomerPage from "@/lib/features/customers/Customers";

interface DriverPageProps {
  readonly searchParams?: {
    query?: string;
  };
}

export default function Page({ searchParams }: DriverPageProps) {
  const query = searchParams?.query ?? '';
  return <CustomerPage query={query} />
}