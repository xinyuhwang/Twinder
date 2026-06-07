import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppChrome } from '@/components/AppChrome';
import { CopilotProvider } from '@/components/CopilotProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { THEME_STORAGE_KEY } from '@/lib/theme';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Twinder — Your agent works the room before you do',
  description: 'Let your digital twin meet other agents and discover who you should actually talk to.',
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} min-h-screen twinder-background font-sans text-primary antialiased`}>
        <div className="relative mx-auto w-full min-h-screen max-w-md">
          <ThemeProvider>
            <CopilotProvider>
              <AppChrome>{children}</AppChrome>
            </CopilotProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
