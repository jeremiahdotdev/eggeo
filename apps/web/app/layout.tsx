import type { Metadata } from 'next';
import Link from 'next/link';
import { EggIcon, EggeoText } from '@eggeo/ui';
import './globals.css';
import { getSession } from '@/lib/session';
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
                <EggIcon size={28} seed="header-eggeo" strokeWidth={8} />
                <EggeoText colorized>Eggeo</EggeoText>
              </Link>
              <NavLinks isSignedIn={Boolean(session)} />
            </div>
          </header>
          {children}
          <footer className="bottom-nav">
            <div className="nav-inner">
              <a className="footer-link" href="https://jeremiah.dev" rel="noreferrer" target="_blank">
                <EggeoText colorized>jeremiah.dev</EggeoText>
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
