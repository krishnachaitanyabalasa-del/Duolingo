'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useUserContext();

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        router.replace('/learn');
      } else {
        router.replace('/login');
      }
    }
  }, [authLoading, isAuthenticated, router]);

  return null;
}

