'use client';

import CustomerForm from '@/lib/features/customers/CustomerForm';

export default function EditFormDriver({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;

  return (
    <CustomerForm id={id} />
  );
}
