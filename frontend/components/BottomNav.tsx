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
      className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md border-t border-zinc-800/50 bg-[#0a0a0f]/95 backdrop-blur"
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
                active ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-violet-400' : ''}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
