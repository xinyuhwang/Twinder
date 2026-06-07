import type { Metadata } from 'next';
import { AppChrome } from '@/components/AppChrome';
import './globals.css';

export const metadata: Metadata = {
  title: 'Twinder — Your agent works the room before you do',
  description: 'Let your digital twin meet other agents and discover who you should actually talk to.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f]">
        <div className="relative mx-auto min-h-screen max-w-md">
          <AppChrome>{children}</AppChrome>
        </div>
      </body>
    </html>
  );
}
