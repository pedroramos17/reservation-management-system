'use client';

import 'client-only';
import { useRouter } from 'next/navigation';
export default function App() {
  const router = useRouter();

  return router.push('/propriedades');
}
