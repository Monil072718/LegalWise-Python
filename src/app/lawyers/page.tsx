"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LawyersIndex() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/find-lawyer');
  }, [router]);

  return null;
}
