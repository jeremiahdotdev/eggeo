import type { Metadata } from 'next';
import { appText } from '@eggeo/domain';
import { EggeoNavBar, EggeoText, type EggeoNavItem } from '@eggeo/ui';
import { EventSelectionProvider } from '@/components/EventSelection';
import { getEventsForUser } from '@/lib/events';
import './globals.css';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Eggeo',
  description: 'A geolocation egg hunt app.',
};

const signedInLinks: EggeoNavItem[] = [
  { href: '/find', key: 'find', label: appText.nav.find },
  { href: '/hide', key: 'hide', label: appText.nav.hide },
  { href: '/locator', key: 'locator', label: appText.nav.locator },
  { href: '/panel', key: 'panel', label: appText.nav.panel },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const initialEvents = session ? await getEventsForUser(session.username) : [];

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="top-nav">
            <EggeoNavBar brandHref={session ? '/dashboard' : '/'} brandLabel={appText.brand.title} items={session ? signedInLinks : []} />
          </header>
          <EventSelectionProvider initialEvents={initialEvents}>{children}</EventSelectionProvider>
          <footer className="bottom-nav">
            <div className="nav-inner">
              <a className="footer-link" href="/privacy">
                <EggeoText colorized>Privacy Policy</EggeoText>
              </a>
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
