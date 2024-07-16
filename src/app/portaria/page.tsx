'use client';

import GatewayPage from "@/lib/features/gateways/Gateways";

export default function CreateGate({
  searchParams,
}: Readonly<{
  searchParams?: {
    query?: string;
  };
}>) {
  const query = searchParams?.query ?? '';
    return (
        <GatewayPage query={query} />
    );
}