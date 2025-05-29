
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import type { ReactNode } from 'react';

export function MainLayoutClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname !== '/';

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
