'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function App() {
  const router = useRouter();
  const [isDBReady, setIsDBReady] = useState(false);

  // wrap everything in a provider that ensures IndexedDB is ready
  useEffect(() => {
    if (indexedDB) {
      import('@/lib/db/idb').then(() => {
        setIsDBReady(true);
      });
    }
  }, []);

  if (!isDBReady) {
    return <div>Loading...</div>;
  }


  return router.push('/propriedades');
}
