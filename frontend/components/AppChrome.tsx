'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { localStore } from '@/lib/local-store';

function shouldHideNav(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname === '/demo') return true;
  if (pathname === '/join') return true;
  if (pathname.startsWith('/onboarding')) return true;
  if (pathname.startsWith('/auth')) return true;
  if (/^\/matches\/[^/]+$/.test(pathname)) return true;
  if (pathname.startsWith('/room/')) return true;
  return false;
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const loggedIn = Boolean(localStore.getToken());
    setShowNav(loggedIn && !shouldHideNav(pathname));
  }, [pathname]);

  return (
    <>
      <div className={showNav ? 'pb-20' : ''}>{children}</div>
      {showNav && <BottomNav />}
    </>
  );
}
