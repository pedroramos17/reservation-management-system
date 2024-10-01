'use client';

import dynamic from 'next/dynamic'

const CustomerForm = dynamic(() => import("@/lib/features/customers/CustomerForm"), { ssr: false })

export default function EditFormDriver({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;

  return (
    <CustomerForm id={id} />
  );
}
