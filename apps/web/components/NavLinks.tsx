'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { EggeoText } from '@eggeo/ui';

const signedInLinks = [
  { href: '/leaderboard', label: 'Ranking' },
  { href: '/find', label: 'Find' },
  { href: '/locator', label: 'Map' },
  { href: '/panel', label: 'User' },
];

const setupLinks = [
  { href: '/codes', label: 'Print' },
  { href: '/create', label: 'Create' },
  { href: '/hide', label: 'Hide' },
  { href: '/score', label: 'Reset Score' },
  { href: '/signout', label: 'Sign Out' },
];

export function NavLinks({ isSignedIn, compact = false, setup = false }: { isSignedIn: boolean; compact?: boolean; setup?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const links = setup ? setupLinks : signedInLinks;

  if (!isSignedIn) {
    return null;
  }

  const navLinks = links;
  const nav = (
    <nav className={compact ? 'nav-links' : `nav-links nav-links-menu ${isOpen ? 'is-open' : ''}`} aria-label={compact ? 'Footer' : 'Primary'}>
      {navLinks.map((link) => (
        <Link className="nav-link" href={link.href} key={link.href} onClick={() => setIsOpen(false)}>
          <EggeoText colorized>{link.label}</EggeoText>
        </Link>
      ))}
    </nav>
  );

  if (compact) {
    return nav;
  }

  return (
    <div className="nav-menu">
      <button className="nav-toggle" aria-expanded={isOpen} aria-label="Open navigation" onClick={() => setIsOpen((value) => !value)} type="button">
        <Menu aria-hidden="true" size={26} strokeWidth={3} />
      </button>
      {nav}
    </div>
  );
}
