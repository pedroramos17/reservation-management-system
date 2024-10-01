import CustomerList from '@/lib/features/customers/CustomerList';

interface DriverPageProps {
  readonly searchParams?: {
    query?: string;
  };
}

export default function Page({ searchParams }: DriverPageProps) {
  const query = searchParams?.query ?? '';
  return <CustomerList query={query} />
}