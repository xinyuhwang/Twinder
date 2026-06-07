import type { ReactNode } from 'react';

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = '' }: MobileShellProps) {
  return (
    <div className={`mx-auto w-full max-w-md min-h-screen ${className}`}>
      {children}
    </div>
  );
}
