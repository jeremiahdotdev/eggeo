import Link from 'next/link';

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
  const links = setup ? setupLinks : signedInLinks;

  if (!isSignedIn) {
    return (
      <nav className="nav-links" aria-label={compact ? 'Footer' : 'Primary'}>
        <Link className="nav-link" href="/signin">
          Sign In
        </Link>
      </nav>
    );
  }

  return (
    <nav className="nav-links" aria-label={compact ? 'Footer' : 'Primary'}>
      {links.map((link) => (
        <Link className="nav-link" href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
