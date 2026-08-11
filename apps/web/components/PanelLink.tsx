import Link from 'next/link';

export function PanelLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="button secondary" href={href}>
      {label}
    </Link>
  );
}
