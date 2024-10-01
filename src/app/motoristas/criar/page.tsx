'use client';

import dynamic from 'next/dynamic'

const CustomerForm = dynamic(() => import("@/lib/features/customers/CustomerForm"), { ssr: false })

export default function CreateDriver() {
  return (
    <CustomerForm id={''} />
  )
}
