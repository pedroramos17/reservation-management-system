'use client';

import { useEffect, useState } from 'react';
import Driver from './motoristas/page';
export default function App() {
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


  return (
      <Driver />
  );
}
