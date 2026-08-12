import Link from 'next/link';
import { EggeoButton } from '@eggeo/ui';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyScene } from '@/components/SkyScene';

const links = [
  { href: '/codes', label: 'Print' },
  { href: '/create', label: 'Create' },
  { href: '/hide', label: 'Hide' },
  { href: '/score', label: 'Reset Score' },
  { href: '/signout', label: 'Sign Out' },
];

export default async function PanelPage() {
  await requirePageSession();

  return (
    <SkyScene className="hero">
      <section className="panel stack" style={{ width: 'min(380px, 100%)' }}>
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            <EggeoButton intent="secondary">{link.label}</EggeoButton>
          </Link>
        ))}
      </section>
    </SkyScene>
  );
}
