
"use client";

// This component is currently not strictly necessary as the Header is always shown.
// However, keeping it in case client-side logic is needed for the main layout in the future.
// For now, it just renders its children.
// If Header needed to be client-side for other reasons (e.g. dynamic user info), it would be placed here.

import type { ReactNode } from 'react';
// import { usePathname } from 'next/navigation';
// import { Header } from '@/components/Header';

export function MainLayoutClientWrapper({ children }: { children: ReactNode }) {
  // const pathname = usePathname();
  // const showHeader = pathname !== '/'; // Example: if you wanted to hide header on some pages

  return (
    <>
      {/* {showHeader && <Header />} */} {/* Header is now rendered directly in RootLayout */}
      {children}
    </>
  );
}
