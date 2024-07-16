'use client';

import DriverPage from "@/lib/features/drivers/Drivers";

interface DriverPageProps {
  readonly searchParams?: {
    query?: string;
  };
}

export default function Page({ searchParams }: DriverPageProps) {
  const query = searchParams?.query ?? '';
  return <DriverPage query={query} />
}