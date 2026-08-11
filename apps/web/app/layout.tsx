import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getSession } from '@/lib/session';
import { EggIcon } from '@/components/EggIcon';
import { NavLinks } from '@/components/NavLinks';

export const metadata: Metadata = {
  title: 'Eggeo',
  description: 'A geolocation egg hunt app.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="top-nav">
            <div className="nav-inner">
              <Link className="brand" href={session ? '/dashboard' : '/'}>
                <EggIcon size={28} color="#ffd75a" />
                <span>Eggeo</span>
              </Link>
              <NavLinks isSignedIn={Boolean(session)} />
            </div>
          </header>
          {children}
          <footer className="bottom-nav">
            <div className="nav-inner">
              <NavLinks isSignedIn={Boolean(session)} compact />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
