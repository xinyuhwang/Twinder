'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Layers, Zap, Bookmark, User } from 'lucide-react';
import { localStore } from '@/lib/local-store';

const TABS = [
  { href: '/matches', label: 'Matches', icon: Layers },
  { href: '/arena', label: 'Arena', icon: Zap },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStore.getToken()));
  }, [pathname]);

  if (!loggedIn) return null;

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border/50 bg-nav-bg backdrop-blur"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-4">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                active ? 'text-accent' : 'text-subtle hover:text-secondary'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-accent' : ''}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
