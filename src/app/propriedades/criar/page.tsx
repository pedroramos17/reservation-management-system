'use client';

import dynamic from 'next/dynamic'

const PropertyForm = dynamic(() => import("@/lib/features/properties/PropertyForm"), { ssr: false })

export default function Page() {

    return (<PropertyForm id="" />)
}