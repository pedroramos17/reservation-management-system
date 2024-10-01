'use client';

import dynamic from 'next/dynamic'

const PropertyList = dynamic(() => import("@/lib/features/properties/PropertyList"), { ssr: false })

export default function Page() {
    return <PropertyList />;
}